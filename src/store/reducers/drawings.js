import {
    SET_DRAWINGS,
    CLEAR_DRAWINGS,
    PUSH_DRAWING
} from '../actions/types';

const baseState = {
    list: null
};

export default function reducer (state = baseState, action){
    switch(action.type){
    case SET_DRAWINGS:
        return { ...state, list: action.drawings };
    case CLEAR_DRAWINGS:
        return { ...state, list: null };
    case PUSH_DRAWING:
        return state.list ?
            { ...state, list: [action.drawing, ...state.list ] } :
            state;
    default:
        return state;
    }
}
