import React from 'react';
import { TextField, Button, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    root: {
        '& label.Mui-focused': {
            color: 'white'
        }
    },
    input: {
        color: 'white',
        backgroundColor: '#ffffff0a'
    },
    label: {
        color: '#909090'
    },
    button: {
        display: 'flex',
        width: '100%',
        backgroundColor: '#073D3D'
    }
}));

export default function EditorSize({ onChange, clean, size }) {
    const classes = useStyles();

    return (
        <form className={classes.editorSize}>
            <TextField label="Dimensão X" variant="filled"
                value={size[0]}
                onChange={onChange}
                type="number"
                className={classes.root}
                InputProps={{
                    autoComplete: 'off',
                    className: classes.input,
                    name: 'X'
                }}
                InputLabelProps={{
                    className: classes.label
                }}
            />
            <br/>
            <TextField label="Dimensão Y" variant="filled"
                value={size[1]}
                onChange={onChange}
                type="number"
                className={classes.root}
                InputProps={{
                    autoComplete: 'off',
                    className: classes.input,
                    name: 'Y'
                }}
                InputLabelProps={{
                    className: classes.label
                }}
            />
            <br/>
            <Button
                variant="contained" color="primary"
                onClick={clean} size="large"
                className={classes.button}
            >
                Limpar grade
            </Button>
        </form>
    );
}
