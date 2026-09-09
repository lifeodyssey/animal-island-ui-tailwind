import type { CSSProperties } from 'react';
import artworkSheet from './assets/island-icons.png';

const ARTWORK_CELLS = {
    camera: [0, 0],
    travel: [1, 0],
    encyclopedia: [2, 0],
    diy: [0, 1],
    design: [1, 1],
    map: [2, 1],
    passport: [0, 2],
    helicopter: [1, 2],
    chat: [2, 2],
} as const;

export type ArtworkName = keyof typeof ARTWORK_CELLS;

/** Shared transparent atlas keeps the Phone and named Icon artwork identical. */
export const getArtworkStyle = (name: ArtworkName): CSSProperties => {
    const [column, row] = ARTWORK_CELLS[name];
    return {
        backgroundImage: `url("${artworkSheet}")`,
        backgroundSize: '300% 300%',
        backgroundPosition: `${column * 50}% ${row * 50}%`,
        backgroundRepeat: 'no-repeat',
    };
};
