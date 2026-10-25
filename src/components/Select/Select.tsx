import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
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
    allowClear?: boolean;
    onClear?: () => void;
    clearAriaLabel?: string;
    showSearch?: boolean;
    filterOption?: boolean | ((input: string, option: SelectOption) => boolean);
    optionFilterProp?: 'label' | 'key' | 'value';
    onSearch?: (value: string) => void;
    notFoundContent?: React.ReactNode;
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
            clearAriaLabel,
            showSearch = false,
            filterOption = true,
            optionFilterProp = 'label',
            onSearch,
            notFoundContent,
            className,
            ...rest
        },
        ref,
    ) => {
        const [open, setOpen] = useState(false);
        const [searchText, setSearchText] = useState('');
        const [explicitlyCleared, setExplicitlyCleared] = useState(false);
        const triggerRef = useRef<HTMLButtonElement>(null);
        const searchRef = useRef<HTMLInputElement>(null);
        const contentRef = useRef<HTMLDivElement>(null);
        const keepSearchFocus = useRef(false);
        const listboxId = useId();
        const setTriggerRef = useCallback((node: HTMLButtonElement | null) => {
            triggerRef.current = node;
            if (typeof ref === 'function') ref(node);
            else if (ref) ref.current = node;
        }, [ref]);

        const { value: currentValue, setValue: handleChange } = useControllableState<string>({
            value,
            defaultValue: defaultValue ?? '',
            onChange,
        });

        useEffect(() => {
            // A controlled owner may reject clearing; do not keep that intent
            // around to hide a later external selection of the empty key.
            if (currentValue !== '') setExplicitlyCleared(false);
        }, [currentValue, explicitlyCleared]);

        // Both clear and a legitimate empty-key selection emit ''. Remember the
        // action locally; re-sending the identical controlled value cannot convey intent.
        const selectedOption = explicitlyCleared && currentValue === ''
            ? undefined
            : options.find((option) => option.key === currentValue);
        const radixValue = selectedOption ? toRadixValue(currentValue) : '';

        const handleOpenChange = (next: boolean) => {
            keepSearchFocus.current = next && showSearch;
            setOpen(next);
            if (!next && searchText) {
                setSearchText('');
                onSearch?.('');
            }
        };

        const handleValueChange = (nextValue: string) => {
            const key = fromRadixValue(nextValue, options);
            if (key !== undefined) {
                setExplicitlyCleared(false);
                handleChange(key);
            }
        };

        const handleClear = (event: React.MouseEvent) => {
            event.stopPropagation();
            setExplicitlyCleared(true);
            handleChange('');
            onClear?.();
            triggerRef.current?.focus();
        };

        const filteredOptions = showSearch && filterOption !== false && searchText
            ? options.filter((option) => {
                if (typeof filterOption === 'function') return filterOption(searchText, option);
                const searchIn = optionFilterProp === 'label' ? option.label : option.key;
                return searchIn.toLowerCase().includes(searchText.toLowerCase());
            })
            : options;

        const focusOptions = (last = false) => {
            const items = contentRef.current?.querySelectorAll<HTMLElement>('[data-radix-collection-item]');
            const item = last ? items?.[items.length - 1] : items?.[0];
            if (item) {
                keepSearchFocus.current = false;
                item.focus();
            }
        };

        const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
            // Text editing belongs to the input, not Select's typeahead handler.
            event.stopPropagation();
            if (event.nativeEvent.isComposing) return;
            if (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'Tab') {
                event.preventDefault();
                focusOptions(event.key === 'ArrowUp' || event.shiftKey);
            } else if (event.key === 'Enter') {
                event.preventDefault();
                if (filteredOptions[0]) {
                    setExplicitlyCleared(false);
                    handleChange(filteredOptions[0].key);
                    handleOpenChange(false);
                }
            }
        };

        const showClear = allowClear && !!selectedOption && !disabled;

        return (
            <RadixSelect.Root
                value={radixValue}
                onValueChange={handleValueChange}
                disabled={disabled}
                open={open}
                onOpenChange={handleOpenChange}
            >
                <div className={cn(
                    'animal-select-wrapper',
                    disabled && 'animal-select-disabled',
                    showClear && 'animal-select-has-clear',
                )}>
                    <RadixSelect.Trigger
                        ref={setTriggerRef}
                        className={cn('animal-select-trigger', className)}
                        {...rest}
                        aria-haspopup={showSearch ? 'dialog' : 'listbox'}
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
                    {showClear && (
                        <button
                            type="button"
                            className="animal-select-clear"
                            aria-label={clearAriaLabel ?? '清除'}
                            onClick={handleClear}
                            onPointerDown={(event) => event.stopPropagation()}
                        >
                            ×
                        </button>
                    )}
                    <RadixSelect.Portal>
                        <RadixSelect.Content
                            ref={contentRef}
                            className="animal-select-content"
                            role={showSearch ? 'dialog' : 'listbox'}
                            aria-label={rest['aria-label'] ?? (showSearch ? '搜索选项' : undefined)}
                            aria-labelledby={rest['aria-labelledby']}
                            onFocusCapture={(event) => {
                                // Radix refocuses the selected item after positioning/filtering.
                                // Keep typing in the input until the user navigates to an option.
                                if (keepSearchFocus.current && event.target !== searchRef.current) {
                                    searchRef.current?.focus();
                                }
                            }}
                            onKeyDown={(event) => {
                                if (!showSearch || event.target === searchRef.current) return;
                                const firstOption = contentRef.current?.querySelector('[data-radix-collection-item]');
                                if (event.key === 'Tab' || (event.key === 'ArrowUp' && event.target === firstOption)) {
                                    event.preventDefault();
                                    searchRef.current?.focus();
                                }
                            }}
                            position="popper"
                            side="bottom"
                            sideOffset={6}
                            collisionPadding={{ left: 30, right: 10, top: 10, bottom: 10 }}
                            avoidCollisions
                        >
                            {showSearch && (
                                <div className="animal-select-search-wrapper">
                                    <input
                                        ref={searchRef}
                                        className="animal-select-search-input"
                                        type="search"
                                        aria-label="搜索选项"
                                        aria-controls={listboxId}
                                        autoComplete="off"
                                        autoFocus
                                        onFocus={() => { keepSearchFocus.current = true; }}
                                        value={searchText}
                                        onChange={(event) => {
                                            setSearchText(event.target.value);
                                            onSearch?.(event.target.value);
                                        }}
                                        onKeyDown={handleSearchKeyDown}
                                        onPointerDown={(event) => event.stopPropagation()}
                                        placeholder="搜索..."
                                    />
                                </div>
                            )}
                            <RadixSelect.Viewport
                                className="animal-select-viewport"
                                role={showSearch ? 'listbox' : undefined}
                                id={showSearch ? listboxId : undefined}
                                aria-label={showSearch ? rest['aria-label'] ?? '选项' : undefined}
                                aria-labelledby={showSearch ? rest['aria-labelledby'] : undefined}
                            >
                                {filteredOptions.length === 0 ? (
                                    <div className="animal-select-no-options" role="option" aria-disabled="true" aria-selected="false">
                                        {notFoundContent ?? '暂无数据'}
                                    </div>
                                ) : filteredOptions.map((option) => (
                                    <RadixSelect.Item
                                        key={option.key}
                                        value={toRadixValue(option.key)}
                                        className="animal-select-item"
                                        onPointerMove={() => { keepSearchFocus.current = false; }}
                                        onPointerDown={() => { keepSearchFocus.current = false; }}
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
