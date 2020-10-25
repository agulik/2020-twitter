import { takeLatest } from 'redux-saga/effects';

import { FeedTypes as Types } from '../../containers/feed/feed.redux';
import * as Sagas from '../../containers/feed/feed.sagas';

const listeners = [takeLatest(Types.PUSH_TWEET, Sagas.watchTweet)];

export default listeners;
