import React from 'react';
import { cn } from '../../utils/cn';

export type FooterType = 'sea' | 'tree';

export interface FooterProps extends React.HTMLAttributes<HTMLDivElement> {
    /** Footer 类型 */
    type?: FooterType;
    /** 无缝拼接 */
    seamless?: boolean;
}

export const Footer = React.forwardRef<HTMLDivElement, FooterProps>(
    ({ type = 'tree', seamless = false, className, style, ...rest }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    'animal-footer',
                    type === 'tree' && 'animal-footer-tree',
                    seamless && 'animal-footer-seamless',
                    className,
                )}
                style={style}
                {...rest}
            />
        );
    }
);

Footer.displayName = 'Footer';
