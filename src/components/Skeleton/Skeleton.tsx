import React from 'react';
import { cn } from '../../utils/cn';

export type SkeletonVariant = 'text' | 'circle' | 'rect' | 'paragraph';

export interface SkeletonProps {
    /** Whether to show the shimmer animation */
    active?: boolean;
    /** Shape variant */
    variant?: SkeletonVariant;
    /** Number of paragraph lines (paragraph variant only) */
    rows?: number;
    width?: number | string;
    height?: number | string;
    className?: string;
    style?: React.CSSProperties;
}

export interface SkeletonButtonProps {
    /** Whether to show the shimmer animation */
    active?: boolean;
    width?: number | string;
    height?: number | string;
    className?: string;
    style?: React.CSSProperties;
}

export interface SkeletonInputProps {
    /** Whether to show the shimmer animation */
    active?: boolean;
    width?: number | string;
    className?: string;
    style?: React.CSSProperties;
}

export interface SkeletonAvatarProps {
    /** Whether to show the shimmer animation */
    active?: boolean;
    /** Avatar size in px or any CSS length */
    size?: number | string;
    /** Circle (default) or square shape */
    shape?: 'circle' | 'square';
    className?: string;
    style?: React.CSSProperties;
}

const VARIANT_CLASS: Record<SkeletonVariant, string> = {
    text: 'animal-skeleton-text',
    circle: 'animal-skeleton-circle',
    rect: 'animal-skeleton-rect',
    paragraph: 'animal-skeleton-paragraph',
};

export const Skeleton: React.FC<SkeletonProps> = ({
    active = false,
    variant = 'text',
    rows = 3,
    width,
    height,
    className,
    style,
}) => {
    const baseClass = cn('animal-skeleton', active && 'animal-skeleton-active', className);

    if (variant === 'paragraph') {
        return (
            <div className={baseClass} style={style}>
                <div className={VARIANT_CLASS.paragraph}>
                    {Array.from({ length: rows }).map((_, i) => (
                        <div
                            key={i}
                            className={cn(
                                'animal-skeleton-paragraph-block',
                                'animal-skeleton-line'
                            )}
                            style={i === rows - 1 ? { width: '60%' } : undefined}
                        />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div
            className={cn(baseClass, VARIANT_CLASS[variant])}
            style={{ width, height, ...style }}
        />
    );
};

Skeleton.displayName = 'Skeleton';

export const SkeletonButton: React.FC<SkeletonButtonProps> = ({
    active = false,
    width,
    height,
    className,
    style,
}) => (
    <div
        className={cn(
            'animal-skeleton',
            active && 'animal-skeleton-active',
            'animal-skeleton-btn',
            className
        )}
        style={{ width, height, ...style }}
    />
);

SkeletonButton.displayName = 'SkeletonButton';

export const SkeletonInput: React.FC<SkeletonInputProps> = ({
    active = false,
    width,
    className,
    style,
}) => (
    <div
        className={cn(
            'animal-skeleton',
            active && 'animal-skeleton-active',
            'animal-skeleton-text',
            className
        )}
        style={{ width, ...style }}
    />
);

SkeletonInput.displayName = 'SkeletonInput';

export const SkeletonAvatar: React.FC<SkeletonAvatarProps> = ({
    active = false,
    size,
    shape = 'circle',
    className,
    style,
}) => (
    <div
        className={cn(
            'animal-skeleton',
            active && 'animal-skeleton-active',
            shape === 'circle' ? 'animal-skeleton-circle' : 'animal-skeleton-rect',
            className
        )}
        style={{
            width: size,
            height: size,
            ...style,
        }}
    />
);

SkeletonAvatar.displayName = 'SkeletonAvatar';
