import express from 'express';
import 'express-async-errors';
import bodyParser from 'body-parser';
import socketIo from 'socket.io';
import http from 'http';
import request from 'request';
import cors from 'cors';

import { rulesRouter } from './routes/rules.js';
import { TWITTER_STREAM_API, responseErrors } from './constants/index.js';
import { sleep } from './utils/index.js';

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(rulesRouter);

app.all('*', async (req, res) => {
  res.status(404).send(responseErrors.notFound);
});

const server = http.createServer(app);
const io = socketIo(server);

const BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN;

// set up the Tweet stream
const streamTweets = (socket, token) => {
  const config = {
    url: TWITTER_STREAM_API,
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
        reconnect(stream, socket, token);
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

io.on('connection', async () => {
  try {
    io.emit('connect', 'Client connected');
    streamTweets(io, BEARER_TOKEN);
  } catch (err) {
    io.emit('authError', responseErrors.auth);
  }
});

server.listen(port, () => console.log(`Server listening on port ${port}`));
