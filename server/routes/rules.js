import express from 'express';
import util from 'util';
import request from 'request';

import { TWITTER_RULES_API, responseErrors } from '../constants/index.js';

const BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN;

const router = express.Router();

const post = util.promisify(request.post);
const get = util.promisify(request.get);

router.get('/api/rules', async (req, res) => {
  if (!BEARER_TOKEN) {
    res.status(400).send(responseErrors.auth);
  }

  const requestConfig = {
    url: TWITTER_RULES_API,
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
        throw new Error(response.body.error);
      }
    }
    res.send(response);
  } catch (err) {
    res.send(err);
  }
});

// tell Twitter what kind of tweets we want
router.post('/api/rules', async (req, res) => {
  if (!BEARER_TOKEN) {
    res.status(400).send(responseErrors.auth);
  }

  const requestConfig = {
    url: TWITTER_RULES_API,
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
      throw new Error(response.body.error);
    }
  } catch (err) {
    res.send(err);
  }
});

export { router as rulesRouter };
