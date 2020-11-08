import React, { useEffect } from 'react';

import LoadingScreen from './views/loading-screen';
import LoginScren from './views/login-screen';
import Main from './views/main';

import { connect } from 'react-redux';
import { checkLogin, logout } from './store/actions/auth';

import './App.css';

function App({ loading, isAuthenticated, checkLogin, logout }) {
    useEffect(() => {
        checkLogin();
        setTimeout(logout, 10000);
    }, [checkLogin, logout]);

    return loading ?
        <LoadingScreen /> :
        isAuthenticated ?
            <Main /> :
            <LoginScren />
}

export default connect(
    state => ({
        isAuthenticated: Boolean(state.auth.token),
        loading: state.auth.loading
    }),
    { checkLogin, logout }
)(App);
