import React from 'react';

import {
    AppBar, Toolbar, Typography
} from '@material-ui/core'

import { makeStyles } from '@material-ui/core/styles';

import ColorPicker from './colorpicker';
import LeftBar from './left-bar';
import Matrix from './matrix';
import EditorBar from './editor-bar';

import EditorContext from './context/editor';

import { useState, useEffect, useCallback } from 'react';

const useStyles = makeStyles({
    appBar: {
        height: 45,
        backgroundColor: '#0b1016',
        width: '100vw'
    },
    toolbar: {
        paddingLeft: 5,
        minHeight: 45,
        width: '100vw'
    },
    outerEditorGrid: {
        width: '100%',
        height: '100%',
        overflow: 'hidden'
    },
    editorGrid: {
        justifyContent: 'center',
        backgroundColor: '#282c34',
        padding: '20px'
    }
});

export default function Editor(){
    const classes = useStyles();

    const [penColor, setPenColor] = useState('#000000'); // Inicial - Preto
    const [pickerPos, setPickerPos] = useState(null); // Inicial - Não aparecer
    const [preset, setPreset] = useState([
        '#d0021b', '#f5a623', '#f8e71c', '#8b572a', '#7ed321',
        '#417505', '#bd10e0', '#9013fe', '#4a90e2', '#50e3c2',
        '#b8e986', '#000000', '#4a4a4a', '#9b9b9b', '#f0f0f0',
        '#ffffff'
    ]);

    const showPicker = useCallback((event) => {
        event.preventDefault();
        setPickerPos({
            x: event.clientX,
            y: event.clientY
        });
    }, []);

    const hidePicker = useCallback(() => {
        if (pickerPos){
            if (!preset.includes(penColor))
                setPreset([penColor, ...preset.slice(0, -1)]);
            else {
                setPreset([penColor, ...preset.filter(c => c !== penColor)]);
            }
            setPickerPos(null);
        }
    }, [penColor, preset, pickerPos]);

    const [size, setSize] = useState([10, 10]);

    const [clicks, setClicks] = useState([]);
    const [undos, setUndos] = useState([]);

    const [img, setImg] = useState(null);
    const [paint, setPaint] = useState(false);

    const onSizeChange = useCallback(() => {
        if (img) setPaint(true);
    }, [img]);

    useEffect(() => {
        if (img){
            setSize([img.x, img.y]);
            setClicks([]);
            setUndos([]);
        }
    }, [img]);

    useEffect(() => {
        if (paint){
            const squares = document.querySelectorAll('button[id^="square-"]');

            for (let i = 0; i < squares.length; ++i) {
                const square = squares[i];
                square.style.backgroundColor = img.colors[i];
            }

            setImg(null);

            setPaint(false);
        }
    }, [img, paint]);

    const editorSizeFormChangeHandler = useCallback(event => {
        let { name, value } = event.target;

        value = Number(value);

        if (value <= 0 || value > 50) return;

        setSize(size =>
            name === 'X' ?
                [value, size[1]] :
                [size[0], value]
        );
    }, []);

    const cleanGrid = useCallback(e => {
        e.preventDefault();
        setImg({
            x: size[0], y: size[1],
            colors: Array(size[0]*size[1]).fill('#ffffff')
        });
    }, [size]);

    return (
        <EditorContext.Provider value={{
            size, penColor, clicks, undos,
            setSize, setPenColor, setClicks, setUndos, setImg
        }}>
            <ColorPicker
                onClose={hidePicker}
                callback={setPenColor}
                pos={pickerPos}
                preset={preset}
            />


            <div className={classes.outerEditorGrid}
                onContextMenu={showPicker}
            >
                <AppBar position="static" className={classes.appBar}
                    onContextMenu={e => e.stopPropagation()}
                >
                    <Toolbar className={classes.toolbar}>
                        <LeftBar
                            size={size}
                            onSizeChange={editorSizeFormChangeHandler}
                            onClean={cleanGrid}
                        />
                        <Typography variant="h6">
                            DrawPixer
                        </Typography>
                    </Toolbar>
                </AppBar>

                <div className={classes.editorGrid} align="center">
                    <div id="editorGridMatrix">
                        <Matrix
                            size={size}
                            onSizeChange={onSizeChange}
                        />
                        <EditorBar
                            onPalette={showPicker}
                        />
                    </div>
                </div>
            </div>
        </EditorContext.Provider>
    );
}
