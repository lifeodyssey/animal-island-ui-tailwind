import React from 'react';
import { cn } from '../../utils/cn';

export interface FooterProps {
    /** 版权文案，默认 `All Rights Reserved.` */
    text?: string;
    /** 年份，默认取当前年份 */
    year?: number;
    /** 自定义类名 */
    className?: string;
    /** 自定义样式 */
    style?: React.CSSProperties;
}

export const Footer: React.FC<FooterProps> = ({
    text = 'All Rights Reserved.',
    year,
    className,
    style,
}) => {
    const displayYear = year ?? new Date().getFullYear();
    return (
        <footer className={cn('animal-footer', className)} style={style}>
            © {displayYear} {text}
        </footer>
    );
};

Footer.displayName = 'Footer';
