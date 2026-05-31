import React, { useState, useCallback, useRef } from 'react';
import { cn } from '../../utils/cn';
import type { ComponentSize } from '../../utils/types';

export type InputSize = ComponentSize;
export type InputStatus = 'error' | 'warning';
type InputValue = NonNullable<React.InputHTMLAttributes<HTMLInputElement>['value']>;

const inputSizeClassName: Record<InputSize, string> = {
    small: 'animal-input-small',
    middle: 'animal-input-middle',
    large: 'animal-input-large',
};

const inputStatusClassName: Record<InputStatus, string> = {
    error: 'animal-input-error',
    warning: 'animal-input-warning',
};

const setNativeInputValue = (input: HTMLInputElement, value: string) => {
    const ownValueSetter = Object.getOwnPropertyDescriptor(input, 'value')?.set;
    const prototypeValueSetter = Object.getOwnPropertyDescriptor(
        HTMLInputElement.prototype,
        'value'
    )?.set;

    if (prototypeValueSetter && ownValueSetter !== prototypeValueSetter) {
        prototypeValueSetter.call(input, value);
        return;
    }

    if (ownValueSetter) {
        ownValueSetter.call(input, value);
        return;
    }

    input.value = value;
};

export interface InputProps extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'size' | 'prefix'
> {
    /** 输入框尺寸 */
    size?: InputSize;
    /** 前缀图标 */
    prefix?: React.ReactNode;
    /** 后缀图标 */
    suffix?: React.ReactNode;
    /** 允许清除 */
    allowClear?: boolean;
    /** 错误状态 */
    status?: InputStatus;
    /** 是否显示阴影 */
    shadow?: boolean;
    /** 值变化回调 */
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
    /** 清除回调 */
    onClear?: () => void;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    (
        {
            size = 'middle',
            prefix,
            suffix,
            allowClear = false,
            status,
            shadow = false,
            disabled = false,
            className,
            value,
            defaultValue,
            onChange,
            onClear,
            'aria-invalid': ariaInvalid,
            ...rest
        },
        ref
    ) => {
        const inputRef = useRef<HTMLInputElement | null>(null);
        const [innerValue, setInnerValue] = useState<InputValue>(() => defaultValue ?? '');
        const isControlled = value !== undefined;
        const currentValue = isControlled ? value : innerValue;
        const hasValue =
            currentValue !== undefined &&
            currentValue !== null &&
            String(currentValue).length > 0;

        const setInputRef = useCallback(
            (node: HTMLInputElement | null) => {
                inputRef.current = node;

                if (typeof ref === 'function') {
                    ref(node);
                    return;
                }

                if (ref) {
                    ref.current = node;
                }
            },
            [ref]
        );

        const handleChange: React.ChangeEventHandler<HTMLInputElement> =
            useCallback(
                (e) => {
                    if (!isControlled) setInnerValue(e.target.value);
                    onChange?.(e);
                },
                [isControlled, onChange]
            );

        const handleClear = useCallback(() => {
            const input = inputRef.current;
            if (!input || disabled) return;

            if (!isControlled) setInnerValue('');
            onClear?.();

            setNativeInputValue(input, '');
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.focus();
        }, [disabled, isControlled, onClear]);

        return (
            <span
                className={cn(
                    'animal-input-wrapper',
                    inputSizeClassName[size],
                    status && inputStatusClassName[status],
                    disabled && 'animal-input-disabled',
                    !shadow && 'animal-input-no-shadow',
                    className
                )}
                aria-disabled={disabled || undefined}
            >
                {prefix && (
                    <span className="animal-input-prefix">{prefix}</span>
                )}
                <input
                    {...rest}
                    ref={setInputRef}
                    className="animal-input-control"
                    disabled={disabled}
                    value={currentValue}
                    onChange={handleChange}
                    aria-invalid={
                        ariaInvalid ?? (status === 'error' ? true : undefined)
                    }
                />
                {allowClear && hasValue && !disabled && (
                    <button
                        type="button"
                        className="animal-input-clear"
                        aria-label="Clear input"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={handleClear}
                    >
                        ×
                    </button>
                )}
                {suffix && (
                    <span className="animal-input-suffix">{suffix}</span>
                )}
            </span>
        );
    }
);

Input.displayName = 'Input';
