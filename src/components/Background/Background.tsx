import React from 'react';
import { cn } from '../../utils/cn';

export type BackgroundType = 'dots' | 'sprinkles';

export interface BackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
    /** Pattern type: dots (polka dots) / sprinkles (coloured candy sprinkles) */
    type?: BackgroundType;
    children?: React.ReactNode;
}

export const Background: React.FC<BackgroundProps> = ({ type = 'dots', className, children, ...rest }) => (
    <div
        className={cn(
            'animal-background',
            type === 'sprinkles' && 'animal-background--sprinkles',
            className
        )}
        {...rest}
    >
        {children}
    </div>
);

Background.displayName = 'Background';
