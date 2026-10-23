import React, { useState } from 'react';
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
    onClear?: () => void;
    placeholder?: string;
    disabled?: boolean;
    allowClear?: boolean;
    showSearch?: boolean;
    searchPlaceholder?: string;
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
            onClear,
            placeholder = '请选择',
            disabled = false,
            allowClear = false,
            showSearch = false,
            searchPlaceholder = '搜索...',
            className,
            ...rest
        },
        ref,
    ) => {
        const [searchQuery, setSearchQuery] = useState('');

        const { value: currentValue, setValue: handleChange } = useControllableState<string>({
            value,
            defaultValue: defaultValue ?? '',
            onChange,
        });

        const selectedOption = options.find((option) => option.key === currentValue);
        const radixValue = selectedOption ? toRadixValue(currentValue) : '';

        const filteredOptions = showSearch && searchQuery
            ? options.filter((o) => o.label.toLowerCase().includes(searchQuery.toLowerCase()))
            : options;

        const handleClear = (e: React.MouseEvent) => {
            e.stopPropagation();
            handleChange('');
            onClear?.();
        };

        return (
            <RadixSelect.Root
                value={radixValue}
                onValueChange={(nextValue) => {
                    const key = fromRadixValue(nextValue, options);
                    if (key !== undefined) handleChange(key);
                    setSearchQuery('');
                }}
                disabled={disabled}
                onOpenChange={(open) => { if (!open) setSearchQuery(''); }}
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
                        {allowClear && selectedOption && !disabled ? (
                            <span
                                className="animal-select-clear"
                                role="button"
                                aria-label="清除选择"
                                onClick={handleClear}
                                onPointerDown={(e) => e.preventDefault()}
                            >
                                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                                    <path d="M8 2L2 8M2 2l6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                                </svg>
                            </span>
                        ) : (
                            <RadixSelect.Icon className="animal-select-arrow">
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                    <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </RadixSelect.Icon>
                        )}
                    </RadixSelect.Trigger>
                    <RadixSelect.Portal>
                        <RadixSelect.Content
                            className="animal-select-content"
                            position="popper"
                            side="bottom"
                            sideOffset={6}
                            collisionPadding={{ left: 30, right: 10, top: 10, bottom: 10 }}
                            avoidCollisions
                        >
                            {showSearch && (
                                <div className="animal-select-search" onPointerDown={(e) => e.stopPropagation()}>
                                    <input
                                        className="animal-select-search-input"
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder={searchPlaceholder}
                                        autoFocus
                                        onKeyDown={(e) => e.stopPropagation()}
                                    />
                                </div>
                            )}
                            <RadixSelect.Viewport className="animal-select-viewport">
                                {filteredOptions.map((option) => (
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
                                {filteredOptions.length === 0 && (
                                    <div className="animal-select-empty">无匹配选项</div>
                                )}
                            </RadixSelect.Viewport>
                        </RadixSelect.Content>
                    </RadixSelect.Portal>
                </div>
            </RadixSelect.Root>
        );
    },
);

Select.displayName = 'Select';
