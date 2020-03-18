import { createStore, applyMiddleware, compose } from 'redux';
// import { composeWithDevTools } from 'remote-redux-devtools';
import reducers from 'reducers';
import thunk from 'redux-thunk';

// const composeEnhancers = composeWithDevTools({ realtime: true });	// To turn it off in production:
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export default function configureStore(initialState) {
  return createStore(reducers, initialState, composeEnhancers(applyMiddleware(thunk)));
}
