import React from 'react';
import { Button, makeStyles } from '@material-ui/core';
import { connect } from 'react-redux';
import { logout } from '../store/actions/auth';

const useStyles = makeStyles(theme => ({
    button: {
        display: 'flex',
        width: '100%',
        backgroundColor: '#073D5F',
        marginTop: 15
    }
}));

function LogoutButton({ logout }) {
    const classes = useStyles();

    return <Button className={classes.button}
        variant="contained" color="primary"
        onClick={logout} size="large"
    >
        Logout
    </Button>
}

export default connect(
    null,
    { logout }
)(LogoutButton);
