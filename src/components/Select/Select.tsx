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
    /** Allow clearing the selected value with a clear button */
    allowClear?: boolean;
    /** Callback fired after the value is cleared */
    onClear?: () => void;
    /** Accessible label for the clear button, default "清除" */
    clearAriaLabel?: string;
    /** Show a search input to filter options */
    showSearch?: boolean;
    /** Filter rule: true = filter by optionFilterProp, false = no filter, function = custom */
    filterOption?: boolean | ((inputValue: string, option: SelectOption) => boolean);
    /** Field used for filtering when filterOption is true, default "label" */
    optionFilterProp?: 'key' | 'label';
    /** Callback when the search input changes */
    onSearch?: (value: string) => void;
    /** Content shown when no options match the search, default "暂无数据" */
    notFoundContent?: React.ReactNode;
    'aria-label'?: string;
    'aria-labelledby'?: string;
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
            allowClear = false,
            onClear,
            clearAriaLabel = '清除',
            showSearch = false,
            filterOption = true,
            optionFilterProp = 'label',
            onSearch,
            notFoundContent = '暂无数据',
            'aria-label': ariaLabel,
            'aria-labelledby': ariaLabelledBy,
            className,
            ...rest
        },
        ref,
    ) => {
        const [searchInput, setSearchInput] = React.useState('');

        const { value: currentValue, setValue: handleChange } = useControllableState<string>({
            value,
            defaultValue: defaultValue ?? '',
            onChange,
        });

        const filteredOptions = React.useMemo(() => {
            if (!showSearch || !searchInput) return options;
            if (filterOption === false) return options;
            if (typeof filterOption === 'function') {
                return options.filter((opt) => (filterOption as (v: string, o: SelectOption) => boolean)(searchInput, opt));
            }
            const q = searchInput.toLowerCase();
            return options.filter((opt) => String(opt[optionFilterProp]).toLowerCase().includes(q));
        }, [options, showSearch, searchInput, filterOption, optionFilterProp]);

        const selectedOption = options.find((option) => option.key === currentValue);
        const radixValue = selectedOption ? toRadixValue(currentValue) : '';
        const hasClearable = allowClear && !!selectedOption;

        function handleClear(e: React.MouseEvent) {
            e.stopPropagation();
            handleChange('');
            onClear?.();
        }

        function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
            const v = e.target.value;
            setSearchInput(v);
            onSearch?.(v);
        }

        return (
            <RadixSelect.Root
                value={radixValue}
                onValueChange={(nextValue) => {
                    const key = fromRadixValue(nextValue, options);
                    if (key !== undefined) {
                        handleChange(key);
                        setSearchInput('');
                    }
                }}
                disabled={disabled}
            >
                <div
                    className={cn('animal-select-wrapper', disabled && 'animal-select-disabled')}
                    aria-label={ariaLabel}
                    aria-labelledby={ariaLabelledBy}
                >
                    <RadixSelect.Trigger
                        ref={ref}
                        className={cn('animal-select-trigger', hasClearable && 'animal-select-trigger--clearable', className)}
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
                    {hasClearable && (
                        <button
                            type="button"
                            className="animal-select-clear"
                            aria-label={clearAriaLabel}
                            tabIndex={-1}
                            onClick={handleClear}
                        >
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                                <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                        </button>
                    )}
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
                                <div className="animal-select-search">
                                    <input
                                        className="animal-select-search-input"
                                        value={searchInput}
                                        onChange={handleSearchChange}
                                        placeholder="搜索..."
                                        autoFocus
                                        onKeyDown={(e) => e.stopPropagation()}
                                    />
                                </div>
                            )}
                            <RadixSelect.Viewport className="animal-select-viewport">
                                {filteredOptions.length === 0 ? (
                                    <div className="animal-select-not-found">{notFoundContent}</div>
                                ) : (
                                    filteredOptions.map((option) => (
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
                                    ))
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
