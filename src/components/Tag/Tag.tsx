import React, { useCallback } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../utils/cn';

export type TagSize = 'small' | 'medium' | 'large';

export type TagVariant = 'solid' | 'outlined' | 'dashed';

export type TagColor =
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

export interface TagProps {
    children?: React.ReactNode;
    size?: TagSize;
    /** 风格变体：solid 填充、outlined 描边、dashed 虚线 */
    variant?: TagVariant;
    color?: TagColor;
    closable?: boolean;
    onClose?: (e: React.MouseEvent<HTMLElement>) => void;
    onClick?: (e: React.MouseEvent<HTMLElement>) => void;
    disabled?: boolean;
    className?: string;
    style?: React.CSSProperties;
}

const tagVariants = cva('animal-tag', {
    variants: {
        size: {
            small: 'animal-tag-small',
            medium: 'animal-tag-medium',
            large: 'animal-tag-large',
        },
        variant: {
            solid: 'animal-tag-solid',
            outlined: 'animal-tag-outlined',
            dashed: 'animal-tag-dashed',
        },
        color: {
            default: '',
            'app-pink': 'animal-tag-app-pink',
            purple: 'animal-tag-purple',
            'app-blue': 'animal-tag-app-blue',
            'app-yellow': 'animal-tag-app-yellow',
            'app-orange': 'animal-tag-app-orange',
            'app-teal': 'animal-tag-app-teal',
            'app-green': 'animal-tag-app-green',
            'app-red': 'animal-tag-app-red',
            'lime-green': 'animal-tag-lime-green',
            'yellow-green': 'animal-tag-yellow-green',
            brown: 'animal-tag-brown',
            'warm-peach-pink': 'animal-tag-warm-peach-pink',
        },
    },
    defaultVariants: { size: 'medium', variant: 'solid', color: 'default' },
});

// Color modifier for outlined/dashed variants needs the variant suffix.
// CVA emits the base color class; CSS rules use compound selectors for variant.
const colorVariantClass = (color: TagColor, variant: TagVariant): string => {
    if (color === 'default') return '';
    // Solid: use base color class (animal-tag-<color>); CSS handles bg/border/text.
    // Outlined/dashed: use compound class (animal-tag-<color>-outlined / -dashed).
    if (variant !== 'solid') return `animal-tag-${color}-${variant}`;
    return `animal-tag-${color}`;
};

export const Tag: React.FC<TagProps> = ({
    children,
    size = 'medium',
    variant = 'solid',
    color = 'default',
    closable = false,
    onClose,
    onClick,
    disabled = false,
    className,
    style,
}) => {
    const handleClose = useCallback(
        (e: React.MouseEvent<HTMLElement>) => {
            e.stopPropagation();
            if (disabled) return;
            onClose?.(e);
        },
        [disabled, onClose],
    );

    const handleClick = useCallback(
        (e: React.MouseEvent<HTMLElement>) => {
            if (disabled) return;
            onClick?.(e);
        },
        [disabled, onClick],
    );

    const isInteractive = !!onClick && !disabled;

    const cls = cn(
        tagVariants({ size, variant }),
        colorVariantClass(color, variant),
        disabled && 'animal-tag-disabled',
        isInteractive && 'animal-tag-clickable',
        className,
    );

    const TagBody = (
        <>
            <span className="animal-tag-text">{children}</span>
            {closable && (
                <button
                    type="button"
                    className="animal-tag-close"
                    aria-label="close"
                    onClick={handleClose}
                    disabled={disabled}
                >
                    ×
                </button>
            )}
        </>
    );

    if (isInteractive) {
        return (
            <span
                className={cls}
                style={style}
                onClick={handleClick}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleClick(e as unknown as React.MouseEvent<HTMLElement>);
                    }
                }}
            >
                {TagBody}
            </span>
        );
    }

    return (
        <span className={cls} style={style}>
            {TagBody}
        </span>
    );
};

Tag.displayName = 'Tag';
