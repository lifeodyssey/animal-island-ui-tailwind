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
    /** 标签内容 */
    children?: React.ReactNode;
    /** 尺寸 */
    size?: TagSize;
    /** 风格变体：solid 填充、outlined 描边、dashed 虚线 */
    variant?: TagVariant;
    /** 颜色 */
    color?: TagColor;
    /** 是否可关闭 */
    closable?: boolean;
    /** 关闭回调 */
    onClose?: (e: React.MouseEvent<HTMLElement>) => void;
    /** 点击回调，开启后标签可点击 */
    onClick?: (e: React.MouseEvent<HTMLElement>) => void;
    /** 禁用状态 */
    disabled?: boolean;
    /** 自定义类名 */
    className?: string;
    /** 自定义样式 */
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
        disabled: { true: 'animal-tag-disabled' },
        clickable: { true: 'animal-tag-clickable' },
    },
    defaultVariants: { size: 'medium', variant: 'solid' },
});

// All animal-tag-{color}-{variant} classes are defined in components.css;
// this function just assembles the class name string (no Tailwind scanning needed).
const getColorClass = (color: TagColor, variant: TagVariant): string => {
    if (color === 'default') return '';
    return `animal-tag-${color}-${variant}`;
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
        [disabled, onClose]
    );

    const handleClick = useCallback(
        (e: React.MouseEvent<HTMLElement>) => {
            if (disabled) return;
            onClick?.(e);
        },
        [disabled, onClick]
    );

    const isInteractive = !!onClick && !disabled;

    const cls = cn(
        tagVariants({ size, variant, disabled, clickable: isInteractive }),
        getColorClass(color, variant),
        className
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
