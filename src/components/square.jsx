import React from 'react';
import classes from '../styles/grid.module.css';

import { useRef, useContext, useCallback } from 'react';

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

    let width, height;

    height = width = size ? size : 34;

    return (
        <button id={`square-${squareId}`} className={classes.square}
            ref={self}
            style={{
                backgroundColor: "#ffffff", height, width
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

function rgb2hex(rgb) {
    if (rgb.search("rgb") === -1) {
        return rgb;
    } else {
        rgb = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+))?\)$/);
        function hex(x) {
            return ("0" + parseInt(x).toString(16)).slice(-2);
        }
        return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
    }
}
