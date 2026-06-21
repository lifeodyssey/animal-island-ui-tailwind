import React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../utils/cn';

export type CardType = 'default' | 'title' | 'dashed';

export type CardColor =
    | 'default'
    | 'app-pink'
    | 'purple'
    | 'app-blue'
    | 'app-yellow'
    | 'app-orange'
    | 'app-teal'
    | 'app-green'
    | 'app-red'
    | 'lime-green'
    | 'yellow-green'
    | 'brown'
    | 'warm-peach-pink';

/** 背景花纹类型（圆点纹理底，与 color 纯色背景正交，可叠加使用）。 */
export type CardPattern =
    | 'none'
    | 'default'
    | 'app-pink'
    | 'purple'
    | 'app-blue'
    | 'app-yellow'
    | 'app-orange'
    | 'app-teal'
    | 'app-green'
    | 'app-red'
    | 'lime-green'
    | 'yellow-green'
    | 'brown'
    | 'warm-peach-pink';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    /** 卡片类型。`title` 为兼容保留（上游已移除），新代码请用 Title 组件。 */
    type?: CardType;
    /** 背景颜色类型 */
    color?: CardColor;
    /** 背景花纹类型 */
    pattern?: CardPattern;
    /** 自定义内容 */
    children?: React.ReactNode;
}

// Byte-identical class output (order: animal-card → type → color → pattern).
// pattern is orthogonal to color; each non-none value emits the shared base class
// plus its variant (matching the previous `animal-card-pattern animal-card-pattern-${p}`).
const cardVariants = cva('animal-card', {
    variants: {
        type: { default: '', title: 'animal-card-title', dashed: 'animal-card-dashed' },
        color: {
            default: '',
            'app-pink': 'animal-card-app-pink',
            purple: 'animal-card-purple',
            'app-blue': 'animal-card-app-blue',
            'app-yellow': 'animal-card-app-yellow',
            'app-orange': 'animal-card-app-orange',
            'app-teal': 'animal-card-app-teal',
            'app-green': 'animal-card-app-green',
            'app-red': 'animal-card-app-red',
            'lime-green': 'animal-card-lime-green',
            'yellow-green': 'animal-card-yellow-green',
            brown: 'animal-card-brown',
            'warm-peach-pink': 'animal-card-warm-peach-pink',
        },
        pattern: {
            none: '',
            default: 'animal-card-pattern animal-card-pattern-default',
            'app-pink': 'animal-card-pattern animal-card-pattern-app-pink',
            purple: 'animal-card-pattern animal-card-pattern-purple',
            'app-blue': 'animal-card-pattern animal-card-pattern-app-blue',
            'app-yellow': 'animal-card-pattern animal-card-pattern-app-yellow',
            'app-orange': 'animal-card-pattern animal-card-pattern-app-orange',
            'app-teal': 'animal-card-pattern animal-card-pattern-app-teal',
            'app-green': 'animal-card-pattern animal-card-pattern-app-green',
            'app-red': 'animal-card-pattern animal-card-pattern-app-red',
            'lime-green': 'animal-card-pattern animal-card-pattern-lime-green',
            'yellow-green': 'animal-card-pattern animal-card-pattern-yellow-green',
            brown: 'animal-card-pattern animal-card-pattern-brown',
            'warm-peach-pink': 'animal-card-pattern animal-card-pattern-warm-peach-pink',
        },
    },
    defaultVariants: { type: 'default', color: 'default', pattern: 'none' },
});

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
    (
        {
            type = 'default',
            color = 'default',
            pattern = 'none',
            children,
            className,
            style,
            ...rest
        },
        ref
    ) => {
        return (
            <div
                ref={ref}
                className={cn(cardVariants({ type, color, pattern }), className)}
                style={style}
                {...rest}
            >
                {children}
            </div>
        );
    }
);

Card.displayName = 'Card';
