/**
 * @param {string} rgb
 * @returns {string} RGB convertido para Hexadecimal
 */
export function rgb2hex(rgb) {
    const hex = (x) => {
        return ('0' +  parseInt(x).toString(16)).slice(-2);
    }

    if (rgb.search("rgb") === -1) {
        return rgb;
    }
    else {
        rgb = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+))?\)$/);
        return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
    }
}
