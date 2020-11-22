// Tipos de ação de autenticação
import {
    SET_TOKEN,
    SET_USER,
    EXPIRE_TOKEN
} from '../actions/types';

const baseState = {
    token: null,
    user: null
};

export default function (state = baseState, action) {
    switch(action.type){
    case SET_TOKEN:
        return { ...state, token: action.token };
    case EXPIRE_TOKEN:
        return { ...state, token: null };
    case SET_USER:
        return { ...state, user: action.user };
    default:
        return state;
    }
}
