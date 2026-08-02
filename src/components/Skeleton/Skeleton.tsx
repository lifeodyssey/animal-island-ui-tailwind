import React from 'react';
import { cn } from '../../utils/cn';

export type SkeletonVariant = 'text' | 'circle' | 'rect' | 'paragraph';

export interface SkeletonProps {
    loading?: boolean;
    variant?: SkeletonVariant;
    active?: boolean;
    rows?: number;
    width?: number | string;
    rowWidths?: (number | string)[];
    widthValue?: number | string;
    heightValue?: number | string;
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
}

const VT_CLASS: Record<SkeletonVariant, string> = {
    text: 'animal-skeleton-text',
    circle: 'animal-skeleton-circle',
    rect: 'animal-skeleton-rect',
    paragraph: 'animal-skeleton-paragraph',
};

const DEFAULT_PARAGRAPH_WIDTHS = ['100%', '92%', '84%', '76%', '68%'];

export const Skeleton: React.FC<SkeletonProps> = ({
    loading = true,
    variant = 'text',
    active = true,
    rows = 3,
    width,
    rowWidths,
    widthValue,
    heightValue,
    className,
    style,
    children,
}) => {
    if (!loading && children) {
        return <>{children}</>;
    }

    const baseCls = cn(
        'animal-skeleton',
        active && 'animal-skeleton-active',
        VT_CLASS[variant],
        className
    );

    if (variant === 'paragraph') {
        const widths = Array.isArray(rowWidths) ? rowWidths : DEFAULT_PARAGRAPH_WIDTHS;
        const rowCount = Math.max(1, rows);
        return (
            <div className={cn(baseCls, 'animal-skeleton-paragraph-block')} style={style}>
                {Array.from({ length: rowCount }, (_, i) => {
                    const w = widths[i] ?? widths[widths.length - 1] ?? '100%';
                    return <div key={i} className="animal-skeleton-line" style={{ width: w }} />;
                })}
            </div>
        );
    }

    if (variant === 'circle') {
        const size = widthValue ?? heightValue ?? 44;
        return (
            <div
                className={baseCls}
                style={{ width: size, height: size, ...style }}
                aria-hidden
            />
        );
    }

    if (variant === 'rect') {
        return (
            <div
                className={baseCls}
                style={{ width: widthValue ?? '100%', height: heightValue ?? 120, ...style }}
                aria-hidden
            />
        );
    }

    // text (default)
    return (
        <div
            className={baseCls}
            style={{ width: width ?? '100%', height: heightValue ?? 16, ...style }}
            aria-hidden
        />
    );
};

Skeleton.displayName = 'Skeleton';

// ---- SkeletonButton ----
export interface SkeletonButtonProps {
    size?: 'small' | 'middle' | 'large';
    active?: boolean;
    className?: string;
    style?: React.CSSProperties;
}

const BTN_SIZE: Record<string, { width: number; height: number }> = {
    small: { width: 80, height: 32 },
    middle: { width: 100, height: 45 },
    large: { width: 130, height: 48 },
};

export const SkeletonButton: React.FC<SkeletonButtonProps> = ({
    size = 'middle',
    active = true,
    className,
    style,
}) => {
    const dim = BTN_SIZE[size];
    return (
        <div
            className={cn('animal-skeleton', 'animal-skeleton-btn', active && 'animal-skeleton-active', className)}
            style={{ width: dim.width, height: dim.height, borderRadius: 50, ...style }}
            aria-hidden
        />
    );
};

SkeletonButton.displayName = 'SkeletonButton';

// ---- SkeletonInput ----
export interface SkeletonInputProps {
    size?: 'small' | 'middle' | 'large';
    active?: boolean;
    className?: string;
    style?: React.CSSProperties;
}

const INPUT_SIZE: Record<string, { width: number; height: number }> = {
    small: { width: 160, height: 32 },
    middle: { width: 200, height: 40 },
    large: { width: 240, height: 48 },
};

export const SkeletonInput: React.FC<SkeletonInputProps> = ({
    size = 'middle',
    active = true,
    className,
    style,
}) => {
    const dim = INPUT_SIZE[size];
    return (
        <div
            className={cn('animal-skeleton', active && 'animal-skeleton-active', className)}
            style={{ width: dim.width, height: dim.height, borderRadius: 50, ...style }}
            aria-hidden
        />
    );
};

SkeletonInput.displayName = 'SkeletonInput';

// ---- SkeletonAvatar ----
export interface SkeletonAvatarProps {
    size?: 'small' | 'middle' | 'large';
    shape?: 'circle' | 'square';
    active?: boolean;
    className?: string;
    style?: React.CSSProperties;
}

const AVATAR_SIZE: Record<string, number> = {
    small: 32,
    middle: 44,
    large: 56,
};

export const SkeletonAvatar: React.FC<SkeletonAvatarProps> = ({
    size = 'middle',
    shape = 'circle',
    active = true,
    className,
    style,
}) => {
    const px = AVATAR_SIZE[size];
    return (
        <div
            className={cn('animal-skeleton', active && 'animal-skeleton-active', className)}
            style={{
                width: px,
                height: px,
                borderRadius: shape === 'circle' ? '50%' : 12,
                ...style,
            }}
            aria-hidden
        />
    );
};

SkeletonAvatar.displayName = 'SkeletonAvatar';
