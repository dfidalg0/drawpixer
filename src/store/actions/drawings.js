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

export const updateDraw = (title, grid) => ({
    type: UPDATE_DRAWING,
    title,
    grid
})

export const updateMode = (title) => async (dispatch) => {
    dispatch({
        type: UPDATE_MODE,
        title
    })
}

export const setCommunityDrawings = (drawings) => ({
    type: SET_COMMUNITY_DRAWINGS,
    drawings
});

export const deleteUserDraw = (id) => async (dispatch, getState) => {
    var state = getState();
    const { token } = state.auth;


    const res = await axios.delete('api/drawing/delete/' + id, {
        headers: {
            Authorization: token
        }
    });
    dispatch(deleteDrawing(id));
    alert(res.data.message);
}

export const getCommunityDrawings = () => async (dispatch, getState) => {
    var state = getState();
    const { token } = state.auth;
    const min = state.community.max + 1;
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
        alert('Erro: ' + data.message);
    }
}

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

export const updateDrawing = (title, grid) => async (dispatch, getState) => {
    var state = getState();
    const { token } = state.auth;
    try {
        const { data } = await axios.post('/api/drawings/update', {
            title: title,
            grid: grid,
        }, {
            headers: {
                Authorization: token
            }
        });

        dispatch(updateDraw(title, grid));
        alert(data.message);
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

        drawings.sort((a, b) => a.created_at >= b.created_at ? -1 : 1);

        dispatch(setDrawings(drawings));
    }
    catch ({ response: { data } }) {
        alert('Erro: ' + data.message);
    }
};
