import React from 'react';

/**
 * Progress bar size.
 *  - small:  12px height
 *  - middle: 20px height (default)
 *  - large:  28px height
 */
export type ProgressSize = 'small' | 'middle' | 'large';

/**
 * Percent text position.
 *  - inside: inside the bar (right-aligned within fill; fallback to right edge of track when fill is too narrow)
 *  - right:  right of the bar
 *  - top:    above the bar
 */
export type ProgressInfoPosition = 'inside' | 'right' | 'top';

export interface ProgressProps {
    percent: number;
    size?: ProgressSize;
    showInfo?: boolean;
    infoPosition?: ProgressInfoPosition;
    infoFormat?: (percent: number) => React.ReactNode;
    /** Fill width animation duration in seconds; 0 = no animation */
    duration?: number;
    className?: string;
    style?: React.CSSProperties;
}
