import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Square extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 'white',
        };
    }
    render() {
        return (
            <button className="square" style={{ backgroundColor: this.state.value }} onClick={() => this.setState({ value: 'red' })}
            >
            </button>
        );
    }
}

class Editor extends React.Component {
    constructor(props) {
        super(props);
        this.sizeX = 5;
        this.sizeY = 5;
    }

    editorSizeFormChangeHandler = (event) => {
        let nam = event.target.name;
        let val = event.target.value;
        if (nam === "X") {
            this.sizeX = val;
        } else {
            this.sizeY = val;
        }
    }

    editorSizeFormHandleSubmit = (event) => {
        event.preventDefault();
        if (this.sizeX < 1 || this.sizeY < 1) {
            alert('Valor inválido inserido');
        } else {
            this.forceUpdate();
        }
    }

    renderEditorSize() {
        return (
            <form>
                <label>
                    Dimensão X:         </label>
                <input type="number" name="X" onChange={this.editorSizeFormChangeHandler} />
                <br />
                <label>
                    Dimensão Y:         </label>
                <input type="number" name="Y" onChange={this.editorSizeFormChangeHandler} />

                <br />
                <button onClick={this.editorSizeFormHandleSubmit}>Alterar</button>
            </form>
        );
    }

    renderSquare(i) {
        return <Square value={i} />;
    }

    renderMatrix() {
        let matrix = []
        let row = []
        for (let x = 0; x < this.sizeY; x++) {
            row = []
            for (let y = 0; y < this.sizeX; y++) {
                row.push(this.renderSquare(x + y + 1))
            }
            matrix.push(<div className="editor-row">{row}</div>)
        }

        return matrix
    }

    render() {
        return (
            <div>
                <div className="editorSize">
                    {this.renderEditorSize()}
                </div>
                <br />
                <br />
                <br />
                <div align="center">
                    {this.renderMatrix()}
                </div>
            </div>
        );
    }
}

class Screen extends React.Component {
    render() {
        return (
            <div className="editor">
                <Editor />
            </div>
        );
    }
}

ReactDOM.render(
    <Screen />,
    document.getElementById('root')
);
