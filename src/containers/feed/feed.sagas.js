import { put, select } from 'redux-saga/effects';

import FeedActions from './feed.redux';

export function* watchTweet({ tweet }) {
  try {
    const {
      feed: { rules }
    } = yield select();
    const tweetMatchId = tweet.matching_rules[0].id;
    const rule = rules.find((rule) => parseInt(rule.id) === tweetMatchId);
    if (!rule || !rule.value) {
      throw new Error('Unable to find rule');
    }
    if (rule.value === 'Donald Trump') {
      yield put(FeedActions.pushDonaldTweet(tweet));
    } else {
      yield put(FeedActions.pushHillaryTweet(tweet));
    }
  } catch (error) {
    console.log(error);
  }
}
