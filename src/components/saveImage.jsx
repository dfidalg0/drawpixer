import React from 'react';
import html2canvas from 'html2canvas';
import { Button, makeStyles } from '@material-ui/core';


const useStyles = makeStyles(theme => ({
    button: {
        display: 'flex',
        width: '100%',
        backgroundColor: '#073D3D',
        marginTop: 15
    }
}));

export default function SaveImage({ size }) {

    const classes = useStyles();

    function htmlToPng() {
        html2canvas(document.querySelector("#editorGridMatrix")).then(canvas => {
            var dimentions = document.getElementById("editorGridMatrix").getBoundingClientRect();
            var dimSquare = document.getElementById("square").getBoundingClientRect().width;

            var newImageX = Math.floor((dimentions.width - size[0]*dimSquare)/2);
            var ctx = canvas.getContext('2d');
            var imageData = ctx.getImageData(newImageX, 0, Math.ceil(size[0]*dimSquare), Math.ceil(size[1]*dimSquare));

            var newCan = document.createElement('canvas');
            newCan.width = Math.ceil(size[0]*dimSquare);
            newCan.height = Math.ceil(size[1]*dimSquare);
            var newCtx = newCan.getContext('2d');
            newCtx.putImageData(imageData, 0, 0);

            var imgURL = newCan.toDataURL("image/png");

            var link = document.createElement('a');
            link.download = 'pixelArt.png';
            link.href = imgURL;

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }

    return (
        <form className={classes.saveImg}>
            <Button
                variant="contained" color="primary"
                onClick={htmlToPng} size="large"
                className={classes.button}
            >
                Salvar Imagem
            </Button>
        </form>
    );
}
