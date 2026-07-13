import React, { useMemo } from 'react';
import { cn } from '../../utils/cn';
import type { ProgressSize, ProgressProps } from './types';

const SIZE_CLASS: Record<ProgressSize, string> = {
    small: 'animal-progress-size-small',
    middle: 'animal-progress-size-middle',
    large: 'animal-progress-size-large',
};

const INSIDE_MIN_FILL = 18;

export const Progress: React.FC<ProgressProps> = ({
    percent,
    size = 'middle',
    showInfo = true,
    infoPosition = 'inside',
    infoFormat,
    duration = 0.6,
    className,
    style,
}) => {
    const safePercent = useMemo(() => {
        if (typeof percent !== 'number' || Number.isNaN(percent)) return 0;
        return Math.max(0, Math.min(100, percent));
    }, [percent]);

    const renderedInfo = useMemo(() => {
        if (infoFormat) return infoFormat(safePercent);
        return `${Math.round(safePercent)}%`;
    }, [infoFormat, safePercent]);

    const inlineFillStyle: React.CSSProperties = {
        width: `${safePercent}%`,
        transitionDuration: `${duration}s`,
    };

    const isInside = showInfo && infoPosition === 'inside';
    const infoInsideVisible = isInside && safePercent >= INSIDE_MIN_FILL;

    const trackCls = cn('animal-progress-track', SIZE_CLASS[size]);
    const fillCls = cn('animal-progress-fill', duration === 0 && 'animal-progress-fill-no-transition');

    const ariaValueText = typeof renderedInfo === 'string' ? renderedInfo : undefined;

    const trackNode = (
        <div className={trackCls}>
            <div className={fillCls} style={inlineFillStyle}>
                {infoInsideVisible && <span className="animal-progress-info-inside">{renderedInfo}</span>}
            </div>
            {isInside && !infoInsideVisible && (
                <span className="animal-progress-info-inside" style={{ color: '#725d42' }}>
                    {renderedInfo}
                </span>
            )}
        </div>
    );

    return (
        <div
            className={cn('animal-progress', className)}
            style={style}
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(safePercent)}
            aria-valuetext={ariaValueText}
        >
            {infoPosition === 'top' ? (
                <div className="animal-progress-body">
                    {showInfo && <div className="animal-progress-info animal-progress-info-top">{renderedInfo}</div>}
                    {trackNode}
                </div>
            ) : (
                <div className="animal-progress-row">
                    {trackNode}
                    {showInfo && infoPosition === 'right' && (
                        <div className="animal-progress-info animal-progress-info-right">{renderedInfo}</div>
                    )}
                </div>
            )}
        </div>
    );
};

Progress.displayName = 'Progress';
