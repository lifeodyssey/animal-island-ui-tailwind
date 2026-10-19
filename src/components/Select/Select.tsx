import React, { useMemo, useState } from 'react';
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
    /** 是否允许清空已选项 */
    allowClear?: boolean;
    /** 清空时的回调 */
    onClear?: () => void;
    /** 清空按钮的无障碍标签 */
    clearAriaLabel?: string;
    /** 是否开启搜索过滤 */
    showSearch?: boolean;
    /** 自定义过滤函数 */
    filterOption?: (input: string, option: SelectOption) => boolean;
    /** 过滤匹配的字段，'label'（默认）或 'key' */
    optionFilterProp?: 'label' | 'key';
    /** 搜索框内容变化回调 */
    onSearch?: (value: string) => void;
    /** 无匹配项时的内容 */
    notFoundContent?: React.ReactNode;
    /** 无障碍标签 */
    'aria-label'?: string;
    /** 关联外部可见 label 的 id */
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
            filterOption,
            optionFilterProp = 'label',
            onSearch,
            notFoundContent = '暂无数据',
            className,
            'aria-label': ariaLabel,
            'aria-labelledby': ariaLabelledBy,
            ...rest
        },
        ref,
    ) => {
        const { value: currentValue, setValue: handleChange } = useControllableState<string>({
            value,
            defaultValue: defaultValue ?? '',
            onChange,
        });

        const [searchValue, setSearchValue] = useState('');

        const selectedOption = options.find((option) => option.key === currentValue);
        const radixValue = selectedOption ? toRadixValue(currentValue) : '';

        const filteredOptions = useMemo(() => {
            if (!showSearch || !searchValue) return options;
            const lowerSearch = searchValue.toLowerCase();
            if (filterOption) return options.filter((opt) => filterOption(searchValue, opt));
            return options.filter((opt) => {
                const field = optionFilterProp === 'key' ? opt.key : opt.label;
                return field.toLowerCase().includes(lowerSearch);
            });
        }, [options, showSearch, searchValue, filterOption, optionFilterProp]);

        const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const v = e.target.value;
            setSearchValue(v);
            onSearch?.(v);
        };

        const handleClear = (e: React.MouseEvent) => {
            e.stopPropagation();
            handleChange('');
            onClear?.();
        };

        const handleOpenChange = (open: boolean) => {
            if (!open) setSearchValue('');
        };

        return (
            <RadixSelect.Root
                value={radixValue}
                onValueChange={(nextValue) => {
                    const key = fromRadixValue(nextValue, options);
                    if (key !== undefined) handleChange(key);
                }}
                disabled={disabled}
                onOpenChange={handleOpenChange}
            >
                <div className={cn('animal-select-wrapper', disabled && 'animal-select-disabled')}>
                    <RadixSelect.Trigger
                        ref={ref}
                        className={cn('animal-select-trigger', className)}
                        aria-label={ariaLabel}
                        aria-labelledby={ariaLabelledBy}
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
                    {allowClear && selectedOption && !disabled && (
                        <button
                            type="button"
                            className="animal-select-clear"
                            aria-label={clearAriaLabel}
                            onClick={handleClear}
                            onMouseDown={(e) => e.preventDefault()}
                        >
                            ×
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
                                <div className="animal-select-search-wrapper">
                                    <input
                                        className="animal-select-search-input"
                                        type="text"
                                        value={searchValue}
                                        onChange={handleSearchChange}
                                        onKeyDown={(e) => e.stopPropagation()}
                                        placeholder="搜索..."
                                        autoFocus
                                    />
                                </div>
                            )}
                            <RadixSelect.Viewport className="animal-select-viewport">
                                {filteredOptions.length > 0 ? (
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
                                ) : (
                                    <div className="animal-select-not-found">{notFoundContent}</div>
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
