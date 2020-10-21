import React from 'react';
import './App.css';
import ColorPicker from './components/colorpicker';
import Editor from './components/gridpixels'
import Mural from './components/mural'
import sample1 from './images/sample1.png'
import sample2 from './images/sample2.png'
import sample3 from './images/sample3.jpeg'
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
            <div class="block">
                <p align="center">Sugerido para você.</p>
                //Bug: cards separados na vertical, não na horizontal.
                <div class="sample"><Mural
                    img = {sample2}
                    sub = {"Coffe mug"}
                    desc = {"A pretty mug filled with still-hot coffe. Want some?"}
                /></div>
                <div class="sample"><Mural
                    img = {sample1}
                    sub = {"Shadowed tree"}
                    desc = {"A simple landscape.\nAn apple tree, a river and a little accurate shadow."}
                /></div>
                <div class="sample"><Mural
                    img = {sample3}
                    sub = {"ITA logo"}
                    desc = {"Never heard of it? Then get to know brazilian version of MIT."}
                /></div>
            </div>
        </div>
    );
}

export default App;
