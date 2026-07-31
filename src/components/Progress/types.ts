import type React from 'react';

export type ProgressSize = 'small' | 'middle' | 'large';
export type ProgressInfoPosition = 'right' | 'top' | 'inside';

export interface ProgressProps {
    /** Current progress percentage (0–100) */
    percent?: number;
    /** Bar height size */
    size?: ProgressSize;
    /** Where to display the progress info label */
    infoPosition?: ProgressInfoPosition;
    /** Whether to show the info label */
    showInfo?: boolean;
    /** Custom formatter for the info label */
    format?: (percent: number) => React.ReactNode;
    /** CSS transition duration in ms. Pass 0 to disable transition. */
    duration?: number;
    /** Colour of the filled bar */
    strokeColor?: string;
    /** Colour of the unfilled track */
    trailColor?: string;
    className?: string;
    style?: React.CSSProperties;
    'aria-label'?: string;
    'aria-labelledby'?: string;
}
