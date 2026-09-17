import React, { useEffect, useRef, useState } from 'react';
import * as Separator from '@radix-ui/react-separator';
import { cva } from 'class-variance-authority';
import { cn } from '../../utils/cn';

export type DividerType =
    | 'line-brown'
    | 'line-teal'
    | 'line-white'
    | 'line-yellow'
    | 'wave-yellow'
    | 'dashed-brown'
    | 'dashed-teal'
    | 'dashed-white'
    | 'dashed-yellow'
    | 'thin'
    | 'hairline'
    | 'squiggle';

// Variant → stable animal-* class literal. line-brown is the default (no modifier class).
const dividerVariants = cva('animal-divider', {
    variants: {
        type: {
            'line-brown': '',
            'line-teal': 'animal-divider-line-teal',
            'line-white': 'animal-divider-line-white',
            'line-yellow': 'animal-divider-line-yellow',
            'wave-yellow': 'animal-divider-wave-yellow',
            'dashed-brown': 'animal-divider-dashed-brown',
            'dashed-teal': 'animal-divider-dashed-teal',
            'dashed-white': 'animal-divider-dashed-white',
            'dashed-yellow': 'animal-divider-dashed-yellow',
            'thin': 'animal-divider-thin',
            'hairline': 'animal-divider-hairline',
            'squiggle': 'animal-divider-squiggle',
        },
    },
    defaultVariants: { type: 'line-brown' },
});

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
    /** 分隔线类型（type 与 icon 二选一，icon 优先） */
    type?: DividerType;
    /** 图标元素；传入时渲染「图标 + 连接线」循环相连的装饰分割线，铺满整行 */
    icon?: React.ReactNode;
    /** 图标大小 (px)，默认 24 */
    iconSize?: number;
    /** 相邻图标之间的连接线长度 (px)，默认 8 */
    iconGap?: number;
}

export const Divider = React.forwardRef<HTMLDivElement, DividerProps>(
    ({ type = 'line-brown', icon, iconSize = 24, iconGap = 8, className, ...rest }, ref) => {
        const containerRef = useRef<HTMLDivElement | null>(null);
        const [cycles, setCycles] = useState(1);
        const cycleWidth = iconSize + iconGap;

        const setRefs = React.useCallback(
            (el: HTMLDivElement | null) => {
                containerRef.current = el;
                if (typeof ref === 'function') {
                    ref(el);
                } else if (ref) {
                    ref.current = el;
                }
            },
            [ref]
        );

        useEffect(() => {
            if (!icon) return undefined;
            const el = containerRef.current;
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
                    ref={setRefs}
                    className={cn('animal-divider-icon-strip', className)}
                    aria-hidden="true"
                    {...rest}
                >
                    {Array.from({ length: cycles }).map((_, c) => (
                        <div
                            key={c}
                            className="animal-divider-icon-cycle"
                            {...(c > 0 ? { 'aria-hidden': true } : {})}
                        >
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
            <Separator.Root
                ref={ref}
                decorative={false}
                className={cn(dividerVariants({ type }), className)}
                {...rest}
            />
        );
    }
);

Divider.displayName = 'Divider';
