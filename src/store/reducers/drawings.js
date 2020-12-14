import {
    SET_DRAWINGS,
    CLEAR_DRAWINGS,
    PUSH_DRAWING,
    DELETE_DRAWING,
    UPDATE_MODE,
    UPDATE_DRAWING,
} from '../actions/types';

const baseState = {
    list: null,
    edit: {
        id: null
    }
};

export default function reducer(state = baseState, action) {
    switch (action.type) {
        case SET_DRAWINGS:
            return { ...state, list: action.drawings };
        case CLEAR_DRAWINGS:
            return { ...state, list: null };
        case PUSH_DRAWING:
            return state.list ?
                { ...state, list: [action.drawing, ...state.list]} :
                state;
        case DELETE_DRAWING:
            const newDrawings = state.list.filter(draw => draw._id !== action.id);
            const edit = action.id === state.edit.id ? { id: null } : state.edit;
            return { ...state, list: newDrawings, edit };
        case UPDATE_MODE:
            return {...state, edit: {id: action.id}}
        case UPDATE_DRAWING:
            state.list.map(draw => (draw._id === action.id ? draw.grid = action.grid : draw));
            return state;
        default:
            return state;
    }
}
