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

    gridTile: {
        display: 'flex',
        alignContent: 'center',
        justifyContent: 'center',
        marginTop: 30,
    },
}));




function UserPixers({ getUserDrawings }) {
    const classes = useStyles();
    const [opened, setOpened] = useState(false);
    const [draw, setDraw] = useState([]);

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setOpened(open);
        if (open) {
            getUserDrawings().then(data => { setDraw(data.drawings); console.log(draw) });
        }

    };


    function drawings() {
        return (
            draw.map((tile) => (
                <GridListTile className={classes.gridTile}>
                    <div style={{ justifyContent: 'center' }}>
                        <Canvas grid={tile.grid} />
                    </div>
                    <GridListTileBar className={classes.tileBar}
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
                        </Paper>
                        <Divider />
                    </GridListTile>
                    {drawings()}
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