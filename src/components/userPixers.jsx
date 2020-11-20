import React, { useState } from 'react';
import { makeStyles, Drawer, Button, Paper, InputBase, Divider, IconButton, ListSubheader, GridListTile, GridList, GridListTileBar } from '@material-ui/core';

import SearchIcon from '@material-ui/icons/Search';
import InfoIcon from '@material-ui/icons/Info';
import Canvas from './canvas'
import { getUserDrawings } from '../store/actions/drawings';

import { connect } from 'react-redux'

const useStyles = makeStyles((theme) => ({
    list: {
        width: 400,
    },
    fullList: {
        width: 'auto',
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
    gridList: {
        width: 400,
        height: '100%',
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
    },
}));



const tileData = [
    {
        grid: { "x": 10, "y": 10, "colors": ["#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#000000", "#000000", "#ffffff", "#000000", "#000000", "#ffffff", "#000000", "#ffffff", "#ffffff", "#ffffff", "#000000", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#000000", "#ffffff", "#ffffff", "#000000", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#000000", "#ffffff", "#000000", "#ffffff", "#ffffff", "#000000", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#000000", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#000000", "#000000", "#000000", "#000000", "#000000", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff"] },
        title: 'Oi',
        author: 'Ana',
    },
    {
        grid: { "x": 10, "y": 10, "colors": ["#f8e71c", "#f8e71c", "#f8e71c", "#f8e71c", "#f8e71c", "#f8e71c", "#f8e71c", "#f8e71c", "#f8e71c", "#f8e71c", "#f8e71c", "#d0021b", "#d0021b", "#d0021b", "#d0021b", "#d0021b", "#d0021b", "#d0021b", "#d0021b", "#f8e71c", "#f8e71c", "#d0021b", "#b8e986", "#b8e986", "#b8e986", "#b8e986", "#b8e986", "#b8e986", "#d0021b", "#f8e71c", "#f8e71c", "#d0021b", "#b8e986", "#9013fe", "#9013fe", "#9013fe", "#9013fe", "#b8e986", "#d0021b", "#f8e71c", "#f8e71c", "#d0021b", "#b8e986", "#9013fe", "#8b572a", "#8b572a", "#9013fe", "#b8e986", "#d0021b", "#f8e71c", "#f8e71c", "#d0021b", "#b8e986", "#9013fe", "#8b572a", "#8b572a", "#9013fe", "#b8e986", "#d0021b", "#f8e71c", "#f8e71c", "#d0021b", "#b8e986", "#9013fe", "#9013fe", "#9013fe", "#9013fe", "#b8e986", "#d0021b", "#f8e71c", "#f8e71c", "#d0021b", "#b8e986", "#b8e986", "#b8e986", "#b8e986", "#b8e986", "#b8e986", "#d0021b", "#f8e71c", "#f8e71c", "#d0021b", "#d0021b", "#d0021b", "#d0021b", "#d0021b", "#d0021b", "#d0021b", "#d0021b", "#f8e71c", "#f8e71c", "#f8e71c", "#f8e71c", "#f8e71c", "#f8e71c", "#f8e71c", "#f8e71c", "#f8e71c", "#f8e71c", "#f8e71c"] },
        title: 'quadrado',
        author: 'Ana',
    },
    {
        grid: { "x": 10, "y": 10, "colors": ["#417505", "#417505", "#417505", "#417505", "#417505", "#417505", "#417505", "#417505", "#417505", "#7ed321", "#417505", "#8b572a", "#8b572a", "#8b572a", "#8b572a", "#f8e71c", "#ffffff", "#4a90e2", "#417505", "#417505", "#417505", "#ffffff", "#8b572a", "#8b572a", "#8b572a", "#8b572a", "#ffffff", "#4a90e2", "#7ed321", "#417505", "#417505", "#4a90e2", "#4a90e2", "#7ed321", "#8b572a", "#f8e71c", "#8b572a", "#7ed321", "#4a90e2", "#417505", "#417505", "#8b572a", "#4a90e2", "#ffffff", "#7ed321", "#8b572a", "#7ed321", "#8b572a", "#8b572a", "#417505", "#417505", "#4a90e2", "#8b572a", "#f8e71c", "#f8e71c", "#f8e71c", "#8b572a", "#f8e71c", "#8b572a", "#417505", "#417505", "#4a90e2", "#ffffff", "#8b572a", "#7ed321", "#f8e71c", "#ffffff", "#8b572a", "#7ed321", "#417505", "#417505", "#4a90e2", "#7ed321", "#4a90e2", "#8b572a", "#4a90e2", "#4a90e2", "#8b572a", "#8b572a", "#417505", "#417505", "#8b572a", "#8b572a", "#8b572a", "#ffffff", "#8b572a", "#4a90e2", "#ffffff", "#8b572a", "#417505", "#417505", "#417505", "#417505", "#417505", "#417505", "#417505", "#417505", "#417505", "#417505", "#417505"] },
        title: 'floresta',
        author: 'Ana',
    }
];



function UserPixers({ getUserDrawings }) {
    const classes = useStyles();
    const [opened, setOpened] = useState(false);
    const [draw, setDraw] = useState(tileData);

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setOpened(open);
        if (open) {
            getUserDrawings().then (data => {setDraw(data.drawings); console.log(draw)});
        }

    };
    

    function drawings() {
        return (
            draw.map((tile) => (
                <GridListTile>
                    <Canvas grid={tile.grid} />
                    <GridListTileBar
                        title={tile.title}
                        actionIcon={
                            <IconButton aria-label={`info about ${tile.title}`} className={classes.icon}>
                                <InfoIcon />
                            </IconButton>
                        }
                    />
                </GridListTile>
            ))
        )
    }

    function DisplayDrawings() {
        const classes = useStyles();
        return (
            <div className={classes.root}>

                <GridList cellHeight={380} className={classes.gridList} cols={1}>
                    <GridListTile key="Subheader" cols={1} style={{ height: 'auto' }}>
                        <ListSubheader component="div" style={{ fontSize: '16pt' }} color='secondary'>Meus Desenhos</ListSubheader>
                        <Divider />
                        <Paper component="form" className={classes.root}>
                            <InputBase
                                className={classes.input}
                                placeholder="Buscar"
                                inputProps={{ 'aria-label': 'search' }}
                            />
                            <IconButton type="submit" className={classes.iconButton} aria-label="search">
                                <SearchIcon />
                            </IconButton>
                            {drawings()}
                        </Paper>
                        <Divider />
                    </GridListTile>

                </GridList>
            </div>
        );
    }

    const myDrawings = () => (
        <div
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
        >
            {DisplayDrawings()}
        </div>
    );

    return (
        <div>
            <Button onClick={toggleDrawer(true)} className={classes.button} size='large'>Meus Desenhos</Button>
            <Drawer anchor={'right'} open={opened} onClose={toggleDrawer(false)}>
                {myDrawings()}
            </Drawer>
        </div>
    );
}

export default connect(null, { getUserDrawings })(UserPixers);