import React, { useMemo } from 'react';
import { cn } from '../../utils/cn';
import type { ProgressProps, ProgressSize } from './types';

const SIZE_CLASS: Record<ProgressSize, string> = {
    small: 'animal-progress-small',
    middle: 'animal-progress-middle',
    large: 'animal-progress-large',
};

/** Minimum fill percentage at which inside info becomes visible */
const INSIDE_MIN_FILL = 20;

export const Progress: React.FC<ProgressProps> = ({
    percent = 0,
    size = 'middle',
    infoPosition = 'right',
    showInfo = true,
    format,
    duration = 300,
    strokeColor,
    trailColor,
    className,
    style,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledby,
}) => {
    const safePercent = useMemo(() => Math.min(100, Math.max(0, percent ?? 0)), [percent]);

    const renderedInfo = useMemo<React.ReactNode>(
        () => (format ? format(safePercent) : `${safePercent}%`),
        [format, safePercent]
    );

    const isInside = infoPosition === 'inside';
    const infoInsideVisible = safePercent >= INSIDE_MIN_FILL;
    const ariaValueText = format ? String(format(safePercent)) : `${safePercent}%`;

    const inlineFillStyle: React.CSSProperties = {
        width: `${safePercent}%`,
        ...(strokeColor ? { backgroundColor: strokeColor } : {}),
    };

    const bodyCls = cn('animal-progress-body', infoPosition !== 'top' && 'animal-progress-body-nogap');
    const trackCls = cn('animal-progress-track', SIZE_CLASS[size]);
    const fillCls = cn('animal-progress-fill', duration === 0 && 'animal-progress-fill-notransition');

    return (
        <div
            className={cn('animal-progress', className)}
            style={style}
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={safePercent}
            aria-valuetext={ariaValueText}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledby}
        >
            {infoPosition === 'top' ? (
                <div className={bodyCls}>
                    {showInfo && (
                        <div className={cn('animal-progress-info', 'animal-progress-info-top')}>
                            {renderedInfo}
                        </div>
                    )}
                    <div
                        className={trackCls}
                        style={trailColor ? { backgroundColor: trailColor } : undefined}
                    >
                        <div className={fillCls} style={inlineFillStyle} />
                    </div>
                </div>
            ) : (
                <div className={cn(bodyCls, 'animal-progress-row')}>
                    <div
                        className={trackCls}
                        style={trailColor ? { backgroundColor: trailColor } : undefined}
                    >
                        <div className={fillCls} style={inlineFillStyle}>
                            {isInside && infoInsideVisible && showInfo && (
                                <span className="animal-progress-info-inside">{renderedInfo}</span>
                            )}
                        </div>
                    </div>
                    {!isInside && showInfo && (
                        <div className={cn('animal-progress-info', 'animal-progress-info-right')}>
                            {renderedInfo}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

Progress.displayName = 'Progress';
