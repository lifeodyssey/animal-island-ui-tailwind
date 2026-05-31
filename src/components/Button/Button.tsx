import React from 'react';
import { cn } from '../../utils/cn';
import type { ComponentSize } from '../../utils/types';

export type ButtonType = 'primary' | 'default' | 'dashed' | 'text' | 'link';
export type ButtonSize = ComponentSize;
export type ButtonHTMLType = 'submit' | 'reset' | 'button';

const buttonTypeClassName: Record<ButtonType, string> = {
    primary: 'animal-btn-primary',
    default: 'animal-btn-default',
    dashed: 'animal-btn-dashed',
    text: 'animal-btn-text',
    link: 'animal-btn-link',
};

const buttonSizeClassName: Record<ButtonSize, string> = {
    small: 'animal-btn-small',
    middle: 'animal-btn-middle',
    large: 'animal-btn-large',
};

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
                    'animal-btn',
                    buttonTypeClassName[type],
                    buttonSizeClassName[size],
                    danger && 'animal-btn-danger',
                    ghost && 'animal-btn-ghost',
                    block && 'animal-btn-block',
                    loading && 'animal-btn-loading',
                    className
                )}
                disabled={disabled}
                aria-busy={loading ? true : ariaBusy}
                aria-disabled={loading ? true : ariaDisabled}
                onClick={handleClick}
            >
                {icon && !loading && (
                    <span className="animal-btn-icon">{icon}</span>
                )}
                {children && <span>{children}</span>}
            </button>
        );
    }
);

Button.displayName = 'Button';
