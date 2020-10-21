import React from 'react';
import classes from '../styles/grid.module.css';

window.mouseDown = false;
document.onmousedown = function (event) {
    window.button = event.button;
    window.mouseDown = true;
}
document.onmouseup = function () {
    window.mouseDown = false;
}

export default function Square({ color, size, clicks, squareId }) {
    let width, height;

    height = width = size ? size : 34;

    return (
        <button id={squareId} className={classes.square} style={{
            backgroundColor: "#ffffff", height, width
        }}
            onMouseOver={(e) => {
                if (window.mouseDown) {
                    if (window.button === 2)
                        changeColor('#ffffff', e, clicks, squareId);
                    else
                        changeColor(color, e, clicks, squareId);
                }
            }}
            onMouseDown={(e) => {
                if (e.button === 0) {
                    changeColor(color, e, clicks, squareId);
                } else if (e.button === 2) {
                    changeColor('#ffffff', e, clicks, squareId);
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

function changeColor(color, e, clicks, squareId) {
    let lastColor = rgb2hex(e.target.style.backgroundColor);
    if (color !== lastColor) {
        clicks.button.push(squareId);
        clicks.color.push(lastColor);
        e.target.style.backgroundColor = color;
    }
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
