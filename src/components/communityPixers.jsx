import React from 'react';
import {
    makeStyles,
    Grid, CircularProgress,
    Drawer, Button, Paper, InputBase,
    Divider, IconButton, ListSubheader,
    GridListTile, GridList, GridListTileBar
} from '@material-ui/core';

import {
    Search as SearchIcon,
    OpenInBrowser as OpenIcon,
} from '@material-ui/icons';

import Canvas from './canvas'
import { getCommunityDrawings, updateMode } from '../store/actions/drawings';

import { connect } from 'react-redux'

import EditorContext from './context/editor';

import { useState, useCallback, useContext } from 'react';

const useStyles = makeStyles((theme) => ({
    filterBar: {
        marginBottom: 10,
        marginTop: 10
    },
    list: {
        width: 500,
        maxWidth: '80vw'
    },
    gridList: {
        width: 500,
        maxWidth: '80vw',
        height: '100vh'
    },
    gridTile: {
        display: 'flex',
        alignContent: 'center',
        justifyContent: 'center',
        marginTop: 30,
    },
    button: {
        display: 'flex',
        width: '100%',
        marginBottom: 15,
        backgroundColor: '#073D5F',
        color: 'white',
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

function CommunityPixers({ getCommunityDrawings, drawings, all, updateMode }) {
    const classes = useStyles();
    const [opened, setOpened] = useState(false);
    const [search, setSearch] = useState('');

    const toggleDrawer = useCallback(open => e => {
        if (e.type === 'keydown' && ['Tab', 'Shift'].includes(e.key)) {
            return;
        }
        setOpened(open);
        if (open && !drawings) {
            getCommunityDrawings();
        }

    }, [drawings, getCommunityDrawings]);

    const { setImg } = useContext(EditorContext);

    const drawingsList = useCallback(() => drawings ? (
        search ?
            drawings.filter(
                d => d.title.toLowerCase().includes(search.toLowerCase())
            ) :
            drawings
    ).map((draw, index) =>
        <GridListTile className={classes.gridTile} key={index} style={{ minHeight: 250 }}>
            <Canvas grid={draw.grid} size={200} />
            <GridListTileBar
                title={draw.title}
                subtitle={<span>Autor: {draw.user ? draw.user.name : 'Desconhecido'}</span>}
                actionIcon={
                    <IconButton
                        className={classes.icon}
                        onClick={() => { updateMode(null); setImg(draw.grid)}}
                        aria-label={`open ${draw.title} in editor`}
                    >
                        <OpenIcon />
                    </IconButton>
                }
            />
        </GridListTile>
    ) :
        <Grid container justify="center" alignContent="center" alignItems="center" style={{ width: 600 }}>
            <CircularProgress />
        </Grid>,
        [classes, drawings, search, setImg, updateMode]
    );

    return (
        <div>
            <Button onClick={toggleDrawer(true)} className={classes.button} size='large'>Desenhos</Button>
            <Drawer anchor="left" open={opened} onClose={toggleDrawer(false)}>
                <div className={classes.root}>
                    <GridList className={classes.gridList} cols={1}>
                        <GridListTile key="Subheader" cols={1} style={{ height: 'auto' }}>
                            <ListSubheader component="div" style={{ fontSize: '16pt' }}>
                                Desenhos
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
                        <GridList cols={2} justify="center" style={{
                            height: '85%',
                            width: '95%',
                            marginLeft: '2%'
                        }}>
                            {drawingsList()}
                        </GridList>
                        {all ? null : <Button onClick={getCommunityDrawings} style={{ height: 60 }}>Carregar Mais</Button>}

                    </GridList>
                </div>
            </Drawer>
        </div>
    );
}

export default connect(state => ({
    drawings: state.community.list,
    all: state.community.all,
}), { getCommunityDrawings, updateMode })(CommunityPixers);