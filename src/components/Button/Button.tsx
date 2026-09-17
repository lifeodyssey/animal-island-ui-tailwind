import React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../utils/cn';
import type { ComponentSize } from '../../utils/types';

const DonutIcon: React.FC<{ size?: number; color?: string; className?: string }> = ({
    size = 28,
    color = 'currentColor',
    className,
}) => (
    <svg
        viewBox="0 0 48 48"
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        fill="none"
        stroke={color}
        strokeWidth={3.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        aria-hidden
    >
        <circle cx="24" cy="24" r="15" fill="#F4A6A4" />
        <circle cx="24" cy="24" r="6" fill="#FFFFFF" />
        <rect x="17" y="13" width="4.5" height="1.8" rx="0.9" transform="rotate(25 19 14)" fill="#E9C46A" />
        <rect x="27" y="12" width="4.5" height="1.8" rx="0.9" transform="rotate(-20 29 13)" fill="#2A9D8F" />
        <rect x="32" y="19" width="4.5" height="1.8" rx="0.9" transform="rotate(45 34 20)" fill="#264653" />
        <rect x="13" y="22" width="4.5" height="1.8" rx="0.9" transform="rotate(-35 15 23)" fill="#E9C46A" />
        <rect x="30" y="30" width="4.5" height="1.8" rx="0.9" transform="rotate(15 32 31)" fill="#2A9D8F" />
        <rect x="17" y="31" width="4.5" height="1.8" rx="0.9" transform="rotate(60 19 32)" fill="#264653" />
    </svg>
);

export type ButtonType = 'primary' | 'default' | 'dashed' | 'text' | 'link';
export type ButtonSize = ComponentSize;
export type ButtonHTMLType = 'submit' | 'reset' | 'button';

// Variants emit byte-identical animal-* class literals in the same order as the
// previous lookup + boolean chain, so the rendered class list (and pixels) are
// unchanged: animal-btn → type → size → danger → ghost → block → loading.
const buttonVariants = cva('animal-btn', {
    variants: {
        type: {
            primary: 'animal-btn-primary',
            default: 'animal-btn-default',
            dashed: 'animal-btn-dashed',
            text: 'animal-btn-text',
            link: 'animal-btn-link',
        },
        size: {
            small: 'animal-btn-small',
            middle: 'animal-btn-middle',
            large: 'animal-btn-large',
        },
        danger: { true: 'animal-btn-danger' },
        ghost: { true: 'animal-btn-ghost' },
        block: { true: 'animal-btn-block' },
        loading: { true: 'animal-btn-loading' },
    },
    defaultVariants: { type: 'default', size: 'middle' },
});

export interface ButtonProps extends Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    'type'
> {
    /** 按钮类型 */
    type?: ButtonType;
    /** 按钮尺寸 */
    size?: ButtonSize;
    /** 是否危险按钮 */
    danger?: boolean;
    /** 是否幽灵按钮（透明背景） */
    ghost?: boolean;
    /** 是否块级按钮 */
    block?: boolean;
    /** 加载状态 */
    loading?: boolean;
    /** 禁用状态 */
    disabled?: boolean;
    /** 图标 */
    icon?: React.ReactNode;
    /** 原生 button type */
    htmlType?: ButtonHTMLType;
    children?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            type = 'default',
            size = 'middle',
            danger = false,
            ghost = false,
            block = false,
            loading = false,
            disabled = false,
            icon,
            htmlType = 'button',
            children,
            className,
            onClick,
            'aria-busy': ariaBusy,
            'aria-disabled': ariaDisabled,
            ...rest
        },
        ref
    ) => {
        const handleClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
            if (loading) {
                event.preventDefault();
                event.stopPropagation();
                return;
            }

            onClick?.(event);
        };

        return (
            <button
                {...rest}
                ref={ref}
                type={htmlType}
                className={cn(
                    buttonVariants({ type, size, danger, ghost, block, loading }),
                    className
                )}
                disabled={disabled}
                aria-busy={loading ? true : ariaBusy}
                aria-disabled={loading ? true : ariaDisabled}
                onClick={handleClick}
            >
                {loading ? (
                    <span className="animal-btn-icon" aria-hidden>
                        <DonutIcon size={28} color="currentColor" className="animal-btn-loading-icon" />
                    </span>
                ) : (
                    icon && <span className="animal-btn-icon">{icon}</span>
                )}
                {children && <span>{children}</span>}
            </button>
        );
    }
);

Button.displayName = 'Button';
