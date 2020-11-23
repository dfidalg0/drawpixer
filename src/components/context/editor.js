import { createContext } from 'react';

/**
 * @typedef {string} HexString
 * @typedef {number} Integer
 * @typedef {{ id: number; color: HexString }} Click
 * @typedef {{ x: Integer; y: Integer; colors: HexString[] }} IMG
 *
 * @type {import('react').Context<{
 *   size: number;
 *   setSize: (size: number) => void;
 *   penColor: HexString;
 *   setPenColor: (color: HexString) => void;
 *   clicks: Click[];
 *   setClicks: (clicks: Click[]) => void;
 *   undos: Click[];
 *   setUndos: (clicks: Click[]) => void;
 *   setImg: (img: IMG) => void;
 * }>}
 */
const EditorContext = createContext({
    size: null,
    setSize: null,
    penColor: null,
    setPenColor: null,
    clicks: null,
    setClicks: null,
    undos: null,
    setUndos: null,
    setImg: null
});

export default EditorContext;
