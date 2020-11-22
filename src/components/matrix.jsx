import React from 'react';
import Square from './square';
import classes from '../styles/grid.module.css';

import EditorContext from './context/editor';

import { useContext } from 'react';

const maxSize = Math.min(window.innerHeight, window.innerWidth);

export default function Matrix({ color }) {
    const { size, clicks, setClicks } = useContext(EditorContext);

    let matrix = [];
    let row = [];
    let squareSize;

    if (34 * size[0] > 0.85 * maxSize && size[0] >= size[1])
        squareSize = 0.85 * maxSize / size[0];
    if (34 * size[1] > 0.85 * maxSize && size[1] >= size[0])
        squareSize = 0.85 * maxSize / size[1];

    for (let x = 0; x < size[1]; x++) {
        row = [];
        for (let y = 0; y < size[0]; y++) {
            const id = x + y + 1;

            row.push(
                <Square
                    key={id} value={x + y + 1}
                    squareId={x*size[0] + y + 1}
                    color={color} size={squareSize}
                    clicks={clicks}
                    setClicks={setClicks}
                />
            );
        }

        matrix.push(<div key={x} className={classes.boardRow}>{row}</div>);
    }

    return matrix;
}
