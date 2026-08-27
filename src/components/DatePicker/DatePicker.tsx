import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import { cn } from '../../utils/cn';
import { cva } from 'class-variance-authority';

export type DatePickerSize = 'small' | 'middle' | 'large';
export type DatePickerStatus = 'error' | 'warning';

/** 选中值：日期模式为 YYYY-MM-DD，范围模式为 [开始, 结束]，清空为 null */
export type DatePickerValue = string | [string, string] | null;

export interface DatePickerProps {
    range?: boolean;
    picker?: 'date' | 'month';
    value?: DatePickerValue;
    defaultValue?: string | [string, string];
    onChange?: (value: DatePickerValue) => void;
    placeholder?: string;
    disabled?: boolean;
    allowClear?: boolean;
    size?: DatePickerSize;
    status?: DatePickerStatus;
    format?: string;
    disabledDate?: (date: Date) => boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    showToday?: boolean;
    'aria-label'?: string;
    'aria-labelledby'?: string;
    className?: string;
    style?: React.CSSProperties;
}

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];
const MONTHS = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];

const ChevronLeft = (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
        <path d="M7.5 2.5L4 6l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const ChevronRight = (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
        <path d="M4.5 2.5L8 6l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const DoubleChevronLeft = (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
        <path d="M9 3L5 8l4 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M13 3L9 8l4 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const DoubleChevronRight = (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
        <path d="M7 3l4 5-4 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3 3l4 5-4 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const pad = (n: number) => `${n}`.padStart(2, '0');

const parseValue = (value: string | null | undefined): Date | null => {
    if (!value) return null;
    const match = /^(\d{4})-(\d{1,2})(?:-(\d{1,2}))?$/.exec(value);
    if (!match || Number(match[2]) > 12) return null;
    const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3] ?? 1));
    return Number.isNaN(date.getTime()) ? null : date;
};

const toValue = (date: Date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const toMonthValue = (date: Date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}`;

const formatDate = (date: Date, format: string) =>
    format
        .replace('YYYY', `${date.getFullYear()}`)
        .replace('MM', pad(date.getMonth() + 1))
        .replace('DD', pad(date.getDate()))
        .replace('M', `${date.getMonth() + 1}`)
        .replace('D', `${date.getDate()}`);

const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

const isSameMonth = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();

const parseRange = (value: DatePickerValue): [Date, Date] | null => {
    if (!value || typeof value === 'string') return null;
    const start = parseValue(value[0]);
    const end = parseValue(value[1]);
    return start && end ? [start, end] : null;
};

const CLOSE_ANIMATION_MS = 200;

const triggerVariants = cva('animal-date-picker-trigger', {
    variants: {
        size: {
            small: 'animal-date-picker-trigger-small',
            middle: 'animal-date-picker-trigger-middle',
            large: 'animal-date-picker-trigger-large',
        },
        status: {
            error: 'animal-date-picker-trigger-error',
            warning: 'animal-date-picker-trigger-warning',
        },
        open: { true: 'animal-date-picker-trigger-open' },
    },
    defaultVariants: { size: 'middle' },
});

export const DatePicker: React.FC<DatePickerProps> = ({
    value,
    defaultValue,
    onChange,
    range = false,
    picker = 'date',
    placeholder = '请选择日期',
    disabled = false,
    allowClear = false,
    size = 'middle',
    status,
    format = picker === 'month' ? 'YYYY-MM' : 'YYYY-MM-DD',
    disabledDate,
    open: openProp,
    onOpenChange,
    showToday = true,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    className,
    style,
}) => {
    const [innerValue, setInnerValue] = useState<DatePickerValue>(defaultValue ?? null);
    const [innerOpen, setInnerOpen] = useState(false);
    const [viewDate, setViewDate] = useState(
        () => parseValue(typeof defaultValue === 'string' ? defaultValue : null) ?? new Date()
    );
    const [mode, setMode] = useState<'date' | 'month' | 'year'>('date');
    const [focusedDate, setFocusedDate] = useState(
        () => parseValue(typeof defaultValue === 'string' ? defaultValue : null) ?? new Date()
    );
    const [rangeStart, setRangeStart] = useState<Date | null>(null);
    const [rangeEnd, setRangeEnd] = useState<Date | null>(null);
    const [hoverDate, setHoverDate] = useState<Date | null>(null);
    const [pendingDate, setPendingDate] = useState<Date | null>(null);
    const [panelStyle, setPanelStyle] = useState<React.CSSProperties>({});
    const [mounted, setMounted] = useState(false);
    const [closing, setClosing] = useState(false);
    const closingRef = useRef(false);
    const closeTimerRef = useRef<number | null>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLDivElement>(null);

    const isControlled = value !== undefined;
    const currentValue: DatePickerValue = isControlled ? (value ?? null) : innerValue;
    const selectedDate = range ? null : parseValue(typeof currentValue === 'string' ? currentValue : null);
    const selectedRange = range ? parseRange(currentValue) : null;
    const open = openProp !== undefined ? openProp : innerOpen;

    const idPrefix = `animal-date-picker-${useId().replace(/:/g, '')}`;
    const panelId = `${idPrefix}-panel`;

    const valueRef = useRef(currentValue);
    useEffect(() => { valueRef.current = currentValue; }, [currentValue]);

    const setOpen = useCallback(
        (next: boolean) => {
            if (openProp === undefined) setInnerOpen(next);
            onOpenChange?.(next);
        },
        [openProp, onOpenChange]
    );

    const closePanel = useCallback(() => {
        if (closingRef.current) return;
        closingRef.current = true;
        setClosing(true);
        closeTimerRef.current = window.setTimeout(() => {
            closingRef.current = false;
            setClosing(false);
            setOpen(false);
            setMounted(false);
            setRangeStart(null);
            setRangeEnd(null);
            setHoverDate(null);
            setPendingDate(null);
        }, CLOSE_ANIMATION_MS);
    }, [setOpen]);

    useEffect(
        () => () => { if (closeTimerRef.current !== null) window.clearTimeout(closeTimerRef.current); },
        []
    );

    useEffect(() => {
        if (!open) return;
        if (closeTimerRef.current !== null) {
            window.clearTimeout(closeTimerRef.current);
            closeTimerRef.current = null;
        }
        closingRef.current = false;
        setClosing(false);
        const current = valueRef.current;
        const base = range
            ? (parseRange(current)?.[0] ?? new Date())
            : (parseValue(typeof current === 'string' ? current : null) ?? new Date());
        setViewDate(base);
        setFocusedDate(base);
        setMode(picker === 'month' && !range ? 'month' : 'date');
        setRangeStart(null);
        setRangeEnd(null);
        setHoverDate(null);
        setPendingDate(null);
    }, [open, range, picker]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) closePanel();
        };
        if (open) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [open, closePanel]);

    useEffect(() => {
        if (open && wrapperRef.current) {
            const rect = wrapperRef.current.getBoundingClientRect();
            const panelHeight = 340;
            const newStyle: React.CSSProperties = { position: 'absolute', left: 0 };
            if (rect.bottom + panelHeight > window.innerHeight && rect.top > window.innerHeight - rect.bottom) {
                newStyle.bottom = '100%';
                newStyle.marginBottom = '6px';
            } else {
                newStyle.top = '100%';
                newStyle.marginTop = '6px';
            }
            if (rect.left + (range ? 620 : 300) > window.innerWidth) {
                newStyle.right = 0;
                newStyle.left = 'auto';
            }
            setPanelStyle(newStyle);
            requestAnimationFrame(() => setMounted(true));
        } else if (!open) {
            setMounted(false);
        }
    }, [open, range]);

    const selectDate = useCallback(
        (date: Date) => {
            if (disabledDate?.(date)) return;
            if (!range) {
                setPendingDate(date);
                return;
            }
            if (!rangeStart) {
                setRangeStart(date);
                return;
            }
            if (date < rangeStart) {
                setRangeStart(date);
                return;
            }
            setRangeEnd(date);
        },
        [disabledDate, range, rangeStart]
    );

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!isControlled) setInnerValue(null);
        onChange?.(null);
        triggerRef.current?.focus();
    };

    const shiftView = (yearDelta: number, monthDelta = 0) => {
        setViewDate(new Date(viewDate.getFullYear() + yearDelta, viewDate.getMonth() + monthDelta, 1));
    };

    const handleToday = () => {
        const today = new Date();
        if (!range) {
            setViewDate(new Date(today.getFullYear(), today.getMonth(), 1));
            setFocusedDate(today);
            setMode(picker === 'month' ? 'month' : 'date');
            setPendingDate(today);
            return;
        }
        setViewDate(new Date(today.getFullYear(), today.getMonth(), 1));
        setFocusedDate(today);
        setRangeStart(null);
        setRangeEnd(null);
    };

    const confirmTime = () => {
        if (!range) {
            if (pendingDate) {
                const next = picker === 'month' ? toMonthValue(pendingDate) : toValue(pendingDate);
                if (!isControlled) setInnerValue(next);
                onChange?.(next);
            }
            closePanel();
            triggerRef.current?.focus();
            return;
        }
        if (rangeStart && rangeEnd) {
            const next: [string, string] = [toValue(rangeStart), toValue(rangeEnd)];
            if (!isControlled) setInnerValue(next);
            onChange?.(next);
        }
        closePanel();
        triggerRef.current?.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (disabled) return;
        const { key } = e;
        if (!open) {
            if (key === 'Enter' || key === ' ' || key === 'ArrowDown' || key === 'ArrowUp') {
                e.preventDefault();
                setOpen(true);
            }
            return;
        }
        if (key === 'Escape') { e.preventDefault(); closePanel(); triggerRef.current?.focus(); return; }
        if (key === 'Enter' || key === ' ') {
            e.preventDefault();
            if (mode === 'date') {
                if (disabledDate?.(focusedDate)) return;
                if (range) {
                    if (!rangeStart) { setRangeStart(focusedDate); }
                    else if (focusedDate < rangeStart) { setRangeStart(focusedDate); }
                    else { setRangeEnd(focusedDate); }
                    return;
                }
                setPendingDate(focusedDate);
            } else if (mode === 'month') {
                if (picker === 'month' && !range) {
                    setPendingDate(new Date(viewDate.getFullYear(), viewDate.getMonth(), 1));
                } else {
                    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth(), 1));
                    setFocusedDate(new Date(viewDate.getFullYear(), viewDate.getMonth(), 1));
                    setMode('date');
                }
            } else {
                setFocusedDate(new Date(viewDate.getFullYear(), viewDate.getMonth(), 1));
                setMode('month');
            }
            return;
        }
        if (key === 'ArrowLeft' || key === 'ArrowRight' || key === 'ArrowUp' || key === 'ArrowDown') {
            e.preventDefault();
            const delta = key === 'ArrowLeft' ? -1 : key === 'ArrowRight' ? 1 : key === 'ArrowUp' ? -7 : 7;
            if (mode === 'date') {
                const next = new Date(focusedDate.getFullYear(), focusedDate.getMonth(), focusedDate.getDate() + delta);
                setFocusedDate(next);
                if (!isSameMonth(next, viewDate)) setViewDate(new Date(next.getFullYear(), next.getMonth(), 1));
            } else if (mode === 'month') {
                const next = new Date(viewDate.getFullYear(), viewDate.getMonth() + delta, 1);
                setViewDate(next); setFocusedDate(next);
            } else {
                const next = new Date(viewDate.getFullYear() + delta, viewDate.getMonth(), 1);
                setViewDate(next); setFocusedDate(next);
            }
            return;
        }
        if (key === 'PageUp' || key === 'PageDown') {
            e.preventDefault();
            const delta = key === 'PageUp' ? -1 : 1;
            if (mode === 'date') {
                const next = new Date(viewDate.getFullYear(), viewDate.getMonth() + delta, 1);
                setViewDate(next);
                setFocusedDate(new Date(next.getFullYear(), next.getMonth(), focusedDate.getDate()));
            } else if (mode === 'month') {
                const next = new Date(viewDate.getFullYear() + delta, viewDate.getMonth(), 1);
                setViewDate(next); setFocusedDate(next);
            } else {
                const next = new Date(viewDate.getFullYear() + delta * 10, viewDate.getMonth(), 1);
                setViewDate(next); setFocusedDate(next);
            }
        }
    };

    const buildCells = (vDate: Date): Date[] => {
        const vYear = vDate.getFullYear();
        const vMonth = vDate.getMonth();
        const cells: Date[] = [];
        const startWeekday = new Date(vYear, vMonth, 1).getDay();
        const daysInMonth = new Date(vYear, vMonth + 1, 0).getDate();
        const daysInPrevMonth = new Date(vYear, vMonth, 0).getDate();
        for (let i = startWeekday - 1; i >= 0; i--) cells.push(new Date(vYear, vMonth - 1, daysInPrevMonth - i));
        for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(vYear, vMonth, d));
        for (let d = 1; cells.length < 42; d++) cells.push(new Date(vYear, vMonth + 1, d));
        return cells;
    };

    const today = new Date();

    const renderDayGrid = (vDate: Date) => {
        const vMonth = vDate.getMonth();
        return (
            <>
                <div className="animal-date-picker-week-row">
                    {WEEKDAYS.map((w) => (
                        <div key={w} className="animal-date-picker-week-cell">{w}</div>
                    ))}
                </div>
                <div className="animal-date-picker-grid">
                    {buildCells(vDate).map((cell) => {
                        const disabledCell = disabledDate?.(cell) === true;
                        const isToday = isSameDay(cell, today);
                        const outside = cell.getMonth() !== vMonth;
                        let selected = false;
                        let rangeStartCell = false;
                        let rangeEndCell = false;
                        let inRange = false;
                        if (range) {
                            let effStart: Date | null = null;
                            let effEnd: Date | null = null;
                            if (rangeStart) {
                                if (rangeEnd) {
                                    effStart = rangeStart;
                                    effEnd = rangeEnd;
                                } else if (hoverDate && hoverDate < rangeStart) {
                                    effStart = hoverDate;
                                    effEnd = rangeStart;
                                } else {
                                    effStart = rangeStart;
                                    effEnd = hoverDate && hoverDate > rangeStart ? hoverDate : rangeStart;
                                }
                            } else if (selectedRange) {
                                effStart = selectedRange[0];
                                effEnd = selectedRange[1];
                            }
                            if (effStart && effEnd) {
                                rangeStartCell = isSameDay(cell, effStart);
                                rangeEndCell = isSameDay(cell, effEnd);
                                inRange = cell > effStart && cell < effEnd;
                            }
                        } else {
                            const activeDate = pendingDate ?? selectedDate;
                            selected = !!activeDate && isSameDay(cell, activeDate);
                        }
                        return (
                            <button
                                key={cell.getTime()}
                                type="button"
                                className={cn(
                                    'animal-date-picker-day-cell',
                                    outside && 'animal-date-picker-day-cell-outside',
                                    !range && isToday && 'animal-date-picker-day-cell-today',
                                    selected && 'animal-date-picker-day-cell-selected',
                                    rangeStartCell && 'animal-date-picker-day-cell-range-start',
                                    rangeEndCell && 'animal-date-picker-day-cell-range-end',
                                    inRange && 'animal-date-picker-day-cell-in-range',
                                    disabledCell && 'animal-date-picker-day-cell-disabled',
                                )}
                                aria-label={`${cell.getFullYear()}年${cell.getMonth() + 1}月${cell.getDate()}日`}
                                aria-disabled={disabledCell || undefined}
                                disabled={disabledCell}
                                onClick={() => selectDate(cell)}
                                onMouseEnter={() => range && setHoverDate(cell)}
                                onMouseLeave={() => range && setHoverDate(null)}
                                onMouseDown={(e) => e.preventDefault()}
                            >
                                {cell.getDate()}
                            </button>
                        );
                    })}
                </div>
            </>
        );
    };

    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const startYear = Math.floor(year / 10) * 10;
    const yearCells = Array.from({ length: 12 }, (_, i) => startYear - 1 + i);

    return (
        <div
            ref={wrapperRef}
            className={cn('animal-date-picker', disabled && 'animal-date-picker-disabled', className)}
            style={style}
            onKeyDown={handleKeyDown}
            onBlur={(e) => {
                if (open && e.relatedTarget && !e.currentTarget.contains(e.relatedTarget as Node)) closePanel();
            }}
        >
            <div
                ref={triggerRef}
                role="combobox"
                aria-expanded={open}
                aria-haspopup="dialog"
                aria-controls={open ? panelId : undefined}
                aria-disabled={disabled || undefined}
                aria-label={ariaLabel}
                aria-labelledby={ariaLabelledBy}
                tabIndex={disabled ? -1 : 0}
                className={triggerVariants({ size, status, open: open || undefined })}
                onClick={() => !disabled && !closing && setOpen(!open)}
            >
                {range ? (
                    open && rangeStart ? (
                        <>
                            <span className="animal-date-picker-value">{formatDate(rangeStart, format)}</span>
                            <span className="animal-date-picker-range-divider" aria-hidden />
                            <span className={rangeEnd ? 'animal-date-picker-value' : 'animal-date-picker-placeholder'}>
                                {rangeEnd ? formatDate(rangeEnd, format) : placeholder}
                            </span>
                        </>
                    ) : selectedRange ? (
                        <>
                            <span className="animal-date-picker-value">{formatDate(selectedRange[0], format)}</span>
                            <span className="animal-date-picker-range-divider" aria-hidden />
                            <span className="animal-date-picker-value">{formatDate(selectedRange[1], format)}</span>
                        </>
                    ) : (
                        <span className="animal-date-picker-placeholder">{placeholder}</span>
                    )
                ) : (
                    <span className={currentValue || (open && pendingDate) ? 'animal-date-picker-value' : 'animal-date-picker-placeholder'}>
                        {open && pendingDate
                            ? formatDate(pendingDate, format)
                            : selectedDate
                              ? formatDate(selectedDate, format)
                              : placeholder}
                    </span>
                )}
                {allowClear && currentValue && !disabled && (
                    <button
                        type="button"
                        className="animal-date-picker-clear"
                        aria-label="清除日期"
                        onClick={handleClear}
                        onMouseDown={(e) => e.preventDefault()}
                    >
                        ×
                    </button>
                )}
                <span className="animal-date-picker-calendar-icon" aria-hidden>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <rect x="1.5" y="2.5" width="11" height="10" rx="2" stroke="currentColor" strokeWidth="1.4" />
                        <path d="M1.5 5.5h11" stroke="currentColor" strokeWidth="1.4" />
                        <path d="M4.7 1v2.4M9.3 1v2.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                    </svg>
                </span>
            </div>
            {open && (
                <div
                    id={panelId}
                    role="dialog"
                    aria-label={range ? '选择日期范围' : '选择日期'}
                    className={cn(
                        'animal-date-picker-panel',
                        range && 'animal-date-picker-panel-range',
                        closing ? 'animal-date-picker-panel-closing' : mounted ? 'animal-date-picker-panel-visible' : ''
                    )}
                    style={panelStyle}
                >
                    {range ? (
                        <>
                            <div className="animal-date-picker-range-panels">
                                {[viewDate, new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1)].map(
                                    (panelDate, idx) => (
                                        <div key={panelDate.getTime()} className="animal-date-picker-range-panel">
                                            <div className="animal-date-picker-header">
                                                <div className="animal-date-picker-header-group">
                                                    {idx === 0 && (
                                                        <button type="button" className="animal-date-picker-nav-btn" aria-label="上一年" onClick={() => shiftView(-1, 0)} onMouseDown={(e) => e.preventDefault()}>
                                                            {DoubleChevronLeft}
                                                        </button>
                                                    )}
                                                    {idx === 0 && (
                                                        <button type="button" className="animal-date-picker-nav-btn" aria-label="上个月" onClick={() => shiftView(0, -1)} onMouseDown={(e) => e.preventDefault()}>
                                                            {ChevronLeft}
                                                        </button>
                                                    )}
                                                </div>
                                                <span className="animal-date-picker-year-label">
                                                    {panelDate.getFullYear()}年{panelDate.getMonth() + 1}月
                                                </span>
                                                <div className="animal-date-picker-header-group">
                                                    {idx === 1 && (
                                                        <button type="button" className="animal-date-picker-nav-btn" aria-label="下个月" onClick={() => shiftView(0, 1)} onMouseDown={(e) => e.preventDefault()}>
                                                            {ChevronRight}
                                                        </button>
                                                    )}
                                                    {idx === 1 && (
                                                        <button type="button" className="animal-date-picker-nav-btn" aria-label="下一年" onClick={() => shiftView(1, 0)} onMouseDown={(e) => e.preventDefault()}>
                                                            {DoubleChevronRight}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                            {renderDayGrid(panelDate)}
                                        </div>
                                    )
                                )}
                            </div>
                            <div className="animal-date-picker-footer">
                                <button type="button" className="animal-date-picker-confirm-btn" onClick={confirmTime} onMouseDown={(e) => e.preventDefault()}>
                                    确定
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="animal-date-picker-header">
                                <div className="animal-date-picker-header-group">
                                    <button type="button" className="animal-date-picker-nav-btn" aria-label="上一年" onClick={() => (mode === 'year' ? shiftView(-10, 0) : shiftView(-1, 0))} onMouseDown={(e) => e.preventDefault()}>
                                        {DoubleChevronLeft}
                                    </button>
                                    {mode === 'date' && (
                                        <button type="button" className="animal-date-picker-nav-btn" aria-label="上个月" onClick={() => shiftView(0, -1)} onMouseDown={(e) => e.preventDefault()}>
                                            {ChevronLeft}
                                        </button>
                                    )}
                                </div>
                                {mode === 'date' && (
                                    <button type="button" className="animal-date-picker-label-btn" onClick={() => setMode('year')}>
                                        {year}年{month + 1}月
                                    </button>
                                )}
                                {mode === 'month' && (
                                    <button type="button" className="animal-date-picker-label-btn" onClick={() => setMode('year')}>
                                        {year}年
                                    </button>
                                )}
                                {mode === 'year' && (
                                    <span className="animal-date-picker-year-label">
                                        {startYear} - {startYear + 9}年
                                    </span>
                                )}
                                <div className="animal-date-picker-header-group">
                                    {mode === 'date' && (
                                        <button type="button" className="animal-date-picker-nav-btn" aria-label="下个月" onClick={() => shiftView(0, 1)} onMouseDown={(e) => e.preventDefault()}>
                                            {ChevronRight}
                                        </button>
                                    )}
                                    <button type="button" className="animal-date-picker-nav-btn" aria-label="下一年" onClick={() => (mode === 'year' ? shiftView(10, 0) : shiftView(1, 0))} onMouseDown={(e) => e.preventDefault()}>
                                        {DoubleChevronRight}
                                    </button>
                                </div>
                            </div>
                            {mode === 'date' && renderDayGrid(viewDate)}
                            {mode === 'month' && (
                                <div className="animal-date-picker-grid-3x4">
                                    {MONTHS.map((label, i) => {
                                        const activeDate = pendingDate ?? selectedDate;
                                        const sel = !!activeDate && activeDate.getFullYear() === year && activeDate.getMonth() === i;
                                        return (
                                            <button
                                                key={label}
                                                type="button"
                                                className={cn('animal-date-picker-month-cell', sel && 'animal-date-picker-month-cell-selected')}
                                                aria-label={`${i + 1}月`}
                                                onClick={() => {
                                                    if (picker === 'month' && !range) {
                                                        setPendingDate(new Date(year, i, 1));
                                                    } else {
                                                        setViewDate(new Date(year, i, 1));
                                                        setFocusedDate(new Date(year, i, 1));
                                                        setMode('date');
                                                    }
                                                }}
                                                onMouseDown={(e) => e.preventDefault()}
                                            >
                                                {label}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                            {mode === 'year' && (
                                <div className="animal-date-picker-grid-3x4">
                                    {yearCells.map((y) => {
                                        const sel = selectedDate?.getFullYear() === y;
                                        return (
                                            <button
                                                key={y}
                                                type="button"
                                                className={cn('animal-date-picker-year-cell', sel && 'animal-date-picker-year-cell-selected')}
                                                aria-label={`${y}年`}
                                                onClick={() => {
                                                    setViewDate(new Date(y, month, 1));
                                                    setFocusedDate(new Date(y, month, 1));
                                                    setMode('month');
                                                }}
                                                onMouseDown={(e) => e.preventDefault()}
                                            >
                                                {y}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                            {(mode === 'date' || (picker === 'month' && mode === 'month')) && (
                                <div className="animal-date-picker-footer">
                                    {showToday && (
                                        <button type="button" className="animal-date-picker-today-btn" onClick={handleToday} onMouseDown={(e) => e.preventDefault()}>
                                            今天
                                        </button>
                                    )}
                                    <button type="button" className="animal-date-picker-confirm-btn" onClick={confirmTime} onMouseDown={(e) => e.preventDefault()}>
                                        确定
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

DatePicker.displayName = 'DatePicker';
