// Material UI
import {
    TextField, Grid, Typography, Link, Button
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core';

// Auxiliares
import { isEmail } from 'validator';

// Redux
import { login, register } from '../store/actions/auth';
import { connect } from 'react-redux';

// Hooks
import React, { useState, useEffect, useMemo, useCallback } from 'react';

const useStyles = makeStyles(theme => ({
    field: {
        marginBottom: '9px',
        [theme.breakpoints.down('sm')]: {
            height: '35pt'
        },
        textAlign: 'center'
    },
    input: {
        [theme.breakpoints.down('sm')]: {
            height: '35pt',
            fontSize: '10pt',
        }
    },
    inputLabel: {
        [theme.breakpoints.down('sm')]: {
            fontSize: '10pt',
        }
    },
    link: {
        cursor: 'pointer',
        textDecoration: 'none',
        color: theme.palette.primary.main,
        '&:hover': {
            textDecoration: 'none',
            color: theme.palette.secondary.main
        }
    },
    button: {
        display: 'flex',
        width: '100%',
        marginTop: '10px',
        marginBottom: '10px',
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        '&:hover': {
            backgroundColor: theme.palette.secondary.main,
            color: theme.palette.secondary.contrastText,
        }
    }
}));


function LoginForm({ login, register }){
    const classes = useStyles();

    // Modo ("login" ou "register")
    const [mode, setMode] = useState('login');

    // Campos do Formulário
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passConfirm, setPassConfirm] = useState('');

    // Verificação de erros de preenchimento
    const hasErrors = useMemo(() => (mode === 'register' && (
        password !== passConfirm ||
        name.length < 5 ||
        password.length < 8 ||
        !isEmail(email)
    )) || (mode === 'login' && (
        !isEmail(email)
    )), [mode, name, email, password, passConfirm]);

    // Envio do formulário
    const handleButtonClick = useCallback(() => {
        if (mode === 'login'){
            login(email, password);
        }
        else {
            register(name, email, password, passConfirm);
        }
    }, [mode, name, email, password, passConfirm, login, register]);

    // Possibilidade de envio através do Enter
    useEffect(() => {
        const handler = e => {
            if (e.key === 'Enter'){
                handleButtonClick();
            }
        };

        window.addEventListener('keydown', handler);

        return () => window.removeEventListener('keydown', handler);
    }, [handleButtonClick]);

    return <Grid container justify="center">
        <Grid container justify="center">
            <Typography variant="body1">
                <strong>
                {mode === 'login' ?
                    'Continuar com Login' :
                    'Continuar com Cadastro'}
                </strong>
            </Typography>
        </Grid>

        {mode === 'register' ? <Grid container justify="center">
            <Grid item xs={11} sm={7}>
                <TextField
                    fullWidth
                    InputProps={{
                        className: classes.input
                    }}
                    InputLabelProps={{
                        className: classes.inputLabel
                    }}
                    className={classes.field}
                    value={name}
                    onChange={e => setName(e.target.value)}
                    label="Nome"
                    variant="outlined"
                />
            </Grid>
        </Grid> : null}
        <Grid container justify="center">
            <Grid item xs={11} sm={7}>
                <TextField
                    fullWidth
                    InputProps={{
                        className: classes.input
                    }}
                    InputLabelProps={{
                        className: classes.inputLabel
                    }}
                    className={classes.field}
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    label="Email"
                    variant="outlined"
                />
            </Grid>
        </Grid>
        <Grid container justify="center">
            <Grid item xs={11} sm={7}>
                <TextField
                    fullWidth
                    InputProps={{
                        className: classes.input
                    }}
                    InputLabelProps={{
                        className: classes.inputLabel
                    }}
                    className={classes.field}
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    label="Senha"
                    variant="outlined"
                />
            </Grid>
        </Grid>

        {mode === 'register' ? <Grid container justify="center">
            <Grid item xs={11} sm={7}>
                <TextField
                    fullWidth
                    InputProps={{
                        className: classes.input
                    }}
                    InputLabelProps={{
                        className: classes.inputLabel
                    }}
                    className={classes.field}
                    type="password"
                    value={passConfirm}
                    onChange={e => setPassConfirm(e.target.value)}
                    label="Confirmar senha"
                    variant="outlined"
                />
            </Grid>
        </Grid> : null}

        <Grid container justify="center">
            <Grid item xs={9} sm={6}>
                <Button variant="contained" className={classes.button}
                    onClick={handleButtonClick}
                    disabled={hasErrors}
                >
                    { mode === 'login' ? 'Login' : 'Cadastrar' }
                </Button>
            </Grid>
        </Grid>

        <Grid container justify="center">
            <Link
                className={classes.link}
                onClick={() => { setMode(mode => mode === 'login' ? 'register' : 'login') }}
            >
                {mode === 'login' ?
                    'Não tem uma conta? Cadastre-se' :
                    'Já possui uma conta? Faça login'
                }
            </Link>
        </Grid>
    </Grid>
}

export default connect(null, { login, register })(LoginForm);
