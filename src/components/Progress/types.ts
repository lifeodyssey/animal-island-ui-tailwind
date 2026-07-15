import React from 'react';

export type ProgressSize = 'small' | 'middle' | 'large';
export type ProgressInfoPosition = 'right' | 'top' | 'inside';

export interface ProgressProps {
    /** Progress percent (0–100) */
    percent?: number;
    /** Bar height preset */
    size?: ProgressSize;
    /** Show percent info text */
    showInfo?: boolean;
    /** Where to place the info text */
    infoPosition?: ProgressInfoPosition;
    /** Custom fill color */
    strokeColor?: string;
    /** Custom format for info text */
    format?: (percent: number) => React.ReactNode;
    /** Skip fill transition (e.g. during rapid updates) */
    noTransition?: boolean;
    className?: string;
    style?: React.CSSProperties;
}
