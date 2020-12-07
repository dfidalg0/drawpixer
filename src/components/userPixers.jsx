import React from 'react';
import {
    makeStyles,
    Grid, CircularProgress,
    Drawer, Button, Paper, InputBase,
    Divider, IconButton, ListSubheader,
    GridListTile, GridList,
} from '@material-ui/core';

import {
    Search as SearchIcon,
} from '@material-ui/icons';

import { fetchUserDrawings } from '../store/actions/drawings';

import { connect } from 'react-redux'

import DrawMural from './drawMural';

import { useState, useCallback } from 'react';

const useStyles = makeStyles((theme) => ({
    filterBar: {
        marginBottom: 10,
        marginTop: 10
    },
    list: {
        width: 400,
        maxWidth: '80vw'
    },
    gridList: {
        width: 400,
        maxWidth: '80vw',
        height: '100vh'
    },
    gridTile: {
        display: 'flex',
        alignContent: 'center',
        justifyContent: 'center',
        maxWidth: '70vw',
        maxHeight: 400,
        marginTop: 30,
    },
    button: {
        display: 'flex',
        width: '100%',
        marginBottom: 15,
        backgroundColor: '#067A8A',
    },
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
    },
    icon: {
        color: 'rgba(255, 255, 255, 0.54)',
    },
    input: {
        marginLeft: 25,
        flex: 1,
    },
    iconButton: {
        padding: 10,
    }
}));

function UserPixers({ fetchUserDrawings, drawings }) {
    const classes = useStyles();
    const [opened, setOpened] = useState(false);
    const [search, setSearch] = useState('');

    const toggleDrawer = useCallback(open => e => {
        if (e.type === 'keydown' && ['Tab', 'Shift'].includes(e.key)) {
            return;
        }
        setOpened(open);
        if (open && !drawings) {
            fetchUserDrawings();
        }

    }, [drawings, fetchUserDrawings]);


    const drawingsList = useCallback(() => drawings ? (
        search ?
            drawings.filter(
                d => d.title.toLowerCase().includes(search.toLowerCase())
            ) :
            drawings
    ).map((draw, index) =>
        <DrawMural draw={draw} key={index} />
    ) :
        <Grid container justify="center" alignContent="center" alignItems="center">
            <CircularProgress />
        </Grid>,
        [drawings, search]
    );

    return (
        <div>
            <Button onClick={toggleDrawer(true)} className={classes.button} size='large'>Meus Desenhos</Button>
            <Drawer anchor="left" open={opened} onClose={toggleDrawer(false)}>
                <div className={classes.root}>
                    <GridList cellHeight={380} className={classes.gridList} cols={1}>
                        <GridListTile key="Subheader" cols={1} style={{ height: 'auto' }}>
                            <ListSubheader component="div" style={{ fontSize: '16pt' }}>
                                Meus Desenhos
                            </ListSubheader>
                            <Divider />
                            <Grid container justify="center"
                                className={classes.filterBar}
                            >
                                <Grid item xs={10}>
                                    <Paper component="form" className={classes.root}>
                                        <InputBase
                                            disabled={!drawings}
                                            value={search}
                                            onChange={e => setSearch(e.target.value)}
                                            className={classes.input}
                                            placeholder="Filtrar"
                                            inputProps={{ 'aria-label': 'search' }}
                                        />
                                        <IconButton className={classes.iconButton} aria-label="search">
                                            <SearchIcon />
                                        </IconButton>
                                    </Paper>
                                </Grid>
                            </Grid>
                            <Divider />
                        </GridListTile>
                        <Grid container justify="center" style={{
                            height: '100%'
                        }}>
                            {drawingsList()}
                        </Grid>
                    </GridList>
                </div>
            </Drawer>
        </div>
    );
}

export default connect(state => ({
    drawings: state.drawings.list
}), { fetchUserDrawings })(UserPixers);
