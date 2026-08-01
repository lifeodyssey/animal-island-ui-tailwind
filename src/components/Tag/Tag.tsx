import React, { useCallback } from 'react';
import { cn } from '../../utils/cn';

export type TagSize = 'small' | 'medium' | 'large';
export type TagVariant = 'solid' | 'outlined' | 'dashed' | 'soft';
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
    variant?: TagVariant;
    color?: TagColor;
    closable?: boolean;
    onClose?: (e: React.MouseEvent<HTMLElement>) => void;
    onClick?: (e: React.MouseEvent<HTMLElement>) => void;
    disabled?: boolean;
    className?: string;
    style?: React.CSSProperties;
}

const SIZE_CLASS: Record<TagSize, string> = {
    small: 'animal-tag-size-small',
    medium: 'animal-tag-size-medium',
    large: 'animal-tag-size-large',
};

const VARIANT_CLASS: Record<TagVariant, string> = {
    solid: 'animal-tag-variant-solid',
    outlined: 'animal-tag-variant-outlined',
    dashed: 'animal-tag-variant-dashed',
    soft: 'animal-tag-variant-soft',
};

const COLOR_CLASS = (color: TagColor, variant: TagVariant): string => {
    if (color === 'default') return '';
    if (variant === 'solid') return `animal-tag-color-${color}-solid`;
    return `animal-tag-color-${color}-${variant}`;
};

export const Tag: React.FC<TagProps> = ({
    children,
    size = 'medium',
    variant = 'soft',
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
        'animal-tag',
        SIZE_CLASS[size],
        VARIANT_CLASS[variant],
        COLOR_CLASS(color, variant),
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
