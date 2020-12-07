import {
    SET_COMMUNITY_DRAWINGS
} from '../actions/types';

const baseState = {
    list: null,
    max: 0,
    all: false
};

export default function reducer(state = baseState, action) {
    switch (action.type) {
        case SET_COMMUNITY_DRAWINGS:
            const all = action.drawings.length < 10;
            return state.list?
            { ...state, list: [...state.list].concat(action.drawings), max: action.drawings.length + state.list.length, all: all }:
            { ...state, list: action.drawings, max: action.drawings.length, all: all };
        default:
            return state;
    }
}
