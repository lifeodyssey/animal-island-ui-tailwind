import React from 'react';
import * as Separator from '@radix-ui/react-separator';
import { cva } from 'class-variance-authority';
import { cn } from '../../utils/cn';

export type DividerType =
    | 'line-brown'
    | 'line-teal'
    | 'line-white'
    | 'line-yellow'
    | 'wave-yellow'
    | 'dashed-brown'
    | 'dashed-teal'
    | 'dashed-white'
    | 'dashed-yellow';

// Variant → stable animal-* class literal (byte-identical to the previous lookup,
// so the rendered class list — and pixels — do not change). line-brown is the
// default and adds no modifier class.
const dividerVariants = cva('animal-divider', {
    variants: {
        type: {
            'line-brown': '',
            'line-teal': 'animal-divider-line-teal',
            'line-white': 'animal-divider-line-white',
            'line-yellow': 'animal-divider-line-yellow',
            'wave-yellow': 'animal-divider-wave-yellow',
            'dashed-brown': 'animal-divider-dashed-brown',
            'dashed-teal': 'animal-divider-dashed-teal',
            'dashed-white': 'animal-divider-dashed-white',
            'dashed-yellow': 'animal-divider-dashed-yellow',
        },
    },
    defaultVariants: { type: 'line-brown' },
});

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
    /** 分隔线类型 */
    type?: DividerType;
}

export const Divider = React.forwardRef<HTMLDivElement, DividerProps>(
    ({ type = 'line-brown', className, ...rest }, ref) => {
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
