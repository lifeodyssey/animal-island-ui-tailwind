import type React from 'react';

export type ProgressSize = 'small' | 'middle' | 'large';

export type ProgressInfoPosition = 'inside' | 'right' | 'top';

export type ProgressVariant = 'sweet-corner' | 'forest-grove' | 'starry-camp' | 'coffee-break';

export interface ProgressProps {
    percent: number;
    size?: ProgressSize;
    showInfo?: boolean;
    infoPosition?: ProgressInfoPosition;
    /** Fill background scene image (default: 'sweet-corner') */
    variant?: ProgressVariant;
    infoFormat?: (percent: number) => React.ReactNode;
    duration?: number;
    className?: string;
    style?: React.CSSProperties;
    'aria-label'?: string;
    'aria-labelledby'?: string;
}
