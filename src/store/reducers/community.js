import {
    SET_COMMUNITY_DRAWINGS,
    UPDATE_LIKE,
    DELETE_LIKE
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
            return state.list ?
                { ...state, list: [...state.list].concat(action.drawings), max: action.drawings.length + state.list.length, all: all } :
                { ...state, list: action.drawings, max: action.drawings.length, all: all };
        case UPDATE_LIKE:
            state.list.map(draw => {
                if(draw._id === action.id){
                    draw.likes = true;
                    draw.num_likes = draw.num_likes + 1;
                    return draw;
                } else {
                    return draw;
                }
            });
            return state;
        case DELETE_LIKE:
            state.list.map(draw => {
                if(draw._id === action.id){
                    draw.likes = false;
                    draw.num_likes = draw.num_likes - 1;
                    return draw;
                } else {
                    return draw;
                }
            });
            return state;
        default:
            return state;
    }
}
