import {
    SET_DRAWINGS,
    CLEAR_DRAWINGS,
    PUSH_DRAWING
} from './types';

import axios from 'axios';

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

export const saveDrawing = (title, grid) => async (dispatch, getState) => {
    var state = getState();
    const { user, token } = state.auth;
    try {
        const { data: { _id, created_at } } = await axios.post('/api/drawings/create', {
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
    }
    catch ({ response: { data } }) {
        alert(data.message);
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

        drawings.sort((a,b) => a.created_at >= b.created_at ? -1 : 1);

        dispatch(setDrawings(drawings));
    }
    catch ({ response: { data } }) {
        alert('Erro: ' + data.message);
    }
};
