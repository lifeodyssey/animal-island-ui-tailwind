import React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../utils/cn';

export type TitleSize = 'small' | 'middle' | 'large';

export type TitleColor =
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

export type TitleVariant = 'ribbon' | 'layer' | 'tab';

export interface TitleProps {
    /** 标题内容 */
    children: React.ReactNode;
    /** 尺寸 */
    size?: TitleSize;
    /** 配色，与 Card 同名色板 */
    color?: TitleColor;
    /** 标题样式：layer 双层纸（默认）/ ribbon 飘带 / tab 折角便签 */
    variant?: TitleVariant;
    /** 自定义类名 */
    className?: string;
    /** 自定义样式 */
    style?: React.CSSProperties;
}

const SIZE_MAP: Record<TitleSize, number> = {
    small: 14,
    middle: 20,
    large: 28,
};

const colorVariants = {
    default: '',
    'app-pink': 'animal-title-app-pink',
    purple: 'animal-title-purple',
    'app-blue': 'animal-title-app-blue',
    'app-yellow': 'animal-title-app-yellow',
    'app-orange': 'animal-title-app-orange',
    'app-teal': 'animal-title-app-teal',
    'app-green': 'animal-title-app-green',
    'app-red': 'animal-title-app-red',
    'lime-green': 'animal-title-lime-green',
    'yellow-green': 'animal-title-yellow-green',
    brown: 'animal-title-brown',
    'warm-peach-pink': 'animal-title-warm-peach-pink',
};

const ribbonVariants = cva('animal-title-ribbon', {
    variants: { color: colorVariants },
    defaultVariants: { color: 'default' },
});

const layerVariants = cva('animal-title-layer', {
    variants: { color: colorVariants },
    defaultVariants: { color: 'default' },
});

const tabVariants = cva('animal-title-tab', {
    variants: { color: colorVariants },
    defaultVariants: { color: 'default' },
});

const Ribbon: React.FC<{ children: React.ReactNode; fontSize: number; color: TitleColor }> = ({
    children,
    fontSize,
    color,
}) => (
    <span
        className={cn(ribbonVariants({ color }))}
        style={{ fontSize: `${fontSize}px` }}
    >
        <span className="animal-title-ribbon-back animal-title-ribbon-back-left" aria-hidden />
        <span className="animal-title-ribbon-back animal-title-ribbon-back-right" aria-hidden />
        <span className="animal-title-ribbon-fold animal-title-ribbon-fold-left" aria-hidden />
        <span className="animal-title-ribbon-fold animal-title-ribbon-fold-right" aria-hidden />
        <span className="animal-title-ribbon-front" aria-hidden />
        <span className="animal-title-ribbon-text">{children}</span>
    </span>
);

const Layer: React.FC<{ children: React.ReactNode; fontSize: number; color: TitleColor }> = ({
    children,
    fontSize,
    color,
}) => (
    <span
        className={cn(layerVariants({ color }))}
        style={{ fontSize: `${fontSize}px` }}
    >
        <span className="animal-title-layer-front">{children}</span>
    </span>
);

const Tab: React.FC<{ children: React.ReactNode; fontSize: number; color: TitleColor }> = ({
    children,
    fontSize,
    color,
}) => (
    <span
        className={cn(tabVariants({ color }))}
        style={{ fontSize: `${fontSize}px` }}
    >
        <span className="animal-title-tab-text">{children}</span>
    </span>
);

const VARIANT_MAP: Record<
    TitleVariant,
    React.FC<{ children: React.ReactNode; fontSize: number; color: TitleColor }>
> = {
    ribbon: Ribbon,
    layer: Layer,
    tab: Tab,
};

export const Title: React.FC<TitleProps> = ({
    children,
    size = 'middle',
    color = 'default',
    variant = 'layer',
    className,
    style,
}) => {
    const Body = VARIANT_MAP[variant];
    return (
        <span className={cn('animal-title', className)} style={style}>
            <Body fontSize={SIZE_MAP[size]} color={color}>
                {children}
            </Body>
        </span>
    );
};

Title.displayName = 'Title';
