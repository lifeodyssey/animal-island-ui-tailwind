import React, { useState, useRef, useEffect, useId, useCallback, useMemo } from 'react';
import { cn } from '../../utils/cn';
import { useControllableState } from '../../utils/useControllableState';

export type SelectOption = {
    key: string;
    label: string;
};

export interface SelectProps {
    options: SelectOption[];
    /** Controlled value */
    value?: string;
    /** Uncontrolled default value */
    defaultValue?: string;
    onChange?: (key: string) => void;
    placeholder?: string;
    disabled?: boolean;
    /** Show a one-click clear button (visible on hover when a value is selected) */
    allowClear?: boolean;
    /** Callback after clearing */
    onClear?: () => void;
    /** Accessible label for the clear button, defaults to "清除" */
    clearAriaLabel?: string;
    /** Show a search input inside the trigger */
    showSearch?: boolean;
    /** Filter rule: true = filter by optionFilterProp, false = no filter, function = custom */
    filterOption?: boolean | ((inputValue: string, option: SelectOption) => boolean);
    /** Field used when filterOption is true, defaults to 'label' */
    optionFilterProp?: 'key' | 'label';
    /** Callback when search term changes */
    onSearch?: (value: string) => void;
    /** Content shown when no options match, defaults to "暂无数据" */
    notFoundContent?: React.ReactNode;
    /** Accessible label when there is no visible label */
    'aria-label'?: string;
    /** ID of an external visible label */
    'aria-labelledby'?: string;
    className?: string;
    style?: React.CSSProperties;
}

export const Select: React.FC<SelectProps> = ({
    options,
    value: valueProp,
    defaultValue = '',
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
    style,
}) => {
    const { value, setValue } = useControllableState<string>({
        value: valueProp,
        defaultValue,
        onChange,
    });

    const [open, setOpen] = useState(false);
    const [activeKey, setActiveKey] = useState<string | null>(null);
    // null = not searching (input echoes selected label); string = user is searching
    const [searchValue, setSearchValue] = useState<string | null>(null);
    const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
    const [mounted, setMounted] = useState(false);
    // Clear button visible only while hovering
    const [hovered, setHovered] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLInputElement>(null);

    const currentLabel = options.find((o) => o.key === value)?.label || placeholder;
    const labelForInput = value ? (options.find((o) => o.key === value)?.label || '') : '';

    const idPrefix = `animal-select-${useId().replace(/:/g, '')}`;
    const listboxId = `${idPrefix}-listbox`;
    const optionId = (k: string) => `${idPrefix}-option-${k}`;

    const filteredOptions = useMemo(() => {
        if (!showSearch || !filterOption || !searchValue) return options;
        const matcher =
            typeof filterOption === 'function'
                ? filterOption
                : (inputValue: string, option: SelectOption) =>
                      option[optionFilterProp].toLowerCase().includes(inputValue.toLowerCase());
        return options.filter((option) => matcher(searchValue, option));
    }, [options, showSearch, filterOption, optionFilterProp, searchValue]);

    const closeDropdown = useCallback(() => {
        setOpen(false);
        setMounted(false);
        if (searchValue) onSearch?.('');
        setSearchValue(null);
    }, [searchValue, onSearch]);

    const focusTrigger = useCallback(() => {
        if (showSearch) searchRef.current?.focus();
        else triggerRef.current?.focus();
    }, [showSearch]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                closeDropdown();
            }
        };
        if (open) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [open, closeDropdown]);

    useEffect(() => {
        if (!open) return;
        setMounted(true);
        const wrapper = wrapperRef.current;
        if (!wrapper) return;
        const rect = wrapper.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;
        const dropdownHeight = Math.min(filteredOptions.length * 44 + 24, 300);
        if (spaceBelow >= dropdownHeight || spaceBelow >= spaceAbove) {
            setDropdownStyle({ position: 'absolute', top: '100%', left: 0, marginTop: 6, minWidth: '100%' });
        } else {
            setDropdownStyle({ position: 'absolute', bottom: '100%', left: 0, marginBottom: 6, minWidth: '100%' });
        }
    }, [open, filteredOptions.length]);

    useEffect(() => {
        if (!open) { setActiveKey(null); return; }
        const selected = options.find((o) => o.key === value);
        setActiveKey(selected?.key ?? (options[0]?.key ?? null));
    }, [open, options.length]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (!showSearch) return;
        const input = searchRef.current;
        if (!input) return;
        if (searchValue !== null) return;
        if (open) {
            input.focus();
        }
    }, [open, showSearch, searchValue, value]);

    const handleSelect = useCallback(
        (key: string) => {
            setValue(key);
            closeDropdown();
            focusTrigger();
        },
        [setValue, closeDropdown, focusTrigger],
    );

    const moveActive = (delta: 1 | -1) => {
        if (!filteredOptions.length) return;
        const idx = filteredOptions.findIndex((o) => o.key === activeKey);
        const nextIdx =
            idx < 0
                ? delta === 1
                    ? 0
                    : filteredOptions.length - 1
                : (idx + delta + filteredOptions.length) % filteredOptions.length;
        setActiveKey(filteredOptions[nextIdx].key);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (disabled) return;
        const fromControl = e.target === triggerRef.current || e.target === searchRef.current;
        if (!fromControl) return;
        const { key } = e;
        if (!open) {
            if (key === 'Enter' || key === ' ' || key === 'ArrowDown' || key === 'ArrowUp') {
                e.preventDefault();
                setOpen(true);
            }
            return;
        }
        if (key === 'Escape') {
            e.preventDefault();
            if (showSearch && searchValue) {
                setSearchValue(null);
                onSearch?.('');
                return;
            }
            closeDropdown();
            focusTrigger();
        } else if (key === 'ArrowDown') {
            e.preventDefault();
            moveActive(1);
        } else if (key === 'ArrowUp') {
            e.preventDefault();
            moveActive(-1);
        } else if (key === 'Home') {
            e.preventDefault();
            if (filteredOptions[0]) setActiveKey(filteredOptions[0].key);
        } else if (key === 'End') {
            e.preventDefault();
            if (filteredOptions.length) setActiveKey(filteredOptions[filteredOptions.length - 1].key);
        } else if (key === 'Enter' || (key === ' ' && !showSearch)) {
            e.preventDefault();
            if (activeKey && filteredOptions.some((o) => o.key === activeKey)) handleSelect(activeKey);
        }
    };

    const showClear = allowClear && Boolean(value) && !disabled && hovered;

    const comboboxA11y: React.AriaAttributes = {
        'aria-haspopup': 'listbox',
        'aria-expanded': open,
        'aria-controls': open ? listboxId : undefined,
        'aria-activedescendant': open && activeKey ? optionId(activeKey) : undefined,
        'aria-label': ariaLabel,
        'aria-labelledby': ariaLabelledBy,
    };

    return (
        <div
            ref={wrapperRef}
            className={cn('animal-select-wrapper', disabled && 'animal-select-disabled', className)}
            style={style}
            onKeyDown={handleKeyDown}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div
                ref={triggerRef}
                className={cn('animal-select-trigger', open && 'animal-select-trigger--open')}
                onClick={(e) => {
                    if (disabled) return;
                    if (e.target === searchRef.current && open) return;
                    if (open) closeDropdown();
                    else setOpen(true);
                }}
                role={showSearch ? undefined : 'combobox'}
                tabIndex={showSearch || disabled ? undefined : 0}
                aria-disabled={showSearch ? undefined : disabled || undefined}
                {...(showSearch ? {} : comboboxA11y)}
            >
                {showSearch ? (
                    <input
                        ref={searchRef}
                        className="animal-select-search"
                        role="combobox"
                        aria-autocomplete="list"
                        aria-disabled={disabled || undefined}
                        {...comboboxA11y}
                        value={open ? (searchValue ?? labelForInput) : labelForInput}
                        placeholder={placeholder}
                        disabled={disabled}
                        autoComplete="off"
                        onChange={(e) => {
                            const next = e.target.value;
                            // When the input is echoing the selected label and the user types,
                            // treat the typed characters as a fresh query (strip the label prefix).
                            const editingLabel =
                                searchValue === null &&
                                Boolean(value) &&
                                labelForInput !== '' &&
                                next.startsWith(labelForInput);
                            const query = editingLabel ? next.slice(labelForInput.length) : next;
                            setSearchValue(query);
                            onSearch?.(query);
                            if (!open) setOpen(true);
                        }}
                    />
                ) : (
                    <span className={value ? 'animal-select-value' : 'animal-select-placeholder'}>{currentLabel}</span>
                )}
                {showClear && (
                    <button
                        type="button"
                        className="animal-select-clear"
                        aria-label={clearAriaLabel}
                        onClick={(e) => {
                            e.stopPropagation();
                            setValue('');
                            onClear?.();
                            focusTrigger();
                        }}
                        onMouseDown={(e) => e.preventDefault()}
                    >
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                            <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                    </button>
                )}
                <span className="animal-select-arrow" aria-hidden>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path
                            d="M3 4.5L6 7.5L9 4.5"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </span>
            </div>
            {open && mounted && (
                <div
                    className="animal-select-dropdown"
                    style={dropdownStyle}
                    role="listbox"
                    id={listboxId}
                    aria-label={ariaLabel}
                    aria-labelledby={ariaLabelledBy}
                >
                    {filteredOptions.length === 0 ? (
                        <div className="animal-select-not-found" role="option" aria-disabled="true" aria-selected="false">
                            {notFoundContent}
                        </div>
                    ) : (
                        filteredOptions.map((option) => {
                            const selected = value === option.key;
                            return (
                                <div
                                    key={option.key}
                                    id={optionId(option.key)}
                                    role="option"
                                    aria-selected={selected}
                                    className={cn(
                                        'animal-select-item',
                                        (selected || option.key === activeKey) && 'animal-select-item--active',
                                    )}
                                    onClick={() => handleSelect(option.key)}
                                    onMouseEnter={() => setActiveKey(option.key)}
                                >
                                    <span className="animal-select-item-dot" aria-hidden />
                                    {option.label}
                                    {selected && <div className="animal-select-item-pill" />}
                                </div>
                            );
                        })
                    )}
                </div>
            )}
        </div>
    );
};

Select.displayName = 'Select';
