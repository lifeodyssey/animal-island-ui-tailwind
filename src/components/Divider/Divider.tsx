import React, { useEffect, useRef, useState } from 'react';
import { cn } from '../../utils/cn';

export type DividerType =
    | 'dashed-brown'
    | 'thin'
    | 'hairline'
    | 'wave-yellow'
    | 'squiggle'
    // Legacy types — kept for backward compat, deprecated
    | 'line-brown'
    | 'line-teal'
    | 'line-white'
    | 'line-yellow'
    | 'dashed-teal'
    | 'dashed-white'
    | 'dashed-yellow';

export interface DividerProps {
    /** Divider type (type and icon are mutually exclusive; icon takes priority) */
    type?: DividerType;
    /** Pass any React element (e.g. `<FishIcon size={24} />`); renders an icon-chain divider filling the full row */
    icon?: React.ReactNode;
    /** Icon size in px (default 24) */
    iconSize?: number;
    /** Gap between icons in px (default 8) */
    iconGap?: number;
    /** Custom class name */
    className?: string;
    /** Custom style */
    style?: React.CSSProperties;
}

export const Divider: React.FC<DividerProps> = ({
    type = 'dashed-brown',
    icon,
    iconSize = 24,
    iconGap = 8,
    className,
    style,
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const [cycles, setCycles] = useState<number>(1);
    const cycleWidth = iconSize + iconGap;

    useEffect(() => {
        if (!icon) return undefined;
        const el = ref.current;
        if (!el) return undefined;
        const update = () => {
            setCycles(Math.max(1, Math.floor(el.clientWidth / cycleWidth)));
        };
        update();
        if (typeof ResizeObserver !== 'undefined') {
            const ro = new ResizeObserver(update);
            ro.observe(el);
            return () => ro.disconnect();
        }
        return undefined;
    }, [icon, cycleWidth]);

    if (icon) {
        return (
            <div
                ref={ref}
                className={cn('animal-divider-icon', className)}
                style={style}
                aria-hidden="true"
            >
                {Array.from({ length: cycles }).map((_, c) => (
                    <div key={c} className="animal-divider-icon-cycle" {...(c > 0 ? { 'aria-hidden': true } : {})}>
                        {icon}
                        {c < cycles - 1 && (
                            <span className="animal-divider-icon-gap" style={{ width: iconGap }}>
                                <span className="animal-divider-icon-line" />
                            </span>
                        )}
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div
            role="separator"
            className={cn('animal-divider', `animal-divider-${type}`, className)}
            style={style}
        />
    );
};

Divider.displayName = 'Divider';
