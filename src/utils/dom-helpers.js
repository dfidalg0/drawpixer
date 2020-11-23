import { useState, useEffect } from 'react';

/**
 * @param {number} id
 * @returns {HTMLButtonElement}
 */
export function getSquare(id){
    return document.getElementById(`square-${id}`);
}

/**
 * @returns {NodeListOf<HTMLButtonElement>}
 */
export function getAllSquares(){
    return document.querySelectorAll('button[id^="square-"]');
}

/**
 * @returns {[number, number]}
 */
export function getMaxSizes(){
    const x = window.innerWidth - 40; // width - padding
    const y = window.innerHeight - 20 - 45 - 48; // height - padding - appbar - editorbar

    return [x,y];
}

/**
 * @returns {[number, number]}
 */
export function useMaxSizes(){
    const [maxSizes, setMaxSizes] = useState(getMaxSizes());

    useEffect(() => {
        const handler = () => setMaxSizes(getMaxSizes());

        window.addEventListener('resize', handler);

        return () => window.removeEventListener('resize', handler);
    }, []);

    return maxSizes;
}
