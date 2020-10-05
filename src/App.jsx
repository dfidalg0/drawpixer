import React from 'react';
import logo from './logo.svg';
import './App.css';
import ColorPicker from './components/colorpicker';
import Editor from './components/gridpixels'
import { useState, useEffect } from 'react';

function App() {
    const [color, setColor] = useState('#000000'); // Inicial - Preto
    const [pickerPos, setPickerPos] = useState(null); // Inicial - Não aparecer

    function showPicker(event) {
        event.preventDefault();
        setPickerPos({
            x: event.clientX,
            y: event.clientY
        });
    }

    // Sempre que "color" mudar, a função será executada
    useEffect(() => {
        console.log(color);
    }, [color]);

    return (
        <div className="App"
            onContextMenu={showPicker}
            onClick={() => setPickerPos(null)}
        >
            <header className="header">
                <ColorPicker callback={setColor} pos={pickerPos}/>
            </header>
            <body>
                <Editor color={color}/>
            </body>
        </div>
    );
}

export default App;
