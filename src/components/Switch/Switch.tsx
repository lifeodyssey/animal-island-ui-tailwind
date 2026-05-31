import React, { useCallback } from 'react';
import * as RadixSwitch from '@radix-ui/react-switch';
import { cn } from '../../utils/cn';
import { useControllableState } from '../../utils/useControllableState';

export type SwitchSize = 'small' | 'default';

export interface SwitchProps extends Omit<
    React.ComponentPropsWithoutRef<typeof RadixSwitch.Root>,
    'checked' | 'defaultChecked' | 'disabled' | 'onChange' | 'onCheckedChange' | 'children'
> {
    /** 是否选中（受控） */
    checked?: boolean;
    /** 默认是否选中 */
    defaultChecked?: boolean;
    /** 尺寸 */
    size?: SwitchSize;
    /** 禁用 */
    disabled?: boolean;
    /** 加载状态 */
    loading?: boolean;
    /** 选中时文案 */
    checkedChildren?: React.ReactNode;
    /** 未选中时文案 */
    unCheckedChildren?: React.ReactNode;
    /** 变化回调 */
    onChange?: (checked: boolean) => void;
}

export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
    (
        {
            checked,
            defaultChecked = false,
            size = 'default',
            disabled = false,
            loading = false,
            checkedChildren,
            unCheckedChildren,
            onChange,
            className,
            ...rest
        },
        ref,
    ) => {
        const { value: isChecked, setValue } = useControllableState<boolean>({
            value: checked,
            defaultValue: defaultChecked,
            onChange,
        });
        const isDisabled = disabled || loading;

        // Radix passes the next checked state. Use it directly to avoid "toggle based on stale state" bugs.
        const handleCheckedChange = useCallback(
            (nextChecked: boolean) => {
                if (isDisabled) return;
                setValue(nextChecked);
            },
            [isDisabled, setValue],
        );

        return (
            <RadixSwitch.Root
                ref={ref}
                className={cn(
                    'animal-switch',
                    size === 'small' && 'animal-switch-small',
                    disabled && 'animal-switch-disabled',
                    loading && 'animal-switch-loading',
                    className,
                )}
                checked={isChecked}
                onCheckedChange={handleCheckedChange}
                disabled={isDisabled}
                {...rest}
            >
                <span className="animal-switch-inner">
                    {isChecked ? checkedChildren : unCheckedChildren}
                </span>
                <RadixSwitch.Thumb className="animal-switch-thumb">
                    {loading && <span className="animal-spinner" />}
                </RadixSwitch.Thumb>
            </RadixSwitch.Root>
        );
    },
);

Switch.displayName = 'Switch';
