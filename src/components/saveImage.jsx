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

            var newImageX = (parseFloat(dimentions.width) - parseFloat(size[0])*(parseFloat(dimSquare) - 1.0))/2.0;
            var newWidth = parseFloat(size[0])*(parseFloat(dimSquare) - 1.0);
            var newHeight = parseFloat(size[1])*(parseFloat(dimSquare) - 1.0);
            var ctx = canvas.getContext('2d');
            //Linha seguinte não salva o progresso do desenho
            localStorage.setItem("currimage", document.getElementById("editorGridMatrix"));
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
        });
    }

    function LoadImage(){
        document.getElementById("editorGridMatrix").innerHTML = localStorage.getItem("currimage");
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
