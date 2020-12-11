import {
    Grow as GrowTransition
} from '@material-ui/core';

import React, { useEffect } from 'react';

import LoadingScreen from './views/loading-screen';
import LoginScren from './views/login-screen';
import Main from './views/main';

import { useSelector, useDispatch } from 'react-redux';
import { checkLogin } from './store/actions/auth';
import { clearNotify } from './store/actions/ui';

import { useSnackbar } from 'notistack';

import './App.css';

window.mouseDown = false;
document.onmousedown = function (event) {
    window.button = event.button;
    window.mouseDown = true;
}
document.onmouseup = function () {
    window.mouseDown = false;
}

export default function App() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(checkLogin());
    }, [dispatch]);

    const { enqueueSnackbar } = useSnackbar();

    const notif = useSelector(state => state.ui.notification);

    useEffect(() => {
        if (notif) {
            enqueueSnackbar(notif.msg, {
                variant: notif.variant,
                anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'center'
                },
                TransitionComponent: GrowTransition,
                autoHideDuration: 2500
            });
            dispatch(clearNotify());
        }
    }, [notif, enqueueSnackbar, dispatch]);

    const { loading, isAuthenticated } = useSelector(state => ({
        isAuthenticated: Boolean(state.auth.token),
        loading: state.ui.loading
    }));

    return loading ?
        <LoadingScreen /> :
        isAuthenticated ?
            <Main /> :
            <LoginScren />
}
