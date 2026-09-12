import React, { useEffect, useRef, useState } from 'react';
import { cn } from '../../utils/cn';
import { Icon, ICON_LIST } from '../Icon';
import type { IconName } from '../Icon';

export interface FooterProps {
    /** Icon size in px (default 24) */
    size?: number;
    /** Use a single icon name; omit to cycle through all 101 icons */
    name?: IconName;
    /** Custom class */
    className?: string;
    /** Custom style */
    style?: React.CSSProperties;
}

const FULL_NAMES: IconName[] = ICON_LIST.map((item) => item.name);

export const Footer: React.FC<FooterProps> = ({ size = 24, name, className, style }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [cycles, setCycles] = useState(1);
    const iconNames = name ? [name] : FULL_NAMES;
    const cycleWidth = iconNames.length * size;

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const update = () => {
            setCycles(Math.max(1, Math.ceil(el.clientWidth / cycleWidth) + 1));
        };
        update();
        if (typeof ResizeObserver !== 'undefined') {
            const ro = new ResizeObserver(update);
            ro.observe(el);
            return () => ro.disconnect();
        }
        return undefined;
    }, [cycleWidth]);

    return (
        <div ref={ref} className={cn('animal-footer', className)} style={style}>
            {Array.from({ length: cycles }).map((_, c) => (
                <div key={c} className="animal-footer-cycle" {...(c > 0 ? { 'aria-hidden': true } : {})}>
                    {iconNames.map((iconName) => (
                        <Icon key={iconName} name={iconName} size={size} />
                    ))}
                </div>
            ))}
        </div>
    );
};

Footer.displayName = 'Footer';
