import React from 'react';
import * as RadixSelect from '@radix-ui/react-select';
import { cn } from '../../utils/cn';
import { useControllableState } from '../../utils/useControllableState';

export type SelectOption = {
    key: string;
    label: string;
};

export interface SelectProps extends Omit<
    React.ComponentPropsWithoutRef<typeof RadixSelect.Trigger>,
    'children' | 'defaultValue' | 'disabled' | 'onChange' | 'value'
> {
    options: SelectOption[];
    value?: string;
    defaultValue?: string;
    onChange?: (key: string) => void;
    placeholder?: string;
    disabled?: boolean;
}

const EMPTY_KEY_PREFIX = '__animal_empty_';

function toRadixValue(key: string): string {
    return key === '' ? `${EMPTY_KEY_PREFIX}0` : key;
}

function fromRadixValue(radixVal: string, options: SelectOption[]): string | undefined {
    if (radixVal.startsWith(EMPTY_KEY_PREFIX)) return '';
    const opt = options.find((o) => o.key === radixVal);
    return opt ? opt.key : undefined;
}

export const Select = React.forwardRef<HTMLButtonElement, SelectProps>(
    (
        {
            options,
            value,
            defaultValue,
            onChange,
            placeholder = '请选择',
            disabled = false,
            className,
            ...rest
        },
        ref,
    ) => {
        const { value: currentValue, setValue: handleChange } = useControllableState<string>({
            value,
            defaultValue: defaultValue ?? '',
            onChange,
        });

        const selectedOption = options.find((option) => option.key === currentValue);
        const radixValue = selectedOption ? toRadixValue(currentValue) : '';

        return (
            <RadixSelect.Root
                value={radixValue}
                onValueChange={(nextValue) => {
                    const key = fromRadixValue(nextValue, options);
                    if (key !== undefined) handleChange(key);
                }}
                disabled={disabled}
            >
                <div className={cn('animal-select-wrapper', disabled && 'animal-select-disabled')}>
                    <RadixSelect.Trigger
                        ref={ref}
                        className={cn('animal-select-trigger', className)}
                        {...rest}
                    >
                        <RadixSelect.Value
                            className={selectedOption ? 'animal-select-value' : 'animal-select-placeholder'}
                            placeholder={<span className="animal-select-placeholder">{placeholder}</span>}
                        >
                            {selectedOption?.label}
                        </RadixSelect.Value>
                        <RadixSelect.Icon className="animal-select-arrow">
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </RadixSelect.Icon>
                    </RadixSelect.Trigger>
                    <RadixSelect.Portal>
                        <RadixSelect.Content
                            className="animal-select-content"
                            position="popper"
                            side="bottom"
                            sideOffset={6}
                            avoidCollisions
                        >
                            <RadixSelect.Viewport className="animal-select-viewport">
                                {options.map((option) => (
                                    <RadixSelect.Item
                                        key={option.key}
                                        value={toRadixValue(option.key)}
                                        className="animal-select-item"
                                    >
                                        <RadixSelect.ItemIndicator className="animal-select-item-indicator">
                                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                                                <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </RadixSelect.ItemIndicator>
                                        <RadixSelect.ItemText>{option.label}</RadixSelect.ItemText>
                                    </RadixSelect.Item>
                                ))}
                            </RadixSelect.Viewport>
                        </RadixSelect.Content>
                    </RadixSelect.Portal>
                </div>
            </RadixSelect.Root>
        );
    },
);

Select.displayName = 'Select';
