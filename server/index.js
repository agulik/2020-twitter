const express = require('express');
const bodyParser = require('body-parser');
const socketIo = require('socket.io');
const http = require('http');
const util = require('util');
const request = require('request');
var cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const post = util.promisify(request.post);
const get = util.promisify(request.get);

const server = http.createServer(app);
const io = socketIo(server);

const BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN;

// 'https://api.twitter.com/2/tweets/search/stream?tweet.fields=context_annotations&expansions=author_id'
const twitterUrls = {
  stream: new URL('https://api.twitter.com/2/tweets/search/stream'),
  rules: new URL('https://api.twitter.com/2/tweets/search/stream/rules')
};

const responseErrors = {
  connection: {
    title: 'Connection error',
    detail: 'Tweets currently unavailable'
  },
  auth: {
    title: 'Unable to authenticate',
    detail: 'Please make sure you have a valid token'
  }
};

const sleep = async (delay) => {
  return new Promise((resolve) => setTimeout(() => resolve(true), delay));
};

app.get('/api/rules', async (req, res) => {
  if (!BEARER_TOKEN) {
    res.status(400).send(responseErrors.auth);
  }

  const requestConfig = {
    url: twitterUrls.rules,
    auth: {
      bearer: BEARER_TOKEN
    },
    json: true
  };

  try {
    const response = await get(requestConfig);

    if (response.statusCode !== 200) {
      if (response.statusCode === 403) {
        res.status(403).send(response.body);
      } else {
        throw new Error(response.body.err);
      }
    }

    res.send(response);
  } catch (err) {
    res.send(err);
  }
});

// tell Twitter what kind of tweets we want
app.post('/api/rules', async (req, res) => {
  if (!BEARER_TOKEN) {
    res.status(400).send(responseErrors.auth);
  }

  const requestConfig = {
    url: twitterUrls.rules,
    auth: {
      bearer: BEARER_TOKEN
    },
    json: req.body
  };

  try {
    const response = await post(requestConfig);

    if (response.statusCode === 200 || response.statusCode === 201) {
      res.send(response);
    } else {
      throw new Error(response);
    }
  } catch (err) {
    res.send(err);
  }
});

// set up the Tweet stream
const streamTweets = (socket, token) => {
  const config = {
    url: twitterUrls.stream,
    auth: {
      bearer: token
    },
    timeout: 30000
  };

  try {
    const stream = request.get(config);

    stream
      .on('data', async (data) => {
        try {
          const json = JSON.parse(data);
          if (json.connection_issue) {
            socket.emit('error', json);
            reconnect(stream, socket, token);
          } else {
            if (json.data) {
              socket.emit('tweet', json);
            } else {
              socket.emit('authError', json);
            }
          }
        } catch (err) {
          socket.emit('heartbeat');
        }
      })
      .on('error', () => {
        socket.emit('error', responseErrors.connection);
        // reconnect(stream, socket, token);
      });
  } catch (err) {
    socket.emit('authError', responseErrors.auth);
  }
};

const reconnect = async (stream, socket, token) => {
  stream.abort();
  await sleep(5000);
  streamTweets(socket, token);
};

io.on('connection', async (socket) => {
  try {
    io.emit('connect', 'Client connected');
    streamTweets(io, BEARER_TOKEN);
  } catch (err) {
    io.emit('authError', responseErrors.auth);
  }
});

server.listen(port, () => console.log(`Server listening on port ${port}`));
