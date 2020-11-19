import React, { useState } from 'react';
import { Button, makeStyles } from '@material-ui/core';
import { connect } from 'react-redux';
import { logout } from '../store/actions/auth';
import { useGoogleLogout } from 'react-google-login';

const useStyles = makeStyles({
    button: {
        display: 'flex',
        width: '100%',
        backgroundColor: '#073D5F',
        marginTop: 15
    }
});

function LogoutButton({ logout }) {
    const classes = useStyles();
    const [pending, setPending] = useState(false);
    const { signOut } = useGoogleLogout({
        onLogoutSuccess: logout,
        clientId: "700716339246-aau8p35vfa84d5lgrf20g6nm196db0aa.apps.googleusercontent.com"
    });

    // Impedindo que a função seja chamada mais de uma vez dentro de 3 segundos
    const requestLogout = () => {
        signOut();
        setPending(true);
    };

    return <Button className={classes.button}
        variant="contained" color="primary"
        onClick={requestLogout} size="large"
        disabled={pending}
    >
        Logout
    </Button>
}

export default connect(
    null,
    { logout }
)(LogoutButton);
