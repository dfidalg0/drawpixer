import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

// Reducers
import auth from './reducers/auth';
import ui from './reducers/ui';
import drawings from './reducers/drawings';
import community from './reducers/community';

const reducers = { auth, ui, drawings, community };

const store = createStore(
    combineReducers(reducers),
    {},
    composeWithDevTools(applyMiddleware(thunk))
);

export default store;
