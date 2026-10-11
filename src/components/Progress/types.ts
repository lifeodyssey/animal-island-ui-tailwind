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
    /**
     * Legacy placement for the default fill; defaults to `inside`.
     * Retained for compatibility. Scene variants always display information on the right.
     * @deprecated Prefer the right-side placement used by scene variants.
     */
    infoPosition?: ProgressInfoPosition;
    /** Scene image to use as fill background. When set, replaces the striped fill. */
    variant?: ProgressVariant;
    infoFormat?: (percent: number) => React.ReactNode;
    duration?: number;
    className?: string;
    style?: React.CSSProperties;
    'aria-label'?: string;
    'aria-labelledby'?: string;
}
