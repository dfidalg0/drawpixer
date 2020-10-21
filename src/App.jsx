import React from 'react';
import ColorPicker from './components/colorpicker';
import Editor from './components/gridpixels'
import Mural from './components/mural';
import { useState } from 'react';
import './App.css';

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
            <Mural cards={[{
                author: 'Vinícius Brito',
                img: require('./assets/sample1.png'),
                sub: 'Shadowed tree',
                desc: 'A simple landscape. An apple tree, a river and a little accurate shadow.',
                date: new Date('2020-08-10 09:30')
            }, {
                author: 'Vinícius Brito',
                img: require('./assets/sample2.png'),
                sub: 'Coffe mug',
                desc: 'A pretty mug filled with still-hot coffe. Want some?',
                date: new Date('2020-10-15 21:15')
            }, {
                author: 'Diego Fidalgo',
                img: require('./assets/sample3.jpeg'),
                sub: 'ITA logo',
                desc: 'Never heard of it? Then get to know brazilian version of MIT.',
                date: new Date('2020-10-21 19:37')
            }]} />
        </div>
    );
}

export default App;
