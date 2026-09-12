import React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../utils/cn';

export type BackgroundType =
    | 'default'
    | 'grid'
    | 'dots'
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

const backgroundVariants = cva('animal-background', {
    variants: {
        type: {
            'default': '',
            'grid': 'animal-background--grid',
            'dots': 'animal-background--dots',
            'dots-dark-green': 'animal-background--dots-dark-green',
            'sprinkles': 'animal-background--sprinkles',
            'dots-pink': 'animal-background--dots-pink',
            'dots-purple': 'animal-background--dots-purple',
            'dots-blue': 'animal-background--dots-blue',
            'dots-yellow': 'animal-background--dots-yellow',
            'dots-orange': 'animal-background--dots-orange',
            'dots-teal': 'animal-background--dots-teal',
            'dots-green': 'animal-background--dots-green',
            'dots-red': 'animal-background--dots-red',
            'dots-lime-green': 'animal-background--dots-lime-green',
            'dots-yellow-green': 'animal-background--dots-yellow-green',
            'dots-brown': 'animal-background--dots-brown',
            'dots-warm-peach-pink': 'animal-background--dots-warm-peach-pink',
        },
    },
    defaultVariants: { type: 'default' },
});

export interface BackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
    /** Background pattern type. Default: cream polka dots. */
    type?: BackgroundType;
    children?: React.ReactNode;
}

export const Background: React.FC<BackgroundProps> = ({ type = 'default', className, children, ...rest }) => (
    <div
        className={cn(backgroundVariants({ type }), className)}
        {...rest}
    >
        {children}
    </div>
);

Background.displayName = 'Background';
