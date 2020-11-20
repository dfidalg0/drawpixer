import React from 'react';
import { useState } from 'react';
import { connect } from 'react-redux'

import { Button, makeStyles, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';

import { saveDrawing } from '../store/actions/drawings';
import DownloadImage from '../components/downloadImage';


const useStyles = makeStyles(theme => ({
    button: {
        display: 'flex',
        width: '100%',
        backgroundColor: '#073D3D',
        marginTop: 15
    }
}));

function SaveImage({ size, setSize, saveDrawing }) {

    const classes = useStyles();

    const [title, setTitle] = useState('');
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmit = () => {
        if (title.length > 0) {
            var grid = getJsonDrawing();
            saveDrawing(title, grid);
        } else {
            alert("Título Inválido");
        }
    };

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

    function getJsonDrawing() {
        var colorsGrid = [];
        for (var id = 1; id <= size[0] * size[1]; id++) {
            colorsGrid.push(rgb2hex(document.getElementById(id).style.backgroundColor));
        }
        var grid = {
            x: size[0],
            y: size[1],
            colors: colorsGrid
        }
        return JSON.stringify(grid);
    }

    // function saveLocalStorage() {
    //     // save grid to local storage
    //     var grid = getJsonDrawing();
    //     window.localStorage.setItem("currimage", grid);
    // }

    function loadImage() {
        var item = window.localStorage.getItem("currimage");
        if (!item) alert("Não há imagem salva!");
        else {
            var img = JSON.parse(item);
            setSize([img.x, img.y]);
            setTimeout(() => {
                for (var id = 1; id <= img.x * img.y; id++) {
                    document.getElementById(id).style.backgroundColor = img.colors[id - 1];
                }
            }, 500);
        }
    }

    return (
        <div>
            <div>
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
            </div>
            <form className={classes.saveImg}>

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
            </form>
        </div>
    );
}


export default connect(null, { saveDrawing })(SaveImage);