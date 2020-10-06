import React from 'react';
import classes from '../styles/grid.module.css';
import EditorSize from './editor-size';
import Matrix from './matrix';
import SaveImage from './saveImage'

export default class Editor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            size: [5, 5]
        }
    }

    editorSizeFormChangeHandler = (event) => {
        let { name, value } = event.target;

        value = Number(value);

        if (value <= 0 || value > 50) return;

        this.setState(state => {
            const { size } = state;

            if (name === 'X')
                return { size: [value, size[1]] };
            else return { size: [size[0], value] }
        });
    }

    cleanGrid = (event) => {
        event.preventDefault();
        this.forceUpdate();
        alert('Não implementado!');
    }

    render() {
        return (
            <div className={classes.outerEditorGrid}>
                <div className={classes.editorGrid} align="center">
                    <div className={classes.editorSize}>
                        <EditorSize
                            size={this.state.size}
                            onChange={this.editorSizeFormChangeHandler}
                            clean={this.cleanGrid}
                        />
                        <SaveImage size={this.state.size}/>
                    </div>

                    <div id="editorGridMatrix">
                        <Matrix
                            size={this.state.size}
                            color={this.props.color}
                        />
                    </div>

                </div>
            </div>
        );
    }
}
