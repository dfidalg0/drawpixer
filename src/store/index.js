import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

// Reducers
import auth from './reducers/auth';

const reducers = { auth };

const store = createStore(
    combineReducers(reducers),
    {},
    composeWithDevTools(applyMiddleware(thunk))
);

export default store;
