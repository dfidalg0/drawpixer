import React from 'react';
import ContentCard from './content-card';

import classes from '../styles/mural.module.css';

export default function Mural ({ cards }){
    return <div className={classes.root}>
        <div>
            {cards.map((card, index) => <ContentCard {...card} key={`card-${index}`}/>)}
        </div>
    </div>
}
