import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import dayjs, { type Dayjs } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { cn } from '../../utils/cn';

dayjs.extend(customParseFormat);

export type DatePickerSize = 'small' | 'middle' | 'large';

export type DatePickerStatus = 'error' | 'warning';

/** 选中值：日期模式为 YYYY-MM-DD，范围模式为 [开始, 结束]，清空为 null */
export type DatePickerValue = string | [string, string] | null;

export interface DatePickerProps {
    /** 范围选择模式：联动选择开始日期与结束日期 */
    range?: boolean;
    /** 选择粒度：date 选择日期（YYYY-MM-DD），month 选择月份（YYYY-MM），面板直接打开月份网格 */
    picker?: 'date' | 'month';
    /** 当前选中值（受控）；日期模式为 YYYY-MM-DD，范围模式为 [开始, 结束]，清空为 null */
    value?: DatePickerValue;
    /** 默认选中值（非受控）；日期模式为 YYYY-MM-DD，范围模式为 [开始, 结束] */
    defaultValue?: string | [string, string];
    /** 值变化回调；日期模式返回 YYYY-MM-DD，范围模式返回 [开始, 结束]，清空返回 null */
    onChange?: (value: DatePickerValue) => void;
    /** 占位文本 */
    placeholder?: string;
    /** 是否禁用 */
    disabled?: boolean;
    /** 是否允许一键清空 */
    allowClear?: boolean;
    /** 尺寸 */
    size?: DatePickerSize;
    /** 校验状态 */
    status?: DatePickerStatus;
    /** 展示格式，支持 YYYY / MM / DD / M / D 占位符，默认 YYYY-MM-DD */
    format?: string;
    /** 禁用日期判断函数，返回 true 的日期不可选 */
    disabledDate?: (date: Date) => boolean;
    /** 受控展开状态 */
    open?: boolean;
    /** 展开状态变化回调 */
    onOpenChange?: (open: boolean) => void;
    /** 面板底部是否显示「今天」快捷按钮 */
    showToday?: boolean;
    /** 对外暴露的无障碍标签（无可见 label 时使用） */
    'aria-label'?: string;
    /** 关联外部可见 label 的 id */
    'aria-labelledby'?: string;
    /** 额外类名 */
    className?: string;
    /** 行内样式 */
    style?: React.CSSProperties;
}

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];
const MONTHS = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
const GRID_CELLS = 42;

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
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
        <path d="M8 2.5L4.5 6 8 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 2.5L1.5 6 5 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);
const DoubleChevronRight = (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
        <path d="M4 2.5L7.5 6 4 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7 2.5L10.5 6 7 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const parseValue = (value: string | null | undefined): Dayjs | null => {
    if (!value) return null;
    const d = dayjs(value, ['YYYY-MM-DD', 'YYYY-MM'], true);
    return d.isValid() ? d : null;
};

const toValue = (date: Dayjs) => date.format('YYYY-MM-DD');
const toMonthValue = (date: Dayjs) => date.format('YYYY-MM');

const parseRange = (value: DatePickerValue): [Dayjs, Dayjs] | null => {
    if (!value || typeof value === 'string') return null;
    const start = parseValue(value[0]);
    const end = parseValue(value[1]);
    return start && end ? [start, end] : null;
};

const CLOSE_ANIMATION_MS = 200;

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
    const [viewDate, setViewDate] = useState<Dayjs>(
        () => parseValue(typeof defaultValue === 'string' ? defaultValue : null) ?? dayjs()
    );
    const [mode, setMode] = useState<'date' | 'month' | 'year'>('date');
    const [focusedDate, setFocusedDate] = useState<Dayjs>(
        () => parseValue(typeof defaultValue === 'string' ? defaultValue : null) ?? dayjs()
    );
    const [rangeStart, setRangeStart] = useState<Dayjs | null>(null);
    const [rangeEnd, setRangeEnd] = useState<Dayjs | null>(null);
    const [hoverDate, setHoverDate] = useState<Dayjs | null>(null);
    const [pendingDate, setPendingDate] = useState<Dayjs | null>(null);
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
    useEffect(() => {
        valueRef.current = currentValue;
    }, [currentValue]);

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
        () => () => {
            if (closeTimerRef.current !== null) window.clearTimeout(closeTimerRef.current);
        },
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
            ? (parseRange(current)?.[0] ?? dayjs())
            : (parseValue(typeof current === 'string' ? current : null) ?? dayjs());
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
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                closePanel();
            }
        };
        if (open) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [open, closePanel]);

    useEffect(() => {
        if (open && wrapperRef.current) {
            const rect = wrapperRef.current.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const panelHeight = 340;
            const newStyle: React.CSSProperties = { position: 'absolute', left: 0 };
            if (rect.bottom + panelHeight > viewportHeight && rect.top > viewportHeight - rect.bottom) {
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
        (date: Dayjs) => {
            if (disabledDate?.(date.toDate())) return;
            if (!range) {
                setPendingDate(date);
                return;
            }
            if (!rangeStart) {
                setRangeStart(date);
                return;
            }
            if (date.isBefore(rangeStart, 'day')) {
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
        setViewDate(viewDate.add(yearDelta, 'year').add(monthDelta, 'month').startOf('month'));
    };

    const handleToday = () => {
        const today = dayjs();
        if (!range) {
            setViewDate(today.startOf('month'));
            setFocusedDate(today);
            setMode(picker === 'month' ? 'month' : 'date');
            setPendingDate(today);
            return;
        }
        setViewDate(today.startOf('month'));
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
        if (key === 'Escape') {
            e.preventDefault();
            closePanel();
            triggerRef.current?.focus();
            return;
        }
        if (key === 'Enter' || key === ' ') {
            e.preventDefault();
            if (mode === 'date') {
                if (disabledDate?.(focusedDate.toDate())) return;
                if (range) {
                    if (!rangeStart) {
                        setRangeStart(focusedDate);
                    } else if (focusedDate.isBefore(rangeStart, 'day')) {
                        setRangeStart(focusedDate);
                    } else {
                        setRangeEnd(focusedDate);
                    }
                    return;
                }
                setPendingDate(focusedDate);
            } else if (mode === 'month') {
                if (picker === 'month' && !range) {
                    setPendingDate(viewDate.startOf('month'));
                } else {
                    const d = viewDate.startOf('month');
                    setViewDate(d);
                    setFocusedDate(d);
                    setMode('date');
                }
            } else {
                setFocusedDate(viewDate.startOf('month'));
                setMode('month');
            }
            return;
        }
        if (key === 'ArrowLeft' || key === 'ArrowRight' || key === 'ArrowUp' || key === 'ArrowDown') {
            e.preventDefault();
            const delta = key === 'ArrowLeft' ? -1 : key === 'ArrowRight' ? 1 : key === 'ArrowUp' ? -7 : 7;
            if (mode === 'date') {
                const next = focusedDate.add(delta, 'day');
                setFocusedDate(next);
                if (!next.isSame(viewDate, 'month')) setViewDate(next.startOf('month'));
            } else if (mode === 'month') {
                const next = viewDate.add(delta, 'month').startOf('month');
                setViewDate(next);
                setFocusedDate(next);
            } else {
                const next = viewDate.add(delta, 'year').startOf('month');
                setViewDate(next);
                setFocusedDate(next);
            }
            return;
        }
        if (key === 'PageUp' || key === 'PageDown') {
            e.preventDefault();
            const delta = key === 'PageUp' ? -1 : 1;
            if (mode === 'date') {
                const next = viewDate.add(delta, 'month').startOf('month');
                setViewDate(next);
                setFocusedDate(next.date(focusedDate.date()));
            } else if (mode === 'month') {
                const next = viewDate.add(delta, 'year').startOf('month');
                setViewDate(next);
                setFocusedDate(next);
            } else {
                const next = viewDate.add(delta * 10, 'year').startOf('month');
                setViewDate(next);
                setFocusedDate(next);
            }
        }
    };

    const buildCells = (vDate: Dayjs): Dayjs[] => {
        const cells: Dayjs[] = [];
        const startOfMonth = vDate.startOf('month');
        const startWeekday = startOfMonth.day();
        const daysInMonth = vDate.daysInMonth();
        const prevMonth = vDate.subtract(1, 'month');
        const daysInPrevMonth = prevMonth.daysInMonth();
        for (let i = startWeekday - 1; i >= 0; i--) cells.push(prevMonth.date(daysInPrevMonth - i));
        for (let d = 1; d <= daysInMonth; d++) cells.push(startOfMonth.date(d));
        const nextMonth = vDate.add(1, 'month');
        for (let d = 1; cells.length < GRID_CELLS; d++) cells.push(nextMonth.date(d));
        return cells;
    };

    const today = dayjs();

    const renderDayGrid = (vDate: Dayjs) => {
        return (
            <>
                <div className="animal-datepicker-week-row">
                    {WEEKDAYS.map((w) => (
                        <div key={w} className="animal-datepicker-week-cell">{w}</div>
                    ))}
                </div>
                <div className="animal-datepicker-grid">
                    {buildCells(vDate).map((cell) => {
                        const disabledCell = disabledDate?.(cell.toDate()) === true;
                        const isToday = cell.isSame(today, 'day');
                        const outside = !cell.isSame(vDate, 'month');
                        let selected = false;
                        let rangeStartCell = false;
                        let rangeEndCell = false;
                        let inRange = false;
                        if (range) {
                            let effStart: Dayjs | null = null;
                            let effEnd: Dayjs | null = null;
                            if (rangeStart) {
                                if (rangeEnd) {
                                    effStart = rangeStart;
                                    effEnd = rangeEnd;
                                } else if (hoverDate && hoverDate.isBefore(rangeStart, 'day')) {
                                    effStart = hoverDate;
                                    effEnd = rangeStart;
                                } else {
                                    effStart = rangeStart;
                                    effEnd = hoverDate && hoverDate.isAfter(rangeStart, 'day') ? hoverDate : rangeStart;
                                }
                            } else if (selectedRange) {
                                effStart = selectedRange[0];
                                effEnd = selectedRange[1];
                            }
                            if (effStart && effEnd) {
                                rangeStartCell = cell.isSame(effStart, 'day');
                                rangeEndCell = cell.isSame(effEnd, 'day');
                                inRange = cell.isAfter(effStart, 'day') && cell.isBefore(effEnd, 'day');
                            }
                        } else {
                            const activeDate = pendingDate ?? selectedDate;
                            selected = !!activeDate && cell.isSame(activeDate, 'day');
                        }
                        return (
                            <button
                                key={cell.valueOf()}
                                type="button"
                                className={cn(
                                    'animal-datepicker-day-cell',
                                    outside && 'animal-datepicker-day-outside',
                                    !range && isToday && 'animal-datepicker-day-today',
                                    selected && 'animal-datepicker-day-selected',
                                    rangeStartCell && 'animal-datepicker-day-range-start',
                                    rangeEndCell && 'animal-datepicker-day-range-end',
                                    inRange && 'animal-datepicker-day-in-range',
                                    disabledCell && 'animal-datepicker-day-disabled'
                                )}
                                aria-label={`${cell.year()}年${cell.month() + 1}月${cell.date()}日`}
                                aria-disabled={disabledCell || undefined}
                                disabled={disabledCell}
                                onClick={() => selectDate(cell)}
                                onMouseEnter={() => range && setHoverDate(cell)}
                                onMouseLeave={() => range && setHoverDate(null)}
                                onMouseDown={(e) => e.preventDefault()}
                            >
                                {cell.date()}
                            </button>
                        );
                    })}
                </div>
            </>
        );
    };

    const year = viewDate.year();
    const month = viewDate.month();
    const startYear = Math.floor(year / 10) * 10;
    const yearCells = Array.from({ length: 12 }, (_, i) => startYear - 1 + i);

    return (
        <div
            ref={wrapperRef}
            className={cn('animal-datepicker-wrapper', disabled && 'animal-datepicker-wrapper-disabled', className)}
            style={style}
            onKeyDown={handleKeyDown}
            onBlur={(e) => {
                if (open && e.relatedTarget && !e.currentTarget.contains(e.relatedTarget as Node)) {
                    closePanel();
                }
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
                className={cn(
                    'animal-datepicker-trigger',
                    `animal-datepicker-trigger-${size}`,
                    status && `animal-datepicker-trigger-${status}`,
                    open && 'animal-datepicker-trigger-open'
                )}
                onClick={() => !disabled && !closing && setOpen(!open)}
            >
                {range ? (
                    open && rangeStart ? (
                        <>
                            <span className="animal-datepicker-value">{rangeStart.format(format)}</span>
                            <span className="animal-datepicker-range-divider" aria-hidden />
                            <span className={rangeEnd ? 'animal-datepicker-value' : 'animal-datepicker-placeholder'}>
                                {rangeEnd ? rangeEnd.format(format) : placeholder}
                            </span>
                        </>
                    ) : selectedRange ? (
                        <>
                            <span className="animal-datepicker-value">{selectedRange[0].format(format)}</span>
                            <span className="animal-datepicker-range-divider" aria-hidden />
                            <span className="animal-datepicker-value">{selectedRange[1].format(format)}</span>
                        </>
                    ) : (
                        <span className="animal-datepicker-placeholder">{placeholder}</span>
                    )
                ) : (
                    <span className={currentValue || (open && pendingDate) ? 'animal-datepicker-value' : 'animal-datepicker-placeholder'}>
                        {open && pendingDate
                            ? pendingDate.format(format)
                            : selectedDate
                              ? selectedDate.format(format)
                              : placeholder}
                    </span>
                )}
                {allowClear && currentValue && !disabled && (
                    <button
                        type="button"
                        className="animal-datepicker-clear"
                        aria-label="清除日期"
                        onClick={handleClear}
                        onMouseDown={(e) => e.preventDefault()}
                    >
                        ×
                    </button>
                )}
                <span className="animal-datepicker-calendar-icon" aria-hidden>
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
                        'animal-datepicker-panel',
                        range && 'animal-datepicker-panel-range',
                        closing ? 'animal-datepicker-panel-closing' : mounted ? 'animal-datepicker-panel-visible' : ''
                    )}
                    style={panelStyle}
                >
                    {range ? (
                        <>
                            <div className="animal-datepicker-range-panels">
                                {[viewDate, viewDate.add(1, 'month')].map((panelDate, idx) => (
                                    <div key={panelDate.valueOf()} className="animal-datepicker-range-panel">
                                        <div className="animal-datepicker-header">
                                            <div className="animal-datepicker-header-group">
                                                {idx === 0 && (
                                                    <button type="button" className="animal-datepicker-nav-btn" aria-label="上一年" onClick={() => shiftView(-1, 0)} onMouseDown={(e) => e.preventDefault()}>
                                                        {DoubleChevronLeft}
                                                    </button>
                                                )}
                                                {idx === 0 && (
                                                    <button type="button" className="animal-datepicker-nav-btn" aria-label="上个月" onClick={() => shiftView(0, -1)} onMouseDown={(e) => e.preventDefault()}>
                                                        {ChevronLeft}
                                                    </button>
                                                )}
                                            </div>
                                            <span className="animal-datepicker-year-label">
                                                {panelDate.year()}年{panelDate.month() + 1}月
                                            </span>
                                            <div className="animal-datepicker-header-group">
                                                {idx === 1 && (
                                                    <button type="button" className="animal-datepicker-nav-btn" aria-label="下个月" onClick={() => shiftView(0, 1)} onMouseDown={(e) => e.preventDefault()}>
                                                        {ChevronRight}
                                                    </button>
                                                )}
                                                {idx === 1 && (
                                                    <button type="button" className="animal-datepicker-nav-btn" aria-label="下一年" onClick={() => shiftView(1, 0)} onMouseDown={(e) => e.preventDefault()}>
                                                        {DoubleChevronRight}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        {renderDayGrid(panelDate)}
                                    </div>
                                ))}
                            </div>
                            <div className="animal-datepicker-footer">
                                <button type="button" className="animal-datepicker-confirm-btn" onClick={confirmTime} onMouseDown={(e) => e.preventDefault()}>
                                    确定
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="animal-datepicker-header">
                                <div className="animal-datepicker-header-group">
                                    <button type="button" className="animal-datepicker-nav-btn" aria-label="上一年" onClick={() => (mode === 'year' ? shiftView(-10, 0) : shiftView(-1, 0))} onMouseDown={(e) => e.preventDefault()}>
                                        {DoubleChevronLeft}
                                    </button>
                                    {mode === 'date' && (
                                        <button type="button" className="animal-datepicker-nav-btn" aria-label="上个月" onClick={() => shiftView(0, -1)} onMouseDown={(e) => e.preventDefault()}>
                                            {ChevronLeft}
                                        </button>
                                    )}
                                </div>
                                {mode === 'date' && (
                                    <button type="button" className="animal-datepicker-label-btn" onClick={() => setMode('year')}>
                                        {year}年{month + 1}月
                                    </button>
                                )}
                                {mode === 'month' && (
                                    <button type="button" className="animal-datepicker-label-btn" onClick={() => setMode('year')}>
                                        {year}年
                                    </button>
                                )}
                                {mode === 'year' && (
                                    <span className="animal-datepicker-year-label">{startYear} - {startYear + 9}年</span>
                                )}
                                <div className="animal-datepicker-header-group">
                                    {mode === 'date' && (
                                        <button type="button" className="animal-datepicker-nav-btn" aria-label="下个月" onClick={() => shiftView(0, 1)} onMouseDown={(e) => e.preventDefault()}>
                                            {ChevronRight}
                                        </button>
                                    )}
                                    <button type="button" className="animal-datepicker-nav-btn" aria-label="下一年" onClick={() => (mode === 'year' ? shiftView(10, 0) : shiftView(1, 0))} onMouseDown={(e) => e.preventDefault()}>
                                        {DoubleChevronRight}
                                    </button>
                                </div>
                            </div>
                            {mode === 'date' && <>{renderDayGrid(viewDate)}</>}
                            {mode === 'month' && (
                                <div className="animal-datepicker-grid-3x4">
                                    {MONTHS.map((label, i) => {
                                        const activeDate = pendingDate ?? selectedDate;
                                        const sel = !!activeDate && activeDate.year() === year && activeDate.month() === i;
                                        return (
                                            <button
                                                key={label}
                                                type="button"
                                                className={cn('animal-datepicker-month-cell', sel && 'animal-datepicker-month-selected')}
                                                aria-label={`${i + 1}月`}
                                                onClick={() => {
                                                    if (picker === 'month' && !range) {
                                                        setPendingDate(viewDate.year(year).month(i).startOf('month'));
                                                    } else {
                                                        const d = viewDate.year(year).month(i).startOf('month');
                                                        setViewDate(d);
                                                        setFocusedDate(d);
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
                                <div className="animal-datepicker-grid-3x4">
                                    {yearCells.map((y) => {
                                        const sel = selectedDate?.year() === y;
                                        return (
                                            <button
                                                key={y}
                                                type="button"
                                                className={cn('animal-datepicker-year-cell', sel && 'animal-datepicker-year-selected')}
                                                aria-label={`${y}年`}
                                                onClick={() => {
                                                    const d = viewDate.year(y).month(month).startOf('month');
                                                    setViewDate(d);
                                                    setFocusedDate(d);
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
                                <div className="animal-datepicker-footer">
                                    {showToday && (
                                        <button type="button" className="animal-datepicker-today-btn" onClick={handleToday} onMouseDown={(e) => e.preventDefault()}>
                                            今天
                                        </button>
                                    )}
                                    <button type="button" className="animal-datepicker-confirm-btn" onClick={confirmTime} onMouseDown={(e) => e.preventDefault()}>
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
