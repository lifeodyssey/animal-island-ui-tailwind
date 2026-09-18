import React from 'react';
import { cn } from '../../utils/cn';

export interface FooterProps extends Omit<React.ComponentPropsWithoutRef<'footer'>, 'children'> {
    /** 版权文案，默认 `All Rights Reserved.` */
    text?: string;
    /** 年份，默认取当前年份 */
    year?: number;
}

export const Footer = React.forwardRef<HTMLElement, FooterProps>(
    ({ text = 'All Rights Reserved.', year, className, ...rest }, ref) => {
        const displayYear = year ?? new Date().getFullYear();
        return (
            <footer {...rest} ref={ref} className={cn('animal-footer', className)}>
                © {displayYear} {text}
            </footer>
        );
    }
);

Footer.displayName = 'Footer';
