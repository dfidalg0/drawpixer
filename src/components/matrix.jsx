import React from 'react';

import Square from './square';

import classes from '../styles/grid.module.css';

import { useMaxSizes } from '../utils/dom-helpers';

import { useEffect, useMemo } from 'react';

export default function Matrix({ size, onSizeChange }) {
    const maxSizes = useMaxSizes();

    useEffect(() => {
        if(onSizeChange) onSizeChange();
    }, [size, onSizeChange]);

    const dim = useMemo(() => {
        const x = 34 * size[0] - (size[0] - 1);
        const y = 34 * size[1] - (size[1] - 1);

        return [x,y];
    }, [size]);

    const squareSize = useMemo(() => {
        const possibleSizes = [34];

        if (dim[0] > maxSizes[0])
            possibleSizes.push(1 + maxSizes[0] / size[0]);

        if (dim[1] > maxSizes[1])
            possibleSizes.push(1 + maxSizes[1] / size[1]);

        return Math.min(...possibleSizes);
    }, [size, dim, maxSizes]);

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
