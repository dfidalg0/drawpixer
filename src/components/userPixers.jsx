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
    DeleteOutline as DeleteIcon
} from '@material-ui/icons';

import Canvas from './canvas'
import { fetchUserDrawings, deleteUserDraw, updateMode } from '../store/actions/drawings';

import { connect } from 'react-redux'

import EditorContext from './context/editor';

import { useState, useCallback, useContext } from 'react';

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

function UserPixers({ fetchUserDrawings, drawings, deleteUserDraw, updateMode }) {
    const classes = useStyles();
    const [opened, setOpened] = useState(false);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);

    const deleteDraw = useCallback(async id => {
        setLoading(true);
        await deleteUserDraw(id);
        setLoading(false);
    }, [deleteUserDraw, setLoading]);

    const toggleDrawer = useCallback(open => e => {
        if (e.type === 'keydown' && ['Tab', 'Shift'].includes(e.key)) {
            return;
        }
        setOpened(open);
        if (open && !drawings) {
            fetchUserDrawings();
        }

    }, [drawings, fetchUserDrawings]);

    const { setImg } = useContext(EditorContext);

    const drawingsList = useCallback(() => drawings ? (
        search ?
            drawings.filter(
                d => d.title.toLowerCase().includes(search.toLowerCase())
            ) :
            drawings
    ).map((draw, index) =>
        <GridListTile className={classes.gridTile} key={index}>
            <Canvas grid={draw.grid} style={{
                maxWidth: '70vw'
            }} />
            <GridListTileBar
                title={draw.title}
                actionIcon={
                    <div>
                        <IconButton
                            className={classes.icon}
                            onClick={() => {updateMode(draw.title); setImg(draw.grid)}}
                            aria-label={`open ${draw.title} in editor`}
                        >
                            <OpenIcon />
                        </IconButton>

                        <IconButton onClick={() => deleteDraw(draw._id)}>
                        { loading? <CircularProgress size={18}/> : <DeleteIcon />  }
                        
                        </IconButton>
                    </div>
                }
            />
        </GridListTile>
    ) :
        <Grid container justify="center" alignContent="center" alignItems="center">
            <CircularProgress />
        </Grid>,
        [classes, drawings, search, setImg, deleteDraw, loading, updateMode]
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
}), { fetchUserDrawings, deleteUserDraw, updateMode })(UserPixers);
