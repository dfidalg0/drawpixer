import React from 'react';
import { Button, makeStyles } from '@material-ui/core';

import EditorContext from './context/editor';

import { useContext, useCallback } from 'react';

const useStyles = makeStyles(theme => ({
    button: {
        display: 'flex',
        width: '100%',
        backgroundColor: '#073D3D',
        marginTop: 15
    }
}));

export default function DownLoadImage() {
    const classes = useStyles();

    const { size } = useContext(EditorContext);

    const downloadImage = useCallback(() => {
        const squares = document.querySelectorAll('button[id^="square-"]');

        const dimSquare = squares[0].getBoundingClientRect().width;
        const canvas = document.createElement('canvas');

        const constMult = 1.5;
        canvas.width = size[0] * dimSquare * constMult;
        canvas.height = size[1] * dimSquare * constMult;
        const ctx = canvas.getContext('2d');
        ctx.strokeStyle = '#999';
        ctx.lineWidth = 0.3;
        ctx.fillStyle = '#999';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (let x = 0; x < size[0]; x++) {
            for (let y = 0; y < size[1]; y++) {
                const index = size[0] * y + x;
                const square = squares[index];

                const args = [
                    (x * dimSquare + 0.25) * constMult,
                    (y * dimSquare + 0.25) * constMult,
                    (dimSquare - 0.5) * constMult,
                    (dimSquare - 0.5) * constMult
                ]

                ctx.fillStyle = square.style.backgroundColor;
                ctx.fillRect(...args);
                ctx.strokeRect(...args);
            }
        }
        const imgURL = canvas.toDataURL('image/png', 1.0);
        const link = document.createElement('a');
        link.download = 'pixelArt.png';
        link.href = imgURL;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }, [size]);

    return (
        <Button
            variant="contained" color="primary"
            onClick={downloadImage} size="large"
            className={classes.button}
        >
            Exportar Como PNG
        </Button>
    );
}
