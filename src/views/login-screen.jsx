import React from 'react';
import GoogleLogin from 'react-google-login';
import {
    Grid, Card,
    CardActions,
    CardContent,
    Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

// Redux
import { login } from '../store/actions/auth';
import { connect } from 'react-redux';

const useStyles = makeStyles(theme => ({
    card: {
        width: '100%',
        backgroundColor: '#a3bfb7'
    },
    buttonContainer: {
        height: '90pt'
    },
    title: {
        color: '#16191f'
    },
    subtitle: {
        color: '#282c34'
    }
}));

function GoogleButton ({ login }){
    const classes = useStyles();

    return <Grid
        style={{ width: '100vw', height: '100vh' }}
        container
        alignContent="center"
        justify="center"
    >
        <Grid item xs={9} md={4}>
            <Card className={classes.card}>
                <CardContent>
                    <Grid container
                        style={{
                            height: '150pt'
                        }}
                        justify="center"
                        alignContent="center"
                    >
                        <Grid item xs={9}>
                        <Typography
                            variant="h5" align="center" gutterBottom={true}
                            className={classes.title}
                        >
                            Venha criar Pixel-arts <strong>
                                Magníficas
                            </strong> com DrawPixer
                        </Typography>

                        <Typography
                            variant="body1" align="center" gutterBottom={true}
                            className={classes.subtitle}
                        >
                            Para continuar, escolha uma das opções de Login abaixo
                        </Typography>
                        </Grid>
                    </Grid>
                </CardContent>
                <CardActions>
                    <Grid container
                        className={classes.buttonContainer}
                        justify="center" alignContent="center"
                    >
                        <GoogleLogin
                            clientId="700716339246-aau8p35vfa84d5lgrf20g6nm196db0aa.apps.googleusercontent.com"
                            buttonText="Continuar com Google"
                            onSuccess={login}
                            onFailure={console.error}
                        />
                    </Grid>
                </CardActions>
            </Card>
        </Grid>
    </Grid>
}

export default connect(null, { login })(GoogleButton);
