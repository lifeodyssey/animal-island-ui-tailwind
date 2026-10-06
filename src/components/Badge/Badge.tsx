import React from 'react';
import { cn } from '../../utils/cn';

export type BadgeSize = 'small' | 'medium';

export type BadgeColor =
    | 'app-red'
    | 'app-pink'
    | 'app-orange'
    | 'app-yellow'
    | 'app-teal'
    | 'app-green'
    | 'app-blue'
    | 'purple'
    | 'lime-green'
    | 'yellow-green'
    | 'brown'
    | 'warm-peach-pink';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    count?: React.ReactNode;
    overflowCount?: number;
    showZero?: boolean;
    dot?: boolean;
    size?: BadgeSize;
    color?: BadgeColor;
    children?: React.ReactNode;
}

const toNumeric = (value: React.ReactNode): number | null => {
    if (typeof value === 'number') return value;
    return null;
};

const FULLWIDTH = /[⺀-鿿豈-﫿＀-￯]/;
const CIRCLE_MAX_LENGTH = 2;

const fitsCircle = (value: React.ReactNode): boolean => {
    const text = typeof value === 'number' ? String(value) : typeof value === 'string' ? value.trim() : null;
    if (text === null || text.length === 0 || text.length > CIRCLE_MAX_LENGTH) return false;
    return !(text.length === CIRCLE_MAX_LENGTH && FULLWIDTH.test(text));
};

export const Badge: React.FC<BadgeProps> = ({
    count = null,
    overflowCount = 99,
    showZero = false,
    dot = false,
    size = 'medium',
    color = 'app-red',
    className,
    children,
    title,
    ...rest
}) => {
    const numeric = toNumeric(count);
    const displayCount = numeric !== null && numeric > overflowCount ? `${overflowCount}+` : count;
    const isZero = displayCount === 0 || displayCount === '0';
    const showAsDot = dot && !isZero;
    const isEmpty = count === null || count === undefined || (typeof count === 'string' && count.trim() === '');
    const isHidden = !showAsDot && (isEmpty || (isZero && !showZero));
    const isStandalone = children === undefined || children === null;

    const indicatorTitle =
        title ?? (!showAsDot && (typeof count === 'number' || typeof count === 'string') ? String(count) : undefined);

    const indicatorCls = cn(
        'animal-badge-indicator',
        `animal-badge-size-${size}`,
        fitsCircle(displayCount) && 'animal-badge-circle',
        showAsDot && 'animal-badge-dot',
        `animal-badge-color-${color}`,
    );

    return (
        <span className={cn('animal-badge', isStandalone && 'animal-badge-standalone', className)} {...rest}>
            {children}
            {!isHidden && (
                <sup className={indicatorCls} title={indicatorTitle}>
                    {showAsDot ? null : displayCount}
                </sup>
            )}
        </span>
    );
};

Badge.displayName = 'Badge';
