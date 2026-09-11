import React from 'react';
import { cn } from '../../utils/cn';

export type BackgroundType =
    | 'default'
    | 'grid'
    | 'dots-dark-green'
    | 'sprinkles'
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

export interface BackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
    /** Background pattern type (dots-* base colors match Card pattern-* palette). Defaults to cream polka dots. */
    type?: BackgroundType;
    children?: React.ReactNode;
}

export const Background: React.FC<BackgroundProps> = ({ type = 'default', className, children, ...rest }) => (
    <div
        className={cn('animal-background', type !== 'default' && `animal-background-${type}`, className)}
        {...rest}
    >
        {children}
    </div>
);

Background.displayName = 'Background';
