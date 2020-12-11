import {
    SET_DRAWINGS,
    CLEAR_DRAWINGS,
    PUSH_DRAWING,
    DELETE_DRAWING,
    UPDATE_DRAWING,
    UPDATE_MODE,
    SET_COMMUNITY_DRAWINGS,
} from './types';

import axios from 'axios';
import { notify } from './ui';

export const setDrawings = (drawings) => ({
    type: SET_DRAWINGS,
    drawings
});

export const clearDrawings = () => ({
    type: CLEAR_DRAWINGS
});

export const pushDrawing = (drawing) => ({
    type: PUSH_DRAWING,
    drawing
})

export const deleteDrawing = (id) => ({
    type: DELETE_DRAWING,
    id
})

export const updateDraw = (id, grid) => ({
    type: UPDATE_DRAWING,
    id,
    grid
})

export const updateMode = (id) => async (dispatch) => {
    dispatch({
        type: UPDATE_MODE,
        id
    })
}

export const setCommunityDrawings = (drawings) => ({
    type: SET_COMMUNITY_DRAWINGS,
    drawings
});

export const deleteUserDraw = (id) => async (dispatch, getState) => {
    var state = getState();
    const { token } = state.auth;

    try {
        const res = await axios.delete('api/drawing/delete/' + id, {
            headers: {
                Authorization: token
            }
        });
        dispatch(deleteDrawing(id));
        dispatch(notify(res.data.message), 'success');
    }
    catch({ response: { data } }){
        dispatch(notify(data.message, 'error'));
    }
}

export const getCommunityDrawings = () => async (dispatch, getState) => {
    var state = getState();
    const { token } = state.auth;
    const min = state.community.max;
    try {
        const { data: drawings } = await axios.get('/api/drawings/community/' + min, {
            headers: {
                Authorization: token
            }
        });

        drawings.sort((a, b) => a.created_at >= b.created_at ? -1 : 1);
        dispatch(setCommunityDrawings(drawings));
    }
    catch ({ response: { data } }) {
        dispatch(notify(data.message, 'error'));
    }
}

export const saveDrawing = (title, grid) => async (dispatch, getState) => {
    var state = getState();
    const { user, token } = state.auth;
    try {
        const { data: { message, _id, created_at } } = await axios.post('/api/drawings/create', {
            title: title,
            grid: grid,
        }, {
            headers: {
                Authorization: token
            }
        });

        dispatch(pushDrawing({
            _id, title, created_at, grid, user: {
                _id: user._id,
                name: user.name
            }
        }));
        dispatch(notify(message, 'success'));
    }
    catch ({ response: { data } }) {
        dispatch(notify(data.message, 'error'));
    }
};

export const updateDrawing = (id, grid) => async (dispatch, getState) => {
    var state = getState();
    const { token } = state.auth;
    try {
        const { data } = await axios.post('/api/drawings/update', {
            id: id,
            grid: grid,
        }, {
            headers: {
                Authorization: token
            }
        });

        dispatch(updateDraw(id, grid));
        dispatch(notify(data.message, 'success'));
    }
    catch ({ response: { data } }) {
        dispatch(notify(data.message, 'error'));
    }
};

export const fetchUserDrawings = () => async (dispatch, getState) => {
    var state = getState();
    const { token } = state.auth;
    try {
        const { data: drawings } = await axios.get('/api/drawings/mine', {
            headers: {
                Authorization: token
            }
        });

        drawings.sort((a, b) => a.created_at >= b.created_at ? -1 : 1);

        dispatch(setDrawings(drawings));
    }
    catch ({ response: { data } }) {
        dispatch(notify(data.message, 'error'));
    }
};
