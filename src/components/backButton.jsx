import React from 'react';
import { Button, makeStyles } from '@material-ui/core';


const useStyles = makeStyles(theme => ({
    button: {
        display: 'flex',
        width: '100%',
        backgroundColor: '#073D5F',
        marginTop: 15
    }
}));

export default function BackButton({ clicks }) {

    const classes = useStyles();

    function backLastClick() {
        if (clicks.button.length > 0) {
            var button = clicks.button.pop();
            var color = clicks.color.pop();
            document.getElementById(button).style.backgroundColor = color;
        }
    }

    return (
        <form className={classes.backButton}>
            <Button
                variant="contained" color="primary"
                onClick={backLastClick} size="large"
                className={classes.button}
            >
                Desfazer
            </Button>
        </form>
    );
}