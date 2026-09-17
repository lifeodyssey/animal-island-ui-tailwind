import React from 'react';
import { cn } from '../../utils/cn';

export interface FooterProps {
    /** 版权文案，默认 `All Rights Reserved.` */
    text?: string;
    /** 年份，默认取当前年份 */
    year?: number;
    className?: string;
    style?: React.CSSProperties;
}

export const Footer = React.forwardRef<HTMLElement, FooterProps>(
    ({ text = 'All Rights Reserved.', year, className, style }, ref) => {
        const displayYear = year ?? new Date().getFullYear();
        return (
            <footer ref={ref} className={cn('animal-footer', className)} style={style}>
                © {displayYear} {text}
            </footer>
        );
    }
);

Footer.displayName = 'Footer';
