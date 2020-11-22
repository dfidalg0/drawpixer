import React from 'react';
import { connect } from 'react-redux'

import {
    Button, TextField, Dialog, DialogActions,
    DialogContent, DialogTitle
} from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';

import { saveDrawing } from '../store/actions/drawings';
import DownloadImage from '../components/downloadImage';

import EditorContext from './context/editor';

// Hooks
import { useState, useEffect, useCallback, useContext } from 'react';

const useStyles = makeStyles(theme => ({
    button: {
        display: 'flex',
        width: '100%',
        backgroundColor: '#073D3D',
        marginTop: 15
    }
}));

function SaveImage({ saveDrawing }) {
    const classes = useStyles();

    const { size, setSize } = useContext(EditorContext);

    const [title, setTitle] = useState('');
    const [open, setOpen] = useState(false);

    const handleClickOpen = useCallback(() => {
        setOpen(true);
    }, []);

    const handleClose = useCallback(() => {
        setOpen(false);
    }, []);

    const getGrid = useCallback(() => {
        const [x, y] = size;
        const colors = [];

        const squares = document.querySelectorAll('button[id^="square-"]');

        for (const square of squares) {
            const color = rgb2hex(square.style.backgroundColor);
            colors.push(color);
        }
        return { x, y, colors };
    }, [size]);

    const handleSubmit = useCallback(() => {
        if (title.length > 0) {
            var grid = getGrid();
            saveDrawing(title, grid);
        } else {
            alert("Título Inválido");
        }
    }, [title, getGrid, saveDrawing]);

    const onChange = e => setTitle(e.target.value);

    function rgb2hex(rgb) {
        if (rgb.search("rgb") === -1) {
            return rgb;
        } else {
            rgb = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+))?\)$/);
            function hex(x) {
                return ("0" + parseInt(x).toString(16)).slice(-2);
            }
            return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
        }
    }

    // function saveLocalStorage() {
    //     // save grid to local storage
    //     var grid = getJsonDrawing();
    //     window.localStorage.setItem("currimage", grid);
    // }

    const [img, setImg] = useState(null);

    useEffect(() => {
        if (img){
            setSize([img.x, img.y]);

            for (var id = 1; id <= img.x * img.y; id++) {
                const square = document.getElementById(`square-${id}`);
                square.style.backgroundColor = img.colors[id - 1];
            }

            setImg(null);
        }
    }, [img, setSize]);

    const loadImage = useCallback(() => {
        const item = window.localStorage.getItem("currimage");
        if (!item) alert("Não há imagem salva!");
        else {
            setImg(JSON.parse(item));
        }
    }, []);

    return (
        <>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Salvar</DialogTitle>
                <DialogContent>
                    <TextField
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
                    <Button onClick={handleSubmit} color="primary">
                        Salvar
                    </Button>
                </DialogActions>
            </Dialog>

            <Button
                variant="contained" color="primary"
                onClick={handleClickOpen} size="large"
                className={classes.button}
            >
                Salvar Imagem
            </Button>
                <DownloadImage size={size} />
                <Button
                    variant="contained" color="primary"
                    onClick={loadImage} size="large"
                    className={classes.button}
                >
                    Carregar Imagem Salva
            </Button>
        </>
    );
}


export default connect(null, { saveDrawing })(SaveImage);
