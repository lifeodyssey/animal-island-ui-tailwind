import type React from 'react';

export type ProgressSize = 'small' | 'middle' | 'large';

export type ProgressInfoPosition = 'inside' | 'right' | 'top';

/**
 * Scene image fill variant for the progress bar.
 * When set, the fill shows a scene illustration that reveals left-to-right.
 */
export type ProgressVariant = 'sweet-corner' | 'forest-grove' | 'starry-camp' | 'coffee-break';

export interface ProgressProps {
    percent: number;
    size?: ProgressSize;
    showInfo?: boolean;
    /** @deprecated Use `variant` to set a scene image fill instead */
    infoPosition?: ProgressInfoPosition;
    /** fill 背景场景图；不传时为纯色 fill（`#19c8b9`） */
    variant?: ProgressVariant;
    infoFormat?: (percent: number) => React.ReactNode;
    duration?: number;
    className?: string;
    style?: React.CSSProperties;
    'aria-label'?: string;
    'aria-labelledby'?: string;
}
