import React from 'react';
import * as Separator from '@radix-ui/react-separator';
import { cva } from 'class-variance-authority';
import { cn } from '../../utils/cn';

export type DividerType =
    | 'dashed-brown'
    | 'dashed-teal'
    | 'dashed-white'
    | 'dashed-yellow';

const dividerVariants = cva('animal-divider', {
    variants: {
        type: {
            'dashed-brown': '',
            'dashed-teal': 'animal-divider-dashed-teal',
            'dashed-white': 'animal-divider-dashed-white',
            'dashed-yellow': 'animal-divider-dashed-yellow',
        },
    },
    defaultVariants: { type: 'dashed-brown' },
});

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
    /** 分隔线类型 */
    type?: DividerType;
}

export const Divider = React.forwardRef<HTMLDivElement, DividerProps>(
    ({ type = 'dashed-brown', className, ...rest }, ref) => {
        return (
            <Separator.Root
                ref={ref}
                decorative={false}
                className={cn(dividerVariants({ type }), className)}
                {...rest}
            />
        );
    }
);

Divider.displayName = 'Divider';
