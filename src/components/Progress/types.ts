import type React from 'react';

export type ProgressSize = 'small' | 'middle' | 'large';

/** @deprecated Use variant instead. */
export type ProgressInfoPosition = 'inside' | 'right' | 'top';

export type ProgressVariant = 'sweet-corner' | 'forest-grove' | 'starry-camp' | 'coffee-break';

export interface ProgressProps {
    percent: number;
    size?: ProgressSize;
    showInfo?: boolean;
    /** Fill background scene image. Defaults to 'sweet-corner'. */
    variant?: ProgressVariant;
    /** @deprecated Use showInfo + right alignment (now the only layout). */
    infoPosition?: ProgressInfoPosition;
    infoFormat?: (percent: number) => React.ReactNode;
    duration?: number;
    className?: string;
    style?: React.CSSProperties;
    'aria-label'?: string;
    'aria-labelledby'?: string;
}
