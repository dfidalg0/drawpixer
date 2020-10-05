import React from 'react';
import { SketchPicker as Picker } from 'react-color';
import { useState } from 'react';

const WIDTH = 200;
const HEIGHT = 9/16 * WIDTH + 192;

export default function ColorPicker({ pos, callback }) {
    const [color, setColor] = useState('#000000');
    const [preset, setPreset] = useState([
        '#D0021B', '#F5A623', '#F8E71C', '#8B572A', '#7ED321',
        '#417505', '#BD10E0', '#9013FE', '#4A90E2', '#50E3C2',
        '#B8E986', '#000000', '#4A4A4A', '#9B9B9B', '#FFFFFF'
    ]);

    function colorChangeComplete(color) {
        callback(color.hex);
        setPreset([color.hex, ...preset.slice(0, -1)]);
    }

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
                onChangeComplete={colorChangeComplete}
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
