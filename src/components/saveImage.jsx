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

export default function SaveImage({ size, setSize }) {

    const classes = useStyles();

    function htmlToPng() {
        html2canvas(document.querySelector("#editorGridMatrix")).then(canvas => {
            var dimentions = document.getElementById("editorGridMatrix").getBoundingClientRect();
            var dimSquare = document.getElementById('1').getBoundingClientRect().width;

            var newImageX = (parseFloat(dimentions.width) - parseFloat(size[0]) * (parseFloat(dimSquare) - 1.0)) / 2.0;
            var newWidth = parseFloat(size[0]) * (parseFloat(dimSquare) - 1.0);
            var newHeight = parseFloat(size[1]) * (parseFloat(dimSquare) - 1.0);
            var ctx = canvas.getContext('2d');
            var imageData = ctx.getImageData(newImageX, 0, newWidth, newHeight);

            var newCan = document.createElement('canvas');
            newCan.width = newWidth;
            newCan.height = newHeight;
            var newCtx = newCan.getContext('2d');
            newCtx.putImageData(imageData, 0, 0);

            var imgURL = newCan.toDataURL("image/png");

            var link = document.createElement('a');
            link.download = 'pixelArt.png';
            link.href = imgURL;

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

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
        });
    }

    function LoadImage() {
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
                onClick={htmlToPng} size="large"
                className={classes.button}
            >
                Salvar Imagem
            </Button>
            <Button
                variant="contained" color="primary"
                onClick={LoadImage} size="large"
                className={classes.button}
            >
                Carregar Imagem Salva
            </Button>
        </form>
    );
}
