import React from 'react';
import classes from '../styles/grid.module.css';
import EditorSize from './editor-size';
import Matrix from './matrix';
import SaveImage from './saveImage';
import BackButton from './backButton';
import LogoutButton from './logout-button';

export default class Editor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            size: [10, 10],
            clicks: {
                button: [],
                color: []
            }
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
        const { size } = this.state;
        for(let id = 1; id <= size[0] * size[1]; ++id){
            document.getElementById(id).style.backgroundColor = '#ffffff';
        }
        this.setState({
            clicks: {
                button: [],
                color: []
            }
        })
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
                        <SaveImage size={this.state.size}
                            setSize={size => {
                                this.setState({ size, clicks: {
                                    button: [],
                                    color: []
                                } });
                            }}
                        />
                        <BackButton clicks={this.state.clicks} />
                        <LogoutButton />
                    </div>

                    <div id="editorGridMatrix">
                        <Matrix
                            size={this.state.size}
                            clicks={this.state.clicks}
                            color={this.props.color}
                            setClicks={clicks => this.setState({ clicks })}
                        />
                    </div>

                </div>
            </div>
        );
    }
}
