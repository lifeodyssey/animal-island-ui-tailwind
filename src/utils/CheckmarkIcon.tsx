import React from 'react';

/**
 * Shared 16x16 checkmark glyph used inside the Radix Indicator wrappers of
 * Radio and Checkbox. The markup here is intentionally identical to the
 * previously inlined `<svg>` in both components — only the inner glyph moved,
 * the surrounding indicator elements and their `animal-*` classes stay in place.
 */
export const CheckmarkIcon: React.FC = () => (
    <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M2 8L6 12L14 4"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);
