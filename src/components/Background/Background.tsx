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
    | 'dots-warm-peach-pink';

const BG_IMAGE: Partial<Record<BackgroundType, string>> = {
    'sweet-corner': sweetCorner,
    'coffee-break': coffeeBreak,
};

export interface BackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
    /** 背景图案类型（dots-* 底色与 Card pattern-* 系列一致），默认奶油色波点 */
    type?: BackgroundType;
    children?: React.ReactNode;
}

export const Background: React.FC<BackgroundProps> = ({ type = 'default', className, children, style, ...rest }) => {
    const bgImage = BG_IMAGE[type];
    return (
        <div
            className={cn('animal-background', `animal-background--${type}`, className)}
            style={{ ...(bgImage ? { backgroundImage: `url(${bgImage})` } : null), ...style }}
            {...rest}
        >
            {children}
        </div>
    );
};

Background.displayName = 'Background';
