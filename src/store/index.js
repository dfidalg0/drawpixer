import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

// Reducers
import auth from './reducers/auth';

const reducers = { auth };

const store = createStore(
    combineReducers(reducers),
    {},
    applyMiddleware(thunk)
);

export default store;
