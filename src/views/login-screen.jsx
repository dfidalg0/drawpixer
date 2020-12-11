// React
import React from 'react';

// Material UI
import {
    Grid, Card,
    CardActions,
    CardContent,
    Typography
} from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';

// Componentes
import GoogleLogin from 'react-google-login';
import LoginForm from '../components/login-form';

// Redux
import { googleLogin } from '../store/actions/auth';
import { useDispatch } from 'react-redux';

// Hooks
import { useTheme, useMediaQuery } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    root: {
        width: '100vw',
        height: '100vh'
    },
    card: {
        width: '100%',
        maxHeight: '90vh',
        backgroundColor: '#5bced5',
        overflow: 'auto'
    },
    media:{
        width: '100%',
        '@media screen and (max-height: 470px)': {
            display: 'none'
        }
    },
    buttonContainer: {
        paddingBottom: '20pt'
    },
    title: {
        color: '#16191f'
    },
    subtitle: {
        color: '#282c34'
    },
    OR: {
        marginTop: '10pt',
        marginBottom: '10pt'
    }
}));

export default function LoginScreen (){
    const theme = useTheme();
    const classes = useStyles();

    // Verifica se o usuário está vendo o site com uma tela
    // de largura menor que "small"
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const dispatch = useDispatch();

    return <Grid
        className={classes.root}
        container
        alignItems="center"
        justify="center"
    >
        <Grid item xs={9} md={4}>
            <Card className={classes.card}>
                <CardContent>
                    <Grid container
                        justify="center"
                        alignContent="center"
                    >
                        <Grid item xs={4}>
                            <img src={require('../assets/drawpixer-logo.jpg')}
                                alt="drawpixer-logo"
                                className={classes.media}
                            />
                        </Grid>
                        <Grid item xs={9}>
                            <Typography
                                variant={isMobile ? 'body2' : 'h5'}
                                align="center" gutterBottom={true}
                                className={classes.title}
                            >
                                Venha criar Pixel-arts <strong>
                                    Magníficas
                                </strong> com <strong>
                                    DrawPixer
                                </strong>
                            </Typography>

                            <Typography
                                variant="body1" align="center" gutterBottom={true}
                                className={classes.subtitle}
                            >
                                Para continuar, escolha uma das opções de acesso abaixo
                            </Typography>
                        </Grid>
                    </Grid>
                </CardContent>
                <CardActions>
                    <Grid container
                        className={classes.buttonContainer}
                        justify="center" alignContent="center"
                    >
                        <LoginForm />
                        <Grid container justify="center" className={classes.OR}>
                            Ou
                        </Grid>
                        <GoogleLogin
                            clientId="700716339246-aau8p35vfa84d5lgrf20g6nm196db0aa.apps.googleusercontent.com"
                            buttonText="Continuar com Google"
                            onSuccess={(...args) => dispatch(googleLogin(...args))}
                            onFailure={console.error}
                        />
                    </Grid>
                </CardActions>
            </Card>
        </Grid>
    </Grid>
}
