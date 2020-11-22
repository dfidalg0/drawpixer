import { SET_LOAD } from '../actions/types';

const baseState = {
    loading: true
}

export default function ui(state = baseState, action){
    switch(action.type){
    case SET_LOAD:
        return { ...state, loading: action.loading };
    default:
        return state;
    }
}
