import React from 'react';
import { SketchPicker as Picker } from 'react-color';
import { useState } from 'react';

const WIDTH = 200;
const HEIGHT = 9/16 * WIDTH + 170;

export default function ColorPicker({ pos, callback, preset }) {
    const [color, setColor] = useState('#000000');

    if (pos){
        const maxX = window.innerWidth;
        const maxY = window.innerHeight;
        if (pos.x + WIDTH > maxX){
            pos.x -= WIDTH - (maxX - pos.x) + 25;
        }
        if (pos.y + HEIGHT > maxY) {
            pos.y -= HEIGHT - (maxY - pos.y) + 5;
        }
    }

    return pos?
        <div
            style={{
                position: 'absolute',
                left: pos.x,
                top: pos.y,
                zIndex: 2
            }}
            onClick={(event) => event.stopPropagation()}
        >
            <Picker
                width={WIDTH}
                color={color}
                disableAlpha={true}
                onChange={color => setColor(color.hex)}
                onChangeComplete={color => callback(color.hex)}
                presetColors={preset}
                styles={{
                    default: {
                        saturation: {
                            cursor: 'crosshair'
                        },
                        toggles: {
                            cursor: 'pointer'
                        },
                        picker: {
                            backgroundColor: '#ffffff',
                        },
                        controls: {
                            cursor: 'col-resize'
                        }
                    }
                }}
            />
        </div> : null;
}
