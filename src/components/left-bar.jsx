import React from 'react';
import {
    makeStyles,
    TextField, Button,
    IconButton, SwipeableDrawer,
    List, Divider,
    Grid, Typography
} from '@material-ui/core';
import UserPixers from './userPixers';
import CommunityPixers from './communityPixers';

import SaveImage from './saveImage';
import LogoutButton from './logout-button';

import { Menu as MenuButton } from '@material-ui/icons';

import { useState, useCallback } from 'react';

const useStyles = makeStyles(theme => ({
    root: {
        '& label.Mui-focused': {
            color: 'white'
        }
    },
    drawerPaper: {
        width: 300,
        maxWidth: '80vw',
        backgroundColor: '#20242f'
    },
    drawerList: {
        marginTop: 20
    },
    drawerDivider: {
        background: '#6a6d6d'
    },
    drawerText: {
        color: '#6a6d6d'
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
    },
    menuButton: {
        color: 'white'
    }
}));

// Inclui o botão para o usuário abrir aba
// lateral com seus desenhos (UserPixers),
// formulário de entrada para tamanho da matriz de pixels e
// botão de limpar grade

export default function LeftBar({ size, onSizeChange, onClean }) {
    const classes = useStyles();

    const [open, setOpen] = useState(false);

    const label = useCallback(text => <>
            <Typography
                variant="caption"
                className={classes.drawerText}
            >
                {text}
            </Typography>
            <Divider className={classes.drawerDivider} />
        </>,
        [classes]
    );

    return (
        <>
            <IconButton onClick={() => setOpen(true)}>
                <MenuButton className={classes.menuButton}/>
            </IconButton>
            <SwipeableDrawer classes={{ paper: classes.drawerPaper }}
                open={open}
                onOpen={() => setOpen(true)}
                onClose={() => setOpen(false)}
            >
                <Grid container justify="center" className={classes.drawerList}>
                    <Grid item xs={10}>
                        {label('Configurações da grade')}
                        <List>
                            <TextField label="Largura da grade" variant="filled"
                                value={size[0]}
                                onChange={onSizeChange}
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
                            <TextField label="Altura da grade" variant="filled"
                                value={size[1]}
                                onChange={onSizeChange}
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
                            <Button
                                variant="contained" color="primary"
                                onClick={onClean} size="large"
                                className={classes.button}
                            >
                                Limpar grade
                            </Button>
                        </List>
                        {label('Opções do desenho')}
                        <List>
                            <SaveImage />
                        </List>
                        {label('Conta')}
                        <List>
                            <UserPixers />
                            <LogoutButton />
                        </List>

                        {label('Comunidade')}
                        <List>
                            <CommunityPixers />
                        </List>
                    </Grid>
                </Grid>
            </SwipeableDrawer>
        </>
    );
}
