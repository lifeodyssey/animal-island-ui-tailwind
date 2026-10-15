import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import { cn } from '../../utils/cn';
import { useControllableState } from '../../utils/useControllableState';

export type SelectOption = {
    key: string;
    label: string;
};

export interface SelectProps {
    options: SelectOption[];
    value?: string;
    defaultValue?: string;
    onChange?: (key: string) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
    /** Show a clear button when a value is selected */
    allowClear?: boolean;
    /** Called when the clear button is clicked */
    onClear?: () => void;
    /** aria-label for the clear button */
    clearAriaLabel?: string;
    /** Show a search input inside the dropdown */
    showSearch?: boolean;
    /** Custom filter function; receives the search string and option */
    filterOption?: (inputValue: string, option: SelectOption) => boolean;
    /** Which option field to filter on; defaults to 'label' */
    optionFilterProp?: 'key' | 'label';
    /** Called on each search input change */
    onSearch?: (value: string) => void;
    /** Content rendered when no options match the search */
    notFoundContent?: React.ReactNode;
    'aria-label'?: string;
    'aria-labelledby'?: string;
}

const defaultFilterOption = (
    input: string,
    option: SelectOption,
    prop: 'key' | 'label',
): boolean => option[prop].toLowerCase().includes(input.toLowerCase());

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
            allowClear = false,
            onClear,
            clearAriaLabel = '清除',
            showSearch = false,
            filterOption,
            optionFilterProp = 'label',
            onSearch,
            notFoundContent = '暂无数据',
            'aria-label': ariaLabel,
            'aria-labelledby': ariaLabelledby,
        },
        ref,
    ) => {
        const { value: currentValue, setValue: handleChange } = useControllableState<string>({
            value,
            defaultValue: defaultValue ?? '',
            onChange,
        });

        const [open, setOpen] = useState(false);
        const [searchText, setSearchText] = useState('');
        const [activeIndex, setActiveIndex] = useState(-1);
        const [dropdownLeft, setDropdownLeft] = useState(0);

        const wrapperRef = useRef<HTMLDivElement>(null);
        const searchRef = useRef<HTMLInputElement>(null);
        const listRef = useRef<HTMLUListElement>(null);

        const uid = useId();
        const listboxId = `animal-select-listbox-${uid.replace(/:/g, '')}`;

        const selectedOption = options.find((o) => o.key === currentValue);

        const filteredOptions = showSearch && searchText
            ? options.filter((opt) =>
                filterOption
                    ? filterOption(searchText, opt)
                    : defaultFilterOption(searchText, opt, optionFilterProp)
            )
            : options;

        const openDropdown = useCallback(() => {
            if (disabled) return;
            setOpen(true);
            setSearchText('');
            setActiveIndex(-1);
        }, [disabled]);

        const closeDropdown = useCallback(() => {
            setOpen(false);
            setSearchText('');
            setActiveIndex(-1);
        }, []);

        const selectOption = useCallback((opt: SelectOption) => {
            handleChange(opt.key);
            closeDropdown();
        }, [handleChange, closeDropdown]);

        const handleClear = useCallback((e: React.MouseEvent) => {
            e.stopPropagation();
            handleChange('');
            onClear?.();
        }, [handleChange, onClear]);

        const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
            const v = e.target.value;
            setSearchText(v);
            setActiveIndex(-1);
            onSearch?.(v);
        }, [onSearch]);

        // Close on outside click
        useEffect(() => {
            if (!open) return;
            const onPointerDown = (e: PointerEvent) => {
                if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                    closeDropdown();
                }
            };
            document.addEventListener('pointerdown', onPointerDown);
            return () => document.removeEventListener('pointerdown', onPointerDown);
        }, [open, closeDropdown]);

        // Collision detection: ensure glove has room on the left side
        useEffect(() => {
            if (!open || !wrapperRef.current) return;
            const rect = wrapperRef.current.getBoundingClientRect();
            setDropdownLeft(Math.max(0, 30 - rect.left));
        }, [open]);

        // Focus search input when opened
        useEffect(() => {
            if (open && showSearch) {
                requestAnimationFrame(() => searchRef.current?.focus());
            }
        }, [open, showSearch]);

        // Scroll active item into view
        useEffect(() => {
            if (activeIndex < 0 || !listRef.current) return;
            const items = listRef.current.querySelectorAll<HTMLElement>('[role="option"]');
            items[activeIndex]?.scrollIntoView({ block: 'nearest' });
        }, [activeIndex]);

        const handleTriggerKeyDown = useCallback((e: React.KeyboardEvent) => {
            if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
                e.preventDefault();
                openDropdown();
                setActiveIndex(0);
            }
        }, [openDropdown]);

        const handleListKeyDown = useCallback((e: React.KeyboardEvent) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                closeDropdown();
                return;
            }
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setActiveIndex((i) => Math.min(i + 1, filteredOptions.length - 1));
                return;
            }
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                setActiveIndex((i) => Math.max(i - 1, 0));
                return;
            }
            if (e.key === 'Enter' && activeIndex >= 0 && filteredOptions[activeIndex]) {
                e.preventDefault();
                selectOption(filteredOptions[activeIndex]);
                return;
            }
            if (e.key === 'Tab') {
                closeDropdown();
            }
        }, [activeIndex, filteredOptions, selectOption, closeDropdown]);

        const activeId = activeIndex >= 0 && filteredOptions[activeIndex]
            ? `${listboxId}-opt-${activeIndex}`
            : undefined;

        const showClear = allowClear && !!currentValue && !disabled;

        return (
            <div
                ref={wrapperRef}
                className={cn('animal-select-wrapper', disabled && 'animal-select-disabled')}
                onKeyDown={open ? handleListKeyDown : undefined}
            >
                <button
                    ref={ref}
                    type="button"
                    className={cn('animal-select-trigger', className)}
                    disabled={disabled}
                    role="combobox"
                    data-state={open ? 'open' : 'closed'}
                    aria-haspopup="listbox"
                    aria-expanded={open}
                    aria-controls={listboxId}
                    aria-label={ariaLabel}
                    aria-labelledby={ariaLabelledby}
                    aria-activedescendant={open ? activeId : undefined}
                    onClick={() => (open ? closeDropdown() : openDropdown())}
                    onKeyDown={handleTriggerKeyDown}
                >
                    <span className={selectedOption ? 'animal-select-value' : 'animal-select-placeholder'}>
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                    {showClear && (
                        <span
                            role="button"
                            tabIndex={0}
                            className="animal-select-clear"
                            aria-label={clearAriaLabel}
                            onClick={handleClear}
                            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleChange(''); onClear?.(); } }}
                        >
                            ×
                        </span>
                    )}
                    {!showClear && (
                        <span className="animal-select-arrow" aria-hidden="true">
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </span>
                    )}
                </button>

                {open && (
                    <div
                        className="animal-select-content"
                        style={dropdownLeft > 0 ? { left: dropdownLeft } : undefined}
                    >
                        {showSearch && (
                            <div className="animal-select-search">
                                <input
                                    ref={searchRef}
                                    type="text"
                                    className="animal-select-search-input"
                                    value={searchText}
                                    onChange={handleSearchChange}
                                    placeholder="搜索..."
                                    aria-label="搜索选项"
                                    aria-controls={listboxId}
                                    aria-activedescendant={activeId}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Escape') { closeDropdown(); return; }
                                        handleListKeyDown(e);
                                    }}
                                />
                            </div>
                        )}
                        <ul
                            ref={listRef}
                            id={listboxId}
                            role="listbox"
                            className="animal-select-dropdown"
                            aria-label={ariaLabel}
                            aria-labelledby={ariaLabelledby}
                        >
                            {filteredOptions.length === 0 ? (
                                <li className="animal-select-not-found" aria-live="polite">
                                    {notFoundContent}
                                </li>
                            ) : (
                                filteredOptions.map((opt, idx) => {
                                    const isSelected = opt.key === currentValue;
                                    const isActive = idx === activeIndex;
                                    return (
                                        <li
                                            key={opt.key}
                                            id={`${listboxId}-opt-${idx}`}
                                            role="option"
                                            aria-selected={isSelected}
                                            className={cn(
                                                'animal-select-item',
                                                isSelected && 'animal-select-item-selected',
                                                isActive && 'animal-select-item-active',
                                            )}
                                            onPointerDown={(e) => { e.preventDefault(); selectOption(opt); }}
                                        >
                                            {isSelected && (
                                                <span className="animal-select-item-indicator" aria-hidden="true">
                                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                                        <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                    </svg>
                                                </span>
                                            )}
                                            {opt.label}
                                        </li>
                                    );
                                })
                            )}
                        </ul>
                    </div>
                )}
            </div>
        );
    },
);

Select.displayName = 'Select';
