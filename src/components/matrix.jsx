import React from 'react';

import Square from './square';

import classes from '../styles/grid.module.css';

import { useEffect, useMemo } from 'react';

const maxSize = Math.min(
    window.innerHeight - 40 - 45 - 48, // height - padding - appbar - editorbar
    window.innerWidth - 40 // width - padding
);

export default function Matrix({ size, onSizeChange }) {
    useEffect(() => {
        if(onSizeChange) onSizeChange();
    }, [size, onSizeChange]);

    const dim = useMemo(() => {
        const x = 34 * size[0] - (size[0] - 1);
        const y = 34 * size[1] - (size[1] - 1);

        return [x,y];
    }, [size]);

    const squareSize = useMemo(() => {
        let squareSize;

        if (dim[0] > maxSize && dim[0] >= dim[1])
            squareSize = 1 + maxSize / size[0];
        if (dim[1] > maxSize && dim[1] >= dim[0])
            squareSize = 1 + maxSize / size[1];

        return squareSize;
    }, [size, dim]);

    const matrix = useMemo(() => {
        let matrix = [];
        let row = [];

        for (let x = 0; x < size[1]; x++) {
            row = [];
            for (let y = 0; y < size[0]; y++) {
                const id = x + y + 1;

                row.push(
                    <Square
                        key={id} value={x + y + 1}
                        squareId={x*size[0] + y + 1}
                        size={squareSize}
                    />
                );
            }

            matrix.push(<div key={x} className={classes.boardRow}>{row}</div>);
        }

        return matrix;
    }, [size, squareSize]);

    return matrix;
}
