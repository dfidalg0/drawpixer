import React from 'react';
import classes from '../styles/grid.module.css';

import { useRef, useContext, useCallback } from 'react';

import { rgb2hex } from '../utils/tools';

import EditorContext from './context/editor';

export default function Square({ size, squareId }) {
    const { setClicks, setUndos, penColor } = useContext(EditorContext);

    const self = useRef();

    const changeColor = useCallback(color =>  {
        const button = self.current;

        const lastColor = rgb2hex(button.style.backgroundColor);
        if (color !== lastColor) {
            setClicks(clicks =>
                [...clicks, { id: squareId, color: lastColor }]
            );
            setUndos([]);
            button.style.backgroundColor = color;
        }
    }, [setClicks, setUndos, squareId]);

    let height, width, minHeight, minWidth;

    minHeight = minWidth = height = width = size ? size : 34;

    return (
        <button id={`square-${squareId}`} className={classes.square}
            ref={self}
            style={{
                backgroundColor: "#ffffff",
                height, width, minHeight, minWidth
            }}
            draggable={false}
            onMouseOver={() => {
                if (window.mouseDown) {
                    if (window.button === 2)
                        changeColor('#ffffff');
                    else
                        changeColor(penColor);
                }
            }}
            onMouseDown={e => {
                if (e.button === 0) {
                    changeColor(penColor);
                } else if (e.button === 2) {
                    changeColor('#ffffff');
                }
            }}
            onContextMenu={event => {
                event.preventDefault();
                event.stopPropagation();
            }}
        >
        </button >
    );
}
