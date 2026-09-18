import type React from 'react';

export type ProgressSize = 'small' | 'middle' | 'large';

export type ProgressVariant = 'sweet-corner' | 'forest-grove' | 'starry-camp' | 'coffee-break';

export interface ProgressProps {
    percent: number;
    size?: ProgressSize;
    /** fill 背景场景图（默认 sweet-corner） */
    variant?: ProgressVariant;
    showInfo?: boolean;
    infoFormat?: (percent: number) => React.ReactNode;
    duration?: number;
    className?: string;
    style?: React.CSSProperties;
    'aria-label'?: string;
    'aria-labelledby'?: string;
}
