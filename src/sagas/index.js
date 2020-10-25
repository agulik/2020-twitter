import { all } from 'redux-saga/effects';

import FeedSagasListeners from './listeners/feed-listeners';

export default function* root() {
  yield all([...FeedSagasListeners]);
}
