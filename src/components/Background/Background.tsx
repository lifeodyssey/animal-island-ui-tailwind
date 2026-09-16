import React from 'react';
import { cn } from '../../utils/cn';
import sweetCorner from '../../assets/image/sweet-corner.svg';
import coffeeBreak from '../../assets/image/coffee-break.svg';

export type BackgroundType =
    | 'default'
    | 'grid'
    | 'dots-dark-green'
    | 'sprinkles'
    | 'sweet-corner'
    | 'coffee-break'
    | 'dots-pink'
    | 'dots-purple'
    | 'dots-blue'
    | 'dots-yellow'
    | 'dots-orange'
    | 'dots-teal'
    | 'dots-green'
    | 'dots-red'
    | 'dots-lime-green'
    | 'dots-yellow-green'
    | 'dots-brown'
    | 'dots-warm-peach-pink'
    // Legacy aliases kept for backward compat
    | 'dots'
    | 'dots-default';

const BG_IMAGE: Partial<Record<BackgroundType, string>> = {
    'sweet-corner': sweetCorner,
    'coffee-break': coffeeBreak,
};

export interface BackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
    /** Background pattern type. 'default' = cream polka-dots. 'sprinkles' = candy sprinkles. */
    type?: BackgroundType;
    children?: React.ReactNode;
}

export const Background: React.FC<BackgroundProps> = ({ type = 'default', className, children, style, ...rest }) => {
    // Legacy name normalisation
    const normalizedType: BackgroundType = type === 'dots' ? 'default' : type === 'dots-default' ? 'default' : type;
    const cls = cn(
        'animal-background',
        normalizedType !== 'default' && `animal-background--${normalizedType}`,
        className
    );
    const bgImage = BG_IMAGE[normalizedType];
    return (
        <div
            className={cls}
            style={{ ...(bgImage ? { backgroundImage: `url(${bgImage})` } : null), ...style }}
            {...rest}
        >
            {children}
        </div>
    );
};

Background.displayName = 'Background';
