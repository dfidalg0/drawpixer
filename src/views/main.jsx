import React from 'react';
import Editor from '../components/editor'
// import Mural from '../components/mural';

export default function Main(){
    return (
        <div
            className="App"
        >
            <Editor />
            {/* <Mural cards={[{
                author: 'Vinícius Brito',
                img: require('../assets/sample1.png'),
                sub: 'Shadowed tree',
                desc: 'A simple landscape. An apple tree, a river and a little accurate shadow.',
                date: new Date('2020-08-10 09:30')
            }, {
                author: 'Ana Paula Schuch',
                img: require('../assets/sample2.png'),
                sub: 'Coffe mug',
                desc: 'A pretty mug filled with still-hot coffe. Want some?',
                date: new Date('2020-10-15 21:15')
            }, {
                author: 'Diego Fidalgo',
                img: require('../assets/sample3.jpeg'),
                sub: 'ITA logo',
                desc: 'Never heard of it? Then get to know brazilian version of MIT.',
                date: new Date('2020-10-21 19:37')
            }]} /> */}
        </div>
    );
}
