import React from 'react';
import classes from '../styles/grid.module.css';
import LeftBar from './left-bar';
import Matrix from './matrix';

import EditorContext from './context/editor';

import pick from 'lodash.pick';

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
            document.getElementById(`square-${id}`).style.backgroundColor = '#ffffff';
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
            <EditorContext.Provider value={{
                ...pick(this.state, [
                    'size',
                    'clicks'
                ]),
                setSize: size => this.setState({ size }),
                setClicks: clicks => this.setState({ clicks })
            }}>
                <div className={classes.outerEditorGrid}>
                    <div className={classes.editorGrid} align="center">
                        <div className={classes.editorSize}>
                            <LeftBar
                                size={this.state.size}
                                onChange={this.editorSizeFormChangeHandler}
                                clean={this.cleanGrid}
                            />
                        </div>

                        <div id="editorGridMatrix">
                            <Matrix color={this.props.color}/>
                        </div>

                    </div>
                </div>
            </EditorContext.Provider>
        );
    }
}
