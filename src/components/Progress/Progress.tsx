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
        } satisfies Record<ProgressSize, string>,
    },
    defaultVariants: { size: 'middle' },
});

export const Progress: React.FC<ProgressProps> = ({
    percent,
    size = 'middle',
    variant = 'sweet-corner',
    showInfo = true,
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

    const trackRef = useRef<HTMLDivElement | null>(null);
    const [trackW, setTrackW] = useState(0);
    useEffect(() => {
        const el = trackRef.current;
        if (!el) return;
        if (typeof ResizeObserver === 'undefined') {
            setTrackW(el.clientWidth);
            return;
        }
        const ro = new ResizeObserver((entries) => {
            setTrackW(entries[0]?.contentRect?.width ?? el.clientWidth);
        });
        ro.observe(el);
        setTrackW(el.clientWidth);
        return () => ro.disconnect();
    }, []);

    const inlineFillStyle: React.CSSProperties = {
        width: `${safePercent}%`,
        transitionDuration: `${duration}s`,
        backgroundImage: `url(${VARIANT_BG[variant]})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'left top',
        backgroundSize: trackW > 0 ? `${trackW}px auto` : '100% auto',
    };

    const ariaValueText = typeof renderedInfo === 'string' ? renderedInfo : undefined;

    return (
        <div
            className={cn('animal-progress', className)}
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
                <div className={cn(trackVariants({ size }))} ref={trackRef}>
                    <div
                        className={cn(
                            'animal-progress-fill',
                            duration === 0 && 'animal-progress-fill-no-transition'
                        )}
                        style={inlineFillStyle}
                    />
                </div>
                {showInfo && (
                    <div className="animal-progress-info animal-progress-info-right">{renderedInfo}</div>
                )}
            </div>
        </div>
    );
};

Progress.displayName = 'Progress';
