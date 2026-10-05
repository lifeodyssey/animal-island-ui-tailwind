import React from 'react';
import { cva } from 'class-variance-authority';
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
    /** 展示的内容：数字 / 字符串，或任意 ReactNode（如 naive-icons 图标） */
    count?: React.ReactNode;
    /** 展示封顶的数字值，超过时显示为 `${overflowCount}+` */
    overflowCount?: number;
    /** 数值为 0 时是否展示 */
    showZero?: boolean;
    /** 不展示数字，只展示一个小圆点 */
    dot?: boolean;
    /** 尺寸，仅对数字角标生效（dot 尺寸固定） */
    size?: BadgeSize;
    /** 颜色，与 Card / Tag 调色板一致 */
    color?: BadgeColor;
    /** 徽标包裹的元素；不传即为独立使用 */
    children?: React.ReactNode;
}

const indicatorVariants = cva('animal-badge-indicator', {
    variants: {
        size: {
            medium: 'animal-badge-size-medium',
            small: 'animal-badge-size-small',
        },
        color: {
            'app-red': 'animal-badge-color-app-red',
            'app-pink': 'animal-badge-color-app-pink',
            'app-orange': 'animal-badge-color-app-orange',
            'app-yellow': 'animal-badge-color-app-yellow',
            'app-teal': 'animal-badge-color-app-teal',
            'app-green': 'animal-badge-color-app-green',
            'app-blue': 'animal-badge-color-app-blue',
            purple: 'animal-badge-color-purple',
            'lime-green': 'animal-badge-color-lime-green',
            'yellow-green': 'animal-badge-color-yellow-green',
            brown: 'animal-badge-color-brown',
            'warm-peach-pink': 'animal-badge-color-warm-peach-pink',
        },
    },
    defaultVariants: { size: 'medium', color: 'app-red' },
});

/** 纯数字或纯数字字符串才参与封顶换算，ReactNode 内容原样展示 */
const toNumeric = (value: React.ReactNode): number | null => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string' && value.trim() !== '' && !Number.isNaN(Number(value))) return Number(value);
    return null;
};

/** 全角 / CJK 字符在正圆里会顶破圆直径 */
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
        indicatorVariants({ size, color }),
        fitsCircle(displayCount) && 'animal-badge-circle',
        showAsDot && 'animal-badge-dot'
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
