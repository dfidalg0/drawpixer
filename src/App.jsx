import React, { useEffect } from 'react';

import LoadingScreen from './views/loading-screen';
import LoginScren from './views/login-screen';
import Main from './views/main';

import { connect } from 'react-redux';
import { checkLogin } from './store/actions/auth';

import './App.css';

window.mouseDown = false;
document.onmousedown = function (event) {
    window.button = event.button;
    window.mouseDown = true;
}
document.onmouseup = function () {
    window.mouseDown = false;
}

function App({ loading, isAuthenticated, checkLogin }) {
    useEffect(() => {
        checkLogin();
    }, [checkLogin]);

    return loading ?
        <LoadingScreen /> :
        isAuthenticated ?
            <Main /> :
            <LoginScren />
}

export default connect(
    state => ({
        isAuthenticated: Boolean(state.auth.token),
        loading: state.ui.loading
    }),
    { checkLogin }
)(App);
