export function getSquare(id){
    return document.getElementById(`square-${id}`);
}

export function getAllSquares(){
    return document.querySelectorAll('button[id^="square-"]');
}

export function getMaxSizes(){
    const x = window.innerWidth - 40; // width - padding
    const y = window.innerHeight - 20 - 45 - 48; // height - padding - appbar - editorbar

    return [x,y];
}
