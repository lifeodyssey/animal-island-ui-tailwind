import React from 'react';
import { cn } from '../../utils/cn';
import type { ProgressProps } from './types';

export const Progress: React.FC<ProgressProps> = ({
    percent = 0,
    size = 'middle',
    showInfo = true,
    infoPosition = 'right',
    strokeColor,
    format,
    noTransition = false,
    className,
    style,
}) => {
    const clamped = Math.min(100, Math.max(0, percent));
    const infoText = format ? format(clamped) : `${clamped}%`;

    const trackClass = cn(
        'animal-progress-track',
        size === 'small' && 'animal-progress-track-small',
        size === 'middle' && 'animal-progress-track-middle',
        size === 'large' && 'animal-progress-track-large'
    );

    const fillClass = cn(
        'animal-progress-fill',
        noTransition && 'animal-progress-fill-no-transition'
    );

    const fillStyle: React.CSSProperties = {
        width: `${clamped}%`,
        ...(strokeColor ? { background: strokeColor, backgroundImage: 'none' } : {}),
    };

    const infoNode = showInfo ? (
        <span className={cn(
            'animal-progress-info',
            infoPosition === 'right' && 'animal-progress-info-right',
            infoPosition === 'top' && 'animal-progress-info-top'
        )}>
            {infoText}
        </span>
    ) : null;

    const track = (
        <div className={trackClass}>
            <div className={fillClass} style={fillStyle}>
                {showInfo && infoPosition === 'inside' && (
                    <span className="animal-progress-info-inside">{infoText}</span>
                )}
            </div>
        </div>
    );

    let bodyContent: React.ReactNode;

    if (infoPosition === 'top' && showInfo) {
        bodyContent = (
            <div className={cn('animal-progress-body', 'animal-progress-body-no-gap')}>
                {infoNode}
                <div className="animal-progress-row">{track}</div>
            </div>
        );
    } else {
        bodyContent = (
            <div className="animal-progress-body">
                <div className="animal-progress-row">
                    {track}
                    {infoPosition === 'right' && infoNode}
                </div>
            </div>
        );
    }

    return (
        <div className={cn('animal-progress', className)} style={style}>
            {bodyContent}
        </div>
    );
};

Progress.displayName = 'Progress';
