import {
    SET_TOKEN,
    SET_USER,
    SET_LOAD
} from './types';

import axios from 'axios';
import jwt from 'jsonwebtoken';

const setToken = token => ({
    type: SET_TOKEN,
    token
});

const setUser = user => ({
    type: SET_USER,
    user
});

const setLoading = loading => ({
    type: SET_LOAD,
    loading
})

let refreshTimeout;

const refresh = (timeout) => async (dispatch, getState) => {
    refreshTimeout = setTimeout(async () => {
        const { auth: { token } } = getState();

        try {
            const { data } = await axios.post('/api/jwt/refresh', { token });

            const newToken = data.token;

            const { exp, iat } = jwt.decode(newToken);

            dispatch(setToken(newToken));
            dispatch(refresh(exp - iat - 5 * 60));
        }
        catch (err) {
            dispatch(refresh(60));
        }
    }, timeout * 1000);
};

const loadUser = () => async (dispatch, getState) => {
    const { auth: { token } } = getState();

    if (token){
        const { exp, iat, ...user } = jwt.decode(token);
        dispatch(setUser(user));

        dispatch(refresh(exp - iat - 5 * 60));
    }
    else throw new Error('Bad call of loadUser. Token does not exist');
};

export const login = googleUser => async dispatch => {
    const { id_token: idToken } = googleUser.getAuthResponse();

    try {
        const { data: { token } } = await axios.post('/api/login', { idToken });

        dispatch(setToken(token));
        dispatch(loadUser());
    }
    catch({ response: { data } }){
        alert(data.message);
    }
};

export const checkLogin = () => async dispatch => {
    try {
        const { data } = await axios.post('/api/jwt/create');

        const { token } = data;

        if (token) {
            dispatch(setToken(token));
            dispatch(loadUser());
        }

        dispatch(setLoading(false));
    }
    catch (err) {
        console.error(err);
    }
}

export const logout = () => async (dispatch, getState) => {
    clearTimeout(refreshTimeout);
    const { auth: { token } } = getState();

    try {
        await axios.post('/api/jwt/destroy', { token });

        dispatch(setToken(null));
    }
    catch(err) {
        console.error(err);
    }
};
