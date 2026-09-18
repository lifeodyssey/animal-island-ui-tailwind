import React, { useEffect, useRef, useState } from 'react';
import { cn } from '../../utils/cn';

export type DividerType = 'dashed-brown' | 'thin' | 'hairline' | 'wave-yellow' | 'squiggle';

export interface DividerProps {
    /** 分隔线类型（type 与 icon 二选一，icon 优先） */
    type?: DividerType;
    /** 传入图标元素；传入时渲染「图标 + 连接线」循环相连的装饰分割线，铺满整行 */
    icon?: React.ReactNode;
    /** 图标大小（px），默认 24 */
    iconSize?: number;
    /** 图标间距（px），即相邻图标之间的连接线长度，默认 8 */
    iconGap?: number;
    /** 自定义类名 */
    className?: string;
    /** 自定义样式 */
    style?: React.CSSProperties;
}

const TYPE_CLASS: Record<DividerType, string> = {
    'dashed-brown': '',
    thin: 'animal-divider-thin',
    hairline: 'animal-divider-hairline',
    'wave-yellow': 'animal-divider-wave-yellow',
    squiggle: 'animal-divider-squiggle',
};

export const Divider = React.forwardRef<HTMLDivElement, DividerProps>(
    (
        {
            type = 'dashed-brown',
            icon,
            iconSize = 24,
            iconGap = 8,
            className,
            style,
        },
        ref
    ) => {
        const innerRef = useRef<HTMLDivElement>(null);
        const resolvedRef = (ref as React.RefObject<HTMLDivElement>) ?? innerRef;
        const [cycles, setCycles] = useState(1);
        const cycleWidth = iconSize + iconGap;

        useEffect(() => {
            if (!icon) return undefined;
            const el = resolvedRef.current;
            if (!el) return undefined;
            const update = () => setCycles(Math.max(1, Math.floor(el.clientWidth / cycleWidth)));
            update();
            if (typeof ResizeObserver !== 'undefined') {
                const ro = new ResizeObserver(update);
                ro.observe(el);
                return () => ro.disconnect();
            }
            return undefined;
        }, [icon, cycleWidth, resolvedRef]);

        if (icon) {
            return (
                <div
                    ref={resolvedRef}
                    className={cn('animal-divider-icon', className)}
                    style={style}
                    aria-hidden="true"
                >
                    {Array.from({ length: cycles }).map((_, c) => (
                        <div key={c} className="animal-divider-icon-cycle">
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
                ref={resolvedRef}
                className={cn('animal-divider', TYPE_CLASS[type], className)}
                style={style}
                role="separator"
            />
        );
    }
);

Divider.displayName = 'Divider';
