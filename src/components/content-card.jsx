import React, { useState } from 'react';
import Card from '@material-ui/core/Card';
import { makeStyles } from '@material-ui/core/styles';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';

const useStyles = makeStyles(theme => ({
    root: {
        maxWidth: 345,
        display: 'inline-block',
        marginLeft: '0px'
    },
    media: {
        paddingTop: '100%', // 16:9
        height: 0,
    },
    expand: {
        transform: 'scale(0.7)',
        marginLeft: '-50px',
        marginRight: '-50px',
        transition: [
            theme.transitions.create('transform', {
                duration: theme.transitions.duration.enteringScreen,
            }),
            theme.transitions.create('margin', {
                duration: theme.transitions.duration.complex,
            })
        ].join(','),
    },
    expandOpen: {
        marginLeft: '0px',
        marginRight: '0px',
        transform: 'translateY(calc(-10% - 350px))',
    },
    avatar: {
        backgroundColor: red[500],
    },
}));

export default function ContentCard({author, img, sub, desc, date}) {
    const classes = useStyles();
    const [expanded, setExpanded] = useState(false);

    // const handleExpandClick = () => {
    //   setExpanded(!expanded);
    // };

    return (
        <Card
            className={`
                ${classes.root} ${classes.expand}
                ${expanded ? classes.expandOpen : ''}
            `}
            onMouseEnter={() => setExpanded(true)}
            onMouseLeave={() => setExpanded(false)}
        >
            <CardHeader
                avatar={
                    <Avatar aria-label="recipe" className={classes.avatar}>
                        {author.slice(0,1)}
                    </Avatar>
                }
                title={sub}
                subheader={date.toLocaleString().slice(0,-3)}
            />
            <CardMedia
                className={classes.media}
                image={img}
                title={sub}
            />
            <CardContent>
                <Typography variant="body2" color="textSecondary" component="p">
                    {desc}
                </Typography>
            </CardContent>
            <CardActions disableSpacing>
                <IconButton aria-label="add to favorites">
                    <FavoriteIcon />
                </IconButton>
                <IconButton aria-label="share">
                    <ShareIcon />
                </IconButton>
            </CardActions>
        </Card>
    );
}
