import React from 'react';
import { connect } from 'react-redux'

import {
    Button, TextField, Dialog, DialogActions,
    DialogContent, DialogTitle, CircularProgress
} from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';

import { saveDrawing } from '../store/actions/drawings';
import DownloadImage from '../components/downloadImage';

import EditorContext from './context/editor';

import { rgb2hex } from '../utils/tools';
import { getAllSquares } from '../utils/dom-helpers';

// Hooks
import { useState, useCallback, useContext } from 'react';

const useStyles = makeStyles({
    button: {
        display: 'flex',
        width: '100%',
        backgroundColor: '#073D3D'
    }
});

function SaveImage({ saveDrawing }) {
    const classes = useStyles();

    const { size } = useContext(EditorContext);

    const [title, setTitle] = useState('');

    const getGrid = useCallback(() => {
        const [x, y] = size;
        const colors = [];

        const squares = getAllSquares();

        for (const square of squares) {
            const color = rgb2hex(square.style.backgroundColor);
            colors.push(color);
        }
        return { x, y, colors };
    }, [size]);

    const [open, setOpen] = useState(false);

    const handleClickOpen = useCallback(() => {
        setOpen(true);
    }, []);

    const handleClose = useCallback(() => {
        setOpen(false);
    }, []);

    const [loading, setLoading] = useState(false);

    const handleSubmit = useCallback(async () => {
        setLoading(true);
        const grid = getGrid();
        await saveDrawing(title, grid);
        setLoading(false);
        setOpen(false);
    }, [title, getGrid, saveDrawing]);

    const onChange = useCallback(e => setTitle(e.target.value), []);

    const saveToLocalStorage = useCallback(() => {
        const grid = getGrid();
        localStorage.setItem('currimage', JSON.stringify(grid));
    }, [getGrid]);

    const { setImg } = useContext(EditorContext);

    const loadFromLocalStorage = useCallback(() => {
        const item = window.localStorage.getItem("currimage");
        if (!item) alert("Não há imagem salva!");
        else {
            setImg(JSON.parse(item));
        }
    }, [setImg]);

    return (
        <>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Salvar</DialogTitle>
                <DialogContent>
                    <TextField
                        autoComplete="off"
                        autoFocus
                        margin="dense"
                        id="titulo"
                        label="Título"
                        fullWidth
                        onChange={onChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={handleSubmit} color="primary"
                        disabled={title.length < 1}
                    >
                        { loading? <CircularProgress size={18}/> : 'Salvar'  }
                    </Button>
                </DialogActions>
            </Dialog>

            <Button
                variant="contained" color="primary"
                onClick={handleClickOpen} size="large"
                className={classes.button}
            >
                Salvar Pixer
            </Button>
            <Button
                variant="contained" color="primary"
                onClick={saveToLocalStorage} size="large"
                className={classes.button}
                style={{
                    marginTop: 15
                }}
            >
                Salvar Rascunho
            </Button>
            <Button
                variant="contained" color="primary"
                onClick={loadFromLocalStorage} size="large"
                className={classes.button}
                style={{
                    marginTop: 15
                }}
            >
                Carregar Rascunho
            </Button>
            <DownloadImage />
        </>
    );
}


export default connect(null, { saveDrawing })(SaveImage);
