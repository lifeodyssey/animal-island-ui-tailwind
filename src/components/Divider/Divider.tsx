import React, { useEffect, useRef, useState } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../utils/cn';
import { Icon } from '../Icon';
import type { IconName } from '../Icon';

export type DividerType = 'dashed-brown' | 'thin' | 'hairline' | 'wave-yellow' | 'squiggle';

export type DividerIconName = IconName;

const dividerVariants = cva('animal-divider', {
    variants: {
        type: {
            'dashed-brown': '',
            thin: 'animal-divider-thin',
            hairline: 'animal-divider-hairline',
            'wave-yellow': 'animal-divider-wave-yellow',
            squiggle: 'animal-divider-squiggle',
        },
    },
    defaultVariants: { type: 'dashed-brown' },
});

export interface DividerProps {
    /** Divider type (mutually exclusive with icon; icon takes precedence) */
    type?: DividerType;
    /** Single icon name; when passed renders an icon-chain divider tiling the row */
    icon?: DividerIconName;
    /** Icon size in px, defaults to 24 */
    iconSize?: number;
    /** Gap between icons in px (connector line length), defaults to 8 */
    iconGap?: number;
    /** Extra class name */
    className?: string;
    /** Inline style */
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
    const [cycles, setCycles] = useState(1);
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
            <div ref={ref} className={cn('animal-divider-icon', className)} style={style} aria-hidden="true">
                {Array.from({ length: cycles }).map((_, c) => (
                    <div key={c} className="animal-divider-icon-cycle" {...(c > 0 ? { 'aria-hidden': true } : {})}>
                        <Icon name={icon} size={iconSize} />
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
            className={cn(dividerVariants({ type }), className)}
            style={style}
            role="separator"
            aria-orientation="horizontal"
        />
    );
};

Divider.displayName = 'Divider';
