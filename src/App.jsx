import React from 'react';
import './App.css';
import ColorPicker from './components/colorpicker';
import Editor from './components/gridpixels'
import { useState } from 'react';

function App() {
    const [color, setColor] = useState('#000000'); // Inicial - Preto
    const [pickerPos, setPickerPos] = useState(null); // Inicial - Não aparecer
    const [preset, setPreset] = useState([
        '#d0021b', '#f5a623', '#f8e71c', '#8b572a', '#7ed321',
        '#417505', '#bd10e0', '#9013fe', '#4a90e2', '#50e3c2',
        '#b8e986', '#000000', '#4a4a4a', '#9b9b9b', '#f0f0f0',
        '#ffffff'
    ]);

    function showPicker(event) {
        event.preventDefault();
        setPickerPos({
            x: event.clientX,
            y: event.clientY
        });
    }

    function hidePicker(){
        if (!preset.includes(color))
            setPreset([color, ...preset.slice(0, -1)]);
        else {
            setPreset([color, ...preset.filter(c => c !== color)]);
        }
        setPickerPos(null);
    }

    return (
        <div
            className="App"
            onContextMenu={showPicker}
            onClick={hidePicker}
        >
            <ColorPicker
                callback={setColor}
                pos={pickerPos}
                preset={preset}
            />
            <Editor color={color} />
        </div>
    );
}

export default App;
