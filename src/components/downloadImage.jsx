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

export default function DownLoadImage({ size }) {

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

    return (
        <Button
            variant="contained" color="primary"
            onClick={downloadImage} size="large"
            className={classes.button}
        >
            Baixar Imagem
        </Button>
    );
}