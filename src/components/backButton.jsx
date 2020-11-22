import React from 'react';
import { Button, makeStyles } from '@material-ui/core';

import EditorContext from './context/editor';
import { useContext } from 'react';

const useStyles = makeStyles(theme => ({
    button: {
        display: 'flex',
        width: '100%',
        backgroundColor: '#073D5F',
        marginTop: 15
    }
}));

// Botão para desfazer os últimos movimentos
// feitos pelo usuário na matriz de pixels
// clicks: estrutura que contém id e cores dos
// últimos quadrados pressionados.

export default function BackButton() {
    const { clicks } = useContext(EditorContext);

    const classes = useStyles();

    function backLastClick() {
        // se tiver movimento para desfazer
        if (clicks.button.length > 0) {
            const button = clicks.button.pop();
            const color = clicks.color.pop();
            // volta para a cor anterior
            document.getElementById(`square-${button}`).style.backgroundColor = color;
        }
    }

    return (
        <Button
            disabled={!clicks.button.length}
            variant="contained" color="primary"
            onClick={backLastClick} size="large"
            className={classes.button}
        >
            Desfazer
        </Button>
    );
}
