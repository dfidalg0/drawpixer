import React from 'react';
import {
    makeStyles,
    Grid, CircularProgress,
    Drawer, Button, Paper, InputBase,
    Divider, IconButton, ListSubheader,
    GridListTile, GridList, GridListTileBar,
    Tooltip
} from '@material-ui/core';

import {
    Search as SearchIcon,
    OpenInBrowser as OpenIcon,
} from '@material-ui/icons';

import Canvas from './canvas'
import { getCommunityDrawings, updateMode, likeDrawing, removeLike } from '../store/actions/drawings';

import { useSelector, useDispatch } from 'react-redux'

import EditorContext from './context/editor';

import { useState, useCallback, useContext } from 'react';

import FavoriteIcon from '@material-ui/icons/Favorite';

const useStyles = makeStyles((theme) => ({
    filterBar: {
        marginBottom: 10,
        marginTop: 10
    },
    list: {
        width: 600,
        maxWidth: '80vw'
    },
    gridList: {
        width: 600,
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
    iconRed: {
        color: 'red',
    },
    input: {
        marginLeft: 25,
        flex: 1,
    },
    iconButton: {
        padding: 10,
    }
}));

function Draw({ draw, index }) {
    const classes = useStyles();

    const [loadingLike, setLoadingLike] = useState(false);
    const [loadingDislike, setLoadingDislike] = useState(false);

    const dispatch = useDispatch();
    const { setImg } = useContext(EditorContext);

    const likeDraw = useCallback(async () => {
        setLoadingLike(true);
        await dispatch(likeDrawing(draw._id))
        setLoadingLike(false);
    }, [dispatch, setLoadingLike, draw]);

    const dislike = useCallback(async () => {
        setLoadingDislike(true);
        await dispatch(removeLike(draw._id));
        setLoadingDislike(false);
    }, [dispatch, setLoadingDislike, draw]);

    return (
        <GridListTile className={classes.gridTile} key={index} style={{ minHeight: 250, width: '50%' }}>
            <Canvas grid={draw.grid} size={250} />
            <GridListTileBar
                title={draw.title}
                subtitle={<span>Autor: {draw.user ? draw.user.name : 'Desconhecido'}</span>}
                actionIcon={
                    <Grid container>
                        <Grid item xs={6}>
                            <IconButton
                                className={classes.icon}
                                onClick={() => { dispatch(updateMode(null)); setImg(draw.grid) }}
                                aria-label={`open ${draw.title} in editor`}
                            >
                                <OpenIcon />
                            </IconButton>
                        </Grid>
                        <Grid item xs={6}>
                            {!draw.likes ? <IconButton className={classes.icon}
                                onClick={() => likeDraw()}>
                                {loadingLike ? <CircularProgress size={18} /> : <Tooltip title={draw.num_likes} aria-label="add"><FavoriteIcon /></Tooltip>}
                            </IconButton> :
                                <IconButton className={classes.iconRed}
                                onClick={() => dislike()}>
                                    {loadingDislike ? <CircularProgress size={18} /> : <Tooltip title={draw.num_likes} aria-label="add"><FavoriteIcon /></Tooltip>}
                                </IconButton>
                            }

                        </Grid>
                    </Grid>
                }
            />
        </GridListTile>
    )
}

export default function CommunityPixers() {
    const classes = useStyles();
    const [opened, setOpened] = useState(false);
    const [search, setSearch] = useState('');

    const drawings = useSelector(state => state.community.list);

    const dispatch = useDispatch();

    const [loading, setLoading] = useState(false);

    const toggleDrawer = useCallback(open => e => {
        if (e.type === 'keydown' && ['Tab', 'Shift'].includes(e.key)) {
            return;
        }
        setOpened(open);
        if (open && !drawings) {
            dispatch(getCommunityDrawings())
        }

    }, [drawings, dispatch]);

    const drawingsList = useCallback(() => drawings ? (
        search ?
            drawings.filter(
                d => d.title.toLowerCase().includes(search.toLowerCase())
            ) :
            drawings
    ).map((draw, index) =>
        <Draw draw={draw} index={index} key={index}/>
    ) :
        <Grid container justify="center" alignContent="center" alignItems="center" style={{ width: 600 }}>
            <CircularProgress />
        </Grid>,
        [drawings, search]
    );

    const all = useSelector(state => state.community.all);

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
                            height: '80%',
                            width: '95%',
                            marginLeft: '2%'
                        }}>
                            {drawingsList()}
                        </GridList>
                        {all ? null :
                            drawings ?
                                <Button
                                    onClick={async () => {
                                        setLoading(true);
                                        await dispatch(getCommunityDrawings());
                                        setLoading(false);
                                    }}
                                    style={{ height: 60 }}
                                    disabled={loading}
                                >
                                    Carregar Mais
                                </Button> :
                                null
                        }

                    </GridList>
                </div>
            </Drawer>
        </div>
    );
}
