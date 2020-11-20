import React, { useRef, useEffect } from 'react'
import classes from '../styles/canvas.module.css';


// elemento que dado um grid retorna um
// canvas com os quadrados pintados

// grid: JSON contendo os dados do desenho
// grid.x e grid.y: dimensões
// grid.colors: vetor com as cores de cada quadradinho

function Canvas({ grid }) {

    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')

        // define tamanho do quadradinho para desenho não
        // ficar muito grande
        var square = grid.x > grid.y ? grid.x : grid.y;
        var dimSquare = 330 / square;

        canvas.width = grid.x * dimSquare;
        canvas.height = grid.y * dimSquare;
        
        // define cor da borda dos quadradinhos
        ctx.strokeStyle = '#999';
        ctx.lineWidth = 0.3;

        // desenha um retângulo branco inicial para evitar
        // que em algumas partes o fundo fique transparente
        ctx.fillStyle = '#999';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // desenha os quadradinhos no canvas
        for (var x = 0; x < grid.x; x++) {
            for (var y = 0; y < grid.y; y++) {
                var id = grid.x * y + x + 1;
                var color = grid.colors[id-1];
                ctx.fillStyle = color;
                ctx.fillRect((x * dimSquare + 0.25), (y * dimSquare + 0.25), (dimSquare - 0.5), (dimSquare - 0.5));
                ctx.strokeRect((x * dimSquare + 0.25), (y * dimSquare + 0.25), (dimSquare - 0.5), (dimSquare - 0.5));
            }
        }
    })

    return <canvas ref={canvasRef} className={classes.canvas} />
}

export default Canvas
