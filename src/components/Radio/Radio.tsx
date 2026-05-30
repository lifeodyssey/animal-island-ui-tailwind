import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { cn } from '../../utils/cn';

export type RadioSize = 'small' | 'middle' | 'large';

export interface RadioOption {
    /** 选项标签 */
    label: React.ReactNode;
    /** 选项值 */
    value: string | number;
    /** 是否禁用该选项 */
    disabled?: boolean;
}

export interface RadioProps
    extends Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'> {
    /** 选中的值（受控） */
    value?: string | number;
    /** 默认选中的值 */
    defaultValue?: string | number;
    /** 选项列表 */
    options: RadioOption[];
    /** 尺寸 */
    size?: RadioSize;
    /** 禁用全部 */
    disabled?: boolean;
    /** 布局方向 */
    direction?: 'horizontal' | 'vertical';
    /** 变化回调 */
    onChange?: (value: string | number) => void;
}

export const Radio = React.forwardRef<HTMLDivElement, RadioProps>(
    (
        {
            value,
            defaultValue,
            options,
            size = 'middle',
            disabled = false,
            direction = 'horizontal',
            onChange,
            className,
            style,
            ...rest
        },
        ref,
    ) => {
        const [innerValue, setInnerValue] = useState<string | number | undefined>(defaultValue);
        const isControlled = value !== undefined;
        const checkedValue = isControlled ? value : innerValue;
        const groupRef = useRef<HTMLDivElement | null>(null);
        const groupId = `animal-radio-${useId().replace(/:/g, '')}`;

        const [focusedIndex, setFocusedIndex] = useState<number>(() => {
            const selectedIndex = options.findIndex(
                (opt) => opt.value === checkedValue && !opt.disabled,
            );
            if (selectedIndex >= 0) return selectedIndex;
            const firstEnabled = options.findIndex((opt) => !opt.disabled);
            return firstEnabled >= 0 ? firstEnabled : 0;
        });

        useEffect(() => {
            const selectedIndex = options.findIndex(
                (opt) => opt.value === checkedValue && !opt.disabled,
            );
            if (selectedIndex >= 0) {
                setFocusedIndex(selectedIndex);
                return;
            }
            const firstEnabled = options.findIndex((opt) => !opt.disabled);
            if (firstEnabled >= 0) {
                setFocusedIndex(firstEnabled);
            }
        }, [checkedValue, options]);

        const enabledIndices = useMemo(
            () =>
                options
                    .map((option, index) => ({ option, index }))
                    .filter(({ option }) => !disabled && !option.disabled)
                    .map(({ index }) => index),
            [disabled, options],
        );

        const handleChange = useCallback(
            (nextValue: string | number, optionDisabled?: boolean) => {
                if (disabled || optionDisabled) return;
                if (!isControlled) {
                    setInnerValue(nextValue);
                }
                onChange?.(nextValue);
            },
            [disabled, isControlled, onChange],
        );

        const handleKeyDown = useCallback(
            (event: React.KeyboardEvent<HTMLDivElement>) => {
                if (enabledIndices.length === 0) return;

                const currentPos = enabledIndices.indexOf(focusedIndex);
                const fallbackPos = currentPos < 0 ? 0 : currentPos;
                let nextPos: number | null = null;

                switch (event.key) {
                    case 'ArrowRight':
                    case 'ArrowDown':
                        event.preventDefault();
                        nextPos = (fallbackPos + 1) % enabledIndices.length;
                        break;
                    case 'ArrowLeft':
                    case 'ArrowUp':
                        event.preventDefault();
                        nextPos = (fallbackPos - 1 + enabledIndices.length) % enabledIndices.length;
                        break;
                    case 'Home':
                        event.preventDefault();
                        nextPos = 0;
                        break;
                    case 'End':
                        event.preventDefault();
                        nextPos = enabledIndices.length - 1;
                        break;
                    default:
                        return;
                }

                if (nextPos === null) return;
                const nextIndex = enabledIndices[nextPos];
                setFocusedIndex(nextIndex);
                handleChange(options[nextIndex].value, options[nextIndex].disabled);

                const circles = groupRef.current?.querySelectorAll<HTMLElement>('[data-radio-circle]');
                circles?.[nextIndex]?.focus();
            },
            [enabledIndices, focusedIndex, handleChange, options],
        );

        return (
            <div
                ref={(node) => {
                    groupRef.current = node;
                    if (typeof ref === 'function') {
                        ref(node);
                    } else if (ref) {
                        ref.current = node;
                    }
                }}
                role="radiogroup"
                className={cn(
                    'animal-radio-group',
                    direction === 'vertical' ? 'animal-radio-group-vertical' : 'animal-radio-group-horizontal',
                    disabled && 'animal-radio-group-disabled',
                    className,
                )}
                style={style}
                onKeyDown={handleKeyDown}
                {...rest}
            >
                {options.map((option, index) => {
                    const isChecked = checkedValue === option.value;
                    const isDisabled = disabled || option.disabled;
                    const isFocusable = index === focusedIndex && !isDisabled;
                    const labelId = `${groupId}-label-${index}`;

                    return (
                        <label
                            key={`${String(option.value)}-${index}`}
                            className={cn(
                                'animal-radio-item',
                                `animal-radio-${size}`,
                                isChecked && 'animal-radio-checked',
                                isDisabled && 'animal-radio-disabled',
                            )}
                            onClick={() => {
                                if (isDisabled) return;
                                setFocusedIndex(index);
                                handleChange(option.value, option.disabled);
                            }}
                        >
                            <span
                                data-radio-circle
                                role="radio"
                                aria-labelledby={labelId}
                                aria-checked={isChecked}
                                aria-disabled={isDisabled || undefined}
                                tabIndex={isFocusable ? 0 : -1}
                                className="animal-radio-circle"
                                onFocus={() => {
                                    if (!isDisabled) setFocusedIndex(index);
                                }}
                                onKeyDown={(event) => {
                                    if (event.key !== ' ' && event.key !== 'Enter') return;
                                    event.preventDefault();
                                    handleChange(option.value, option.disabled);
                                }}
                            >
                                {isChecked && (
                                    <span className="animal-radio-indicator">
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M2 8L6 12L14 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </span>
                                )}
                            </span>
                            <span id={labelId} className="animal-radio-label">{option.label}</span>
                        </label>
                    );
                })}
            </div>
        );
    },
);

Radio.displayName = 'Radio';
