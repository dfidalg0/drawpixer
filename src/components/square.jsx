import React from 'react';
import classes from '../styles/grid.module.css';
import { useState } from 'react';

window.mouseDown = false;
document.onmousedown = function (event) {
    window.button = event.button;
    window.mouseDown = true;
}
document.onmouseup = function () {
    window.mouseDown = false;
}

export default function Square ({ color, size }) {
    const [value, setValue] = useState('#ffffff');

    let width, height;

    height = width = size ? size : 34;

    return (
        <button id = "square" className={classes.square} style={{
            backgroundColor: value, height, width
        }}
            onMouseOver={(e) => {
                if (window.mouseDown)
                    if (window.button === 0)
                        setValue(color);
                    else if (window.button === 2)
                        setValue('#ffffff');
            }}
            onMouseDown={(e) => {
                if (e.button === 0)
                    setValue(color);
                else if (e.button === 2)
                    setValue('#ffffff');
            }}
            onContextMenu={event => {
                event.preventDefault();
                event.stopPropagation();
            }}
        >
        </button>
    );
}
