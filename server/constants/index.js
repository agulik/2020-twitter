export const TWITTER_STREAM_API = new URL(
  'https://api.twitter.com/2/tweets/search/stream'
);

export const TWITTER_RULES_API = new URL(
  'https://api.twitter.com/2/tweets/search/stream/rules'
);

export const responseErrors = {
  connection: {
    message: 'Connection error',
    detail: 'Tweets currently unavailable'
  },
  auth: {
    message: 'Unable to authenticate',
    detail: 'Please make sure you have a valid token'
  },
  notFound: {
    message: 'Not found',
    detail: 'Please make sure you have a valid route'
  }
};
