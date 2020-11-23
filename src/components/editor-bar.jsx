import React from 'react';

import { IconButton } from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';

import {
    Undo, Redo, Palette
} from '@material-ui/icons';

import EditorContext from './context/editor';

import { useContext, useMemo, useCallback } from 'react';

const useStyles = makeStyles({
    button: {
        display: 'inline-block'
    }
});

// Botão para desfazer os últimos movimentos
// feitos pelo usuário na matriz de pixels
// clicks: estrutura que contém id e cores dos
// últimos quadrados pressionados.

export default function EditorBar({ onPalette }) {
    const classes = useStyles();

    const { clicks, setClicks, undos, setUndos } = useContext(EditorContext);

    const undoLastClick = useCallback(() => {
        setClicks(prevClicks => {
            const { id, color } = prevClicks.pop();

            const button = document.getElementById(`square-${id}`);

            const lastColor = button.style.backgroundColor;

            setUndos(prevUndos => [...prevUndos, { id, color: lastColor }]);

            button.style.backgroundColor = color;
            return [ ...prevClicks ];
        });
    }, [setClicks, setUndos]);

    const redoLastClick = useCallback(() => {
        setUndos(prevUndos => {
            const { id, color } = prevUndos.pop();

            const button = document.getElementById(`square-${id}`);

            const lastColor = button.style.backgroundColor;

            setClicks(prevClicks => [...prevClicks, { id, color: lastColor }]);

            button.style.backgroundColor = color;
            return [ ...prevUndos ];
        });
    }, [setClicks, setUndos]);

    const undoDisabled = useMemo(() => !clicks.length, [clicks]);
    const redoDisabled = useMemo(() => !undos.length, [undos]);

    return (
        <div>
            <IconButton
                className={classes.button}
                disabled={undoDisabled}
                variant="contained" color="primary"
                onClick={undoLastClick}
            >
                <Undo style={{
                    color: undoDisabled ? '#6a6d6d' : 'white'
                }} />
            </IconButton>
            <IconButton
                className={classes.button}
                variant="contained" color="primary"
                onClick={onPalette}
            >
                <Palette style={{ color: 'white' }} />
            </IconButton>
            <IconButton
                className={classes.button}
                disabled={redoDisabled}
                variant="contained" color="primary"
                onClick={redoLastClick}
            >
                <Redo style={{
                    color: redoDisabled ? '#6a6d6d' : 'white'
                }} />
            </IconButton>
        </div>
    );
}
