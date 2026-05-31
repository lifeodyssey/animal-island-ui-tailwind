import React, { useCallback } from 'react';
import * as RadixCheckbox from '@radix-ui/react-checkbox';
import { cn } from '../../utils/cn';
import { CheckmarkIcon } from '../../utils/CheckmarkIcon';
import { useSafeId } from '../../utils/useSafeId';
import { useControllableState } from '../../utils/useControllableState';
import type { ComponentSize } from '../../utils/types';

export type CheckboxSize = ComponentSize;

export interface CheckboxOption {
    /** 选项标签 */
    label: React.ReactNode;
    /** 选项值 */
    value: string | number;
    /** 是否禁用该选项 */
    disabled?: boolean;
}

export interface CheckboxProps extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    'defaultValue' | 'onChange'
> {
    /** 选中的值列表（受控） */
    value?: Array<string | number>;
    /** 默认选中的值列表 */
    defaultValue?: Array<string | number>;
    /** 选项列表 */
    options: CheckboxOption[];
    /** 尺寸 */
    size?: CheckboxSize;
    /** 禁用全部 */
    disabled?: boolean;
    /** 布局方向 */
    direction?: 'horizontal' | 'vertical';
    /** 变化回调 */
    onChange?: (values: Array<string | number>) => void;
}

const getOptionId = (groupId: string, value: string | number) => {
    const safeValue = String(value).replace(/[^a-zA-Z0-9_-]/g, '_') || 'empty';
    return `animal-checkbox-${groupId}-${safeValue}`;
};

export const Checkbox = React.forwardRef<HTMLDivElement, CheckboxProps>(
    (
        {
            value,
            defaultValue = [],
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
        const { value: checkedValues, setValue } = useControllableState<Array<string | number>>({
            value,
            defaultValue,
            onChange,
        });
        const safeGroupId = useSafeId();

        const handleCheckedChange = useCallback(
            (optValue: string | number, nextChecked: boolean | 'indeterminate', optDisabled?: boolean) => {
                if (disabled || optDisabled) return;

                // Make this handler idempotent (avoid double-toggle flake on keyboard and label activation).
                const shouldBeChecked = nextChecked === true || nextChecked === 'indeterminate';
                const next = shouldBeChecked
                    ? (checkedValues.includes(optValue) ? checkedValues : [...checkedValues, optValue])
                    : checkedValues.filter((v) => v !== optValue);

                setValue(next);
            },
            [disabled, checkedValues, setValue],
        );

        return (
            <div
                ref={ref}
                className={cn(
                    'animal-checkbox-group',
                    direction === 'vertical' && 'animal-checkbox-group-vertical',
                    disabled && 'animal-checkbox-group-disabled',
                    className,
                )}
                style={style}
                {...rest}
            >
                {options.map((opt, index) => {
                    const isChecked = checkedValues.includes(opt.value);
                    const isDisabled = disabled || opt.disabled;
                    const optionId = getOptionId(safeGroupId, opt.value);

                    return (
                        <div
                            key={`${String(opt.value)}-${index}`}
                            className={cn(
                                'animal-checkbox-item',
                                `animal-checkbox-${size}`,
                                isDisabled && 'animal-checkbox-disabled',
                            )}
                        >
                            <RadixCheckbox.Root
                                id={optionId}
                                className="animal-checkbox-box"
                                checked={isChecked}
                                disabled={isDisabled}
                                onCheckedChange={(nextChecked) => handleCheckedChange(opt.value, nextChecked, opt.disabled)}
                            >
                                <RadixCheckbox.Indicator className="animal-checkbox-indicator">
                                    <CheckmarkIcon />
                                </RadixCheckbox.Indicator>
                            </RadixCheckbox.Root>
                            <label className="animal-checkbox-label" htmlFor={optionId}>
                                {opt.label}
                            </label>
                        </div>
                    );
                })}
            </div>
        );
    },
);

Checkbox.displayName = 'Checkbox';
