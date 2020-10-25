import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';

import rootReducer from './redux';
import sagas from './sagas';

const configureStore = () => {
  const initialState = {};
  const enhancers = [];
  const sagaMiddleware = createSagaMiddleware();

  const middleware = [sagaMiddleware];

  if (process.env.NODE_ENV === 'development') {
    const devToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION__;

    if (typeof devToolsExtension === 'function') {
      enhancers.push(devToolsExtension());
    }
  }

  const composedEnhancers = compose(
    applyMiddleware(...middleware),
    ...enhancers
  );

  const store = createStore(rootReducer, initialState, composedEnhancers);

  sagaMiddleware.run(sagas);

  return { store };
};

export default configureStore;
