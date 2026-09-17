import React, { useEffect, useMemo, useRef, useState } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../utils/cn';
import type { ProgressProps, ProgressSize, ProgressVariant } from './types';
import sweetCorner from '../../assets/image/sweet-corner.svg';
import forestGrove from '../../assets/image/forest-grove.svg';
import starryCamp from '../../assets/image/starry-camp.svg';
import coffeeBreak from '../../assets/image/coffee-break.svg';

const VARIANT_BG: Record<ProgressVariant, string> = {
    'sweet-corner': sweetCorner,
    'forest-grove': forestGrove,
    'starry-camp': starryCamp,
    'coffee-break': coffeeBreak,
};

const trackVariants = cva('animal-progress-track', {
    variants: {
        size: {
            small: 'animal-progress-track-small',
            middle: 'animal-progress-track-middle',
            large: 'animal-progress-track-large',
        },
    },
    defaultVariants: { size: 'middle' },
});

const INSIDE_MIN_FILL = 18;

export const Progress: React.FC<ProgressProps> = ({
    percent,
    size = 'middle',
    variant,
    showInfo = true,
    infoPosition = 'inside',
    infoFormat,
    duration = 0.6,
    className,
    style,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
}) => {
    const safePercent = useMemo(() => {
        if (typeof percent !== 'number' || Number.isNaN(percent)) return 0;
        return Math.max(0, Math.min(100, percent));
    }, [percent]);

    const renderedInfo = useMemo(() => {
        if (infoFormat) return infoFormat(safePercent);
        return `${Math.round(safePercent)}%`;
    }, [infoFormat, safePercent]);

    // Track width for scene image sizing (reveal-left pattern)
    const trackRef = useRef<HTMLDivElement | null>(null);
    const [trackW, setTrackW] = useState(0);
    useEffect(() => {
        if (!variant) return undefined;
        const el = trackRef.current;
        if (!el) return undefined;
        if (typeof ResizeObserver === 'undefined') {
            setTrackW(el.clientWidth);
            return undefined;
        }
        const ro = new ResizeObserver((entries) => {
            setTrackW(entries[0]?.contentRect?.width ?? el.clientWidth);
        });
        ro.observe(el);
        setTrackW(el.clientWidth);
        return () => ro.disconnect();
    }, [variant]);

    const inlineFillStyle: React.CSSProperties = {
        width: `${safePercent}%`,
        transitionDuration: `${duration}s`,
        ...(variant
            ? {
                  backgroundImage: `url(${VARIANT_BG[variant]})`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'left top',
                  backgroundSize: trackW > 0 ? `${trackW}px auto` : '100% auto',
              }
            : {}),
    };

    const isInside = !variant && showInfo && infoPosition === 'inside';
    const infoInsideVisible = isInside && safePercent >= INSIDE_MIN_FILL;

    const cls = cn('animal-progress', className);
    const trackCls = trackVariants({ size });
    const fillCls = cn(
        'animal-progress-fill',
        variant && 'animal-progress-fill-scene',
        duration === 0 && 'animal-progress-fill-no-transition'
    );
    const bodyCls = cn('animal-progress-body', infoPosition !== 'top' && 'animal-progress-body-no-gap');

    const ariaValueText = typeof renderedInfo === 'string' ? renderedInfo : undefined;

    // scene-image variant: simplified layout (info always on right)
    if (variant) {
        return (
            <div
                className={cls}
                style={style}
                role="progressbar"
                aria-label={ariaLabel}
                aria-labelledby={ariaLabelledBy}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(safePercent)}
                aria-valuetext={ariaValueText}
            >
                <div className="animal-progress-row">
                    <div className={trackCls} ref={trackRef}>
                        <div className={fillCls} style={inlineFillStyle} />
                    </div>
                    {showInfo && (
                        <div className="animal-progress-info animal-progress-info-right">{renderedInfo}</div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div
            className={cls}
            style={style}
            role="progressbar"
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledBy}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(safePercent)}
            aria-valuetext={ariaValueText}
        >
            {infoPosition === 'top' ? (
                <div className={bodyCls}>
                    {showInfo && (
                        <div className="animal-progress-info animal-progress-info-top">{renderedInfo}</div>
                    )}
                    <div className={trackCls}>
                        <div className={fillCls} style={inlineFillStyle}>
                            {infoInsideVisible && (
                                <span className="animal-progress-info-inside">{renderedInfo}</span>
                            )}
                        </div>
                        {isInside && !infoInsideVisible && (
                            <span className="animal-progress-info-inside" style={{ color: '#725d42' }}>
                                {renderedInfo}
                            </span>
                        )}
                    </div>
                </div>
            ) : (
                <div className="animal-progress-row">
                    <div className={trackCls}>
                        <div className={fillCls} style={inlineFillStyle}>
                            {infoInsideVisible && (
                                <span className="animal-progress-info-inside">{renderedInfo}</span>
                            )}
                        </div>
                        {isInside && !infoInsideVisible && (
                            <span className="animal-progress-info-inside" style={{ color: '#725d42' }}>
                                {renderedInfo}
                            </span>
                        )}
                    </div>
                    {showInfo && infoPosition === 'right' && (
                        <div className="animal-progress-info animal-progress-info-right">{renderedInfo}</div>
                    )}
                </div>
            )}
        </div>
    );
};

Progress.displayName = 'Progress';
