import React from 'react';
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
    | 'dashed-yellow';

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
    /** 分隔线类型 */
    type?: DividerType;
}

export const Divider = React.forwardRef<HTMLDivElement, DividerProps>(
    ({ type = 'line-brown', className, style, ...rest }, ref) => {
        return (
            <div
                ref={ref}
                role="separator"
                className={cn('animal-divider', type !== 'line-brown' && `animal-divider-${type}`, className)}
                style={style}
                {...rest}
            />
        );
    }
);

Divider.displayName = 'Divider';
