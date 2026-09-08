import React from 'react';
import { cn } from '../../utils/cn';

export type CursorType = 'default' | 'raindrop';

export interface CursorProps extends React.HTMLAttributes<HTMLDivElement> {
    /** 子元素 */
    children?: React.ReactNode;
    /**
     * 光标风格，默认 `'default'`。
     * - `default`：手指箭头
     * - `raindrop`：蓝色雨滴
     */
    type?: CursorType;
    /**
     * 是否对所有后代元素强制覆盖光标。默认 `true`。
     * - `true`：所有后代统一使用自定义光标。
     * - `false`：仅容器使用自定义光标，交互元素保留语义光标。
     */
    forceAll?: boolean;
}

export const Cursor = React.forwardRef<HTMLDivElement, CursorProps>(
    ({ type = 'default', children, className, style, forceAll = true, ...rest }, ref) => (
        <div
            ref={ref}
            className={cn(
                'animal-cursor',
                !forceAll && 'animal-cursor--scoped',
                type === 'raindrop' && 'animal-cursor--raindrop',
                className
            )}
            style={style}
            {...rest}
        >
            {children}
        </div>
    )
);

Cursor.displayName = 'Cursor';
