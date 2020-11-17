import React from 'react';
import { Button, makeStyles } from '@material-ui/core';


const useStyles = makeStyles(theme => ({
    button: {
        display: 'flex',
        width: '100%',
        backgroundColor: '#073D3D',
        marginTop: 15
    }
}));

export default function SaveImage({ size, setSize }) {

    const classes = useStyles();

    function downloadImage() {
        var dimSquare = document.getElementById('1').getBoundingClientRect().width;
        var canvas = document.createElement('canvas');

        var constMult = 1.5;
        canvas.width = size[0] * dimSquare * constMult;
        canvas.height = size[1] * dimSquare * constMult;
        var ctx = canvas.getContext('2d');
        ctx.strokeStyle = '#999';
        ctx.lineWidth = 0.3;
        ctx.fillStyle = '#999';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (var x = 0; x < size[0]; x++) {
            for (var y = 0; y < size[1]; y++) {
                var id = size[0] * y + x + 1;
                var element = document.getElementById(id);
                ctx.fillStyle = element.style.backgroundColor;
                ctx.fillRect((x * dimSquare + 0.25) * constMult, (y * dimSquare + 0.25) * constMult, (dimSquare - 0.5) * constMult, (dimSquare - 0.5) * constMult);
                ctx.strokeRect((x * dimSquare + 0.25) * constMult, (y * dimSquare + 0.25) * constMult, (dimSquare - 0.5) * constMult, (dimSquare - 0.5) * constMult);
            }
        }
        var imgURL = canvas.toDataURL('image/png', 1.0);
        var link = document.createElement('a');
        link.download = 'pixelArt.png';
        link.href = imgURL;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function saveLocalStorage() {
        // save grid to local storage
        var colorsGrid = [];
        for (var id = 1; id <= size[0] * size[1]; id++) {
            colorsGrid.push(document.getElementById(id).style.backgroundColor);
        }
        var grid = {
            x: size[0],
            y: size[1],
            colors: colorsGrid
        }

        window.localStorage.setItem("currimage", JSON.stringify(grid));
    }

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
        <form className={classes.saveImg}>
            <Button
                variant="contained" color="primary"
                onClick={saveLocalStorage} size="large"
                className={classes.button}
            >
                Salvar Imagem
            </Button>
            <Button
                variant="contained" color="primary"
                onClick={downloadImage} size="large"
                className={classes.button}
            >
                Baixar Imagem
            </Button>
            <Button
                variant="contained" color="primary"
                onClick={loadImage} size="large"
                className={classes.button}
            >
                Carregar Imagem Salva
            </Button>
        </form>
    );
}
