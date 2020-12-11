import React from 'react';
import {
    makeStyles, CircularProgress,
    IconButton, GridListTile,
    GridListTileBar
} from '@material-ui/core';

import {
    OpenInBrowser as OpenIcon,
    DeleteOutline as DeleteIcon
} from '@material-ui/icons';

import Canvas from './canvas'
import { deleteUserDraw, updateMode } from '../store/actions/drawings';

import { useDispatch } from 'react-redux'

import EditorContext from './context/editor';

import { useState, useCallback, useContext } from 'react';

const useStyles = makeStyles(() => ({
    gridTile: {
        display: 'flex',
        alignContent: 'center',
        justifyContent: 'center',
        maxWidth: '70vw',
        maxHeight: 400,
        marginTop: 15,
        marginBottom: 15
    },
    input: {
        marginLeft: 25,
        flex: 1,
    },
    icon: {
        color: 'rgba(255, 255, 255, 0.54)'
    }
}));

export default function DrawMural({ draw }) {

    const classes = useStyles();
    const { setImg } = useContext(EditorContext);

    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();

    const deleteDraw = useCallback(async id => {
        setLoading(true);
        await dispatch(deleteUserDraw(id));
        setLoading(false);
    }, [dispatch, setLoading]);


    return (
        <GridListTile className={classes.gridTile}>
            <Canvas grid={draw.grid} style={{
                maxWidth: '70vw'
            }} size={330} />
            <GridListTileBar
                title={draw.title}
                actionIcon={
                    <div>
                        <IconButton
                            className={classes.icon}
                            onClick={() => { dispatch(updateMode(draw._id)); setImg(draw.grid) }}
                            aria-label={`open ${draw.title} in editor`}
                        >
                            <OpenIcon />
                        </IconButton>

                        <IconButton className={classes.icon} onClick={() => deleteDraw(draw._id)}>
                            {loading ? <CircularProgress size={18} /> : <DeleteIcon />}

                        </IconButton>
                    </div>
                }
            />
        </GridListTile>
    )
}
