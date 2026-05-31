import React from 'react';
import { cn } from '../../utils/cn';

export interface CursorProps extends React.HTMLAttributes<HTMLDivElement> {
    /** 子元素 */
    children?: React.ReactNode;
    /**
     * 是否对所有后代元素强制覆盖光标。默认 `true`。
     * - `true`：所有后代统一使用自定义光标。
     * - `false`：仅容器使用自定义光标，交互元素保留语义光标。
     */
    forceAll?: boolean;
}

export const Cursor = React.forwardRef<HTMLDivElement, CursorProps>(
    ({ children, className, style, forceAll = true, ...rest }, ref) => (
        <div
            ref={ref}
            className={cn(
                'animal-cursor',
                !forceAll && 'animal-cursor--scoped',
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
