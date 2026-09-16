import React from 'react';
import { cn } from '../../utils/cn';

export interface FooterProps {
    /** Copyright text. Defaults to 'All Rights Reserved.' */
    text?: string;
    /** Year. Defaults to current year. */
    year?: number;
    /** Custom class name */
    className?: string;
    /** Custom style */
    style?: React.CSSProperties;
    // Legacy props kept for backward compatibility (no longer render anything)
    /** @deprecated No longer used. */
    type?: string;
    /** @deprecated No longer used. */
    seamless?: boolean;
}

export const Footer = React.forwardRef<HTMLElement, FooterProps>(
    ({ text = 'All Rights Reserved.', year, className, style, type: _type, seamless: _seamless, ...rest }, ref) => {
        const displayYear = year ?? new Date().getFullYear();
        return (
            <footer
                ref={ref}
                className={cn('animal-footer', className)}
                style={style}
                {...rest}
            >
                © {displayYear} {text}
            </footer>
        );
    }
);

Footer.displayName = 'Footer';
