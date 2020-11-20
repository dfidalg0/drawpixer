import React from 'react';
import { TextField, Button, makeStyles } from '@material-ui/core';
import UserPixers from '../components/userPixers';

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
        backgroundColor: '#073D3D',
        marginTop: 15
    }
}));

// Inclui o botão para o usuário abrir aba 
// lateral com seus desenhos (UserPixers), 
// formulário de entrada para tamanho da matriz de pixels e
// botão de limpar grade

export default function EditorSize({ onChange, clean, size }) {
    const classes = useStyles();

    return (
        <div>
            <UserPixers />
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
                <br />
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
                <br />
                <Button
                    variant="contained" color="primary"
                    onClick={clean} size="large"
                    className={classes.button}
                >
                    Limpar grade
            </Button>
            </form>
        </div>
    );
}
