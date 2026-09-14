import React, { useEffect, useRef, useState } from 'react';
import { Icon } from '../Icon';
import type { IconName } from '../Icon';
import { cn } from '../../utils/cn';

export type DividerType = 'dashed-brown' | 'thin' | 'hairline' | 'wave-yellow' | 'squiggle';

export type DividerIconName = IconName;

export interface DividerProps {
    /** 分隔线类型（与 icon 二选一，icon 优先） */
    type?: DividerType;
    /** 单图标相连分割线图标名 */
    icon?: DividerIconName;
    /** 图标大小（px），默认 24 */
    iconSize?: number;
    /** 图标间距（px），默认 8 */
    iconGap?: number;
    className?: string;
    style?: React.CSSProperties;
}

const TYPE_CLASS: Record<DividerType, string> = {
    'dashed-brown': 'animal-divider',
    thin: 'animal-divider animal-divider-thin',
    hairline: 'animal-divider animal-divider-hairline',
    'wave-yellow': 'animal-divider animal-divider-wave-yellow',
    squiggle: 'animal-divider animal-divider-squiggle',
};

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

    return <div className={cn(TYPE_CLASS[type], className)} style={style} />;
};

Divider.displayName = 'Divider';
