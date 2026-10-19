import React, { useCallback, useState } from 'react';
import dayjs, { type Dayjs } from 'dayjs';
import { cn } from '../../utils/cn';
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from '../../utils/icons';

export type CalendarMode = 'month' | 'year';

export interface CalendarProps {
    /** 选中日期（受控），YYYY-MM-DD */
    value?: string;
    /** 默认选中日期（非受控），YYYY-MM-DD */
    defaultValue?: string;
    /** 选中日期变化回调，YYYY-MM-DD */
    onChange?: (value: string) => void;
    /** 展示的面板模式 */
    mode?: CalendarMode;
    /** 面板模式切换回调 */
    onModeChange?: (mode: CalendarMode) => void;
    /** 禁用日期函数 */
    disabledDate?: (date: Date) => boolean;
    /** 完整尺寸模式（默认 true），false 为迷你卡片模式 */
    fullscreen?: boolean;
    /** 自定义日期单元格内容 */
    dateCellRender?: (date: Dayjs) => React.ReactNode;
    /** 自定义月份单元格内容 */
    monthCellRender?: (date: Dayjs) => React.ReactNode;
    /** 额外类名 */
    className?: string;
    /** 行内样式 */
    style?: React.CSSProperties;
}

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];
const MONTHS_SHORT = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
const GRID_CELLS = 42;

const parseDate = (value: string | null | undefined): Dayjs | null => {
    if (!value) return null;
    const d = dayjs(value, 'YYYY-MM-DD', true);
    return d.isValid() ? d : null;
};

export const Calendar: React.FC<CalendarProps> = ({
    value,
    defaultValue,
    onChange,
    mode: modeProp,
    onModeChange,
    disabledDate,
    fullscreen = true,
    dateCellRender,
    monthCellRender,
    className,
    style,
}) => {
    const isControlled = value !== undefined;
    const [innerValue, setInnerValue] = useState<Dayjs | null>(
        () => parseDate(defaultValue ?? null)
    );
    const selectedDate = isControlled ? parseDate(value) : innerValue;

    const [viewDate, setViewDate] = useState<Dayjs>(
        () => parseDate(isControlled ? value : defaultValue) ?? dayjs()
    );
    const [innerMode, setInnerMode] = useState<CalendarMode>('month');
    const mode = modeProp ?? innerMode;

    const setMode = useCallback(
        (next: CalendarMode) => {
            if (modeProp === undefined) setInnerMode(next);
            onModeChange?.(next);
        },
        [modeProp, onModeChange]
    );

    const today = dayjs();

    const handleSelect = (date: Dayjs) => {
        if (disabledDate?.(date.toDate())) return;
        if (!isControlled) setInnerValue(date);
        onChange?.(date.format('YYYY-MM-DD'));
        setViewDate(date);
    };

    const handleSelectMonth = (monthIndex: number) => {
        const next = viewDate.month(monthIndex).startOf('month');
        setViewDate(next);
        setMode('month');
    };

    const shiftView = (delta: number, unit: 'month' | 'year') => {
        setViewDate(viewDate.add(delta, unit).startOf('month'));
    };

    const buildDayCells = (): Dayjs[] => {
        const cells: Dayjs[] = [];
        const startOfMonth = viewDate.startOf('month');
        const startWeekday = startOfMonth.day();
        const daysInMonth = viewDate.daysInMonth();
        const prevMonth = viewDate.subtract(1, 'month');
        const daysInPrevMonth = prevMonth.daysInMonth();
        for (let i = startWeekday - 1; i >= 0; i--) cells.push(prevMonth.date(daysInPrevMonth - i));
        for (let d = 1; d <= daysInMonth; d++) cells.push(startOfMonth.date(d));
        const nextMonth = viewDate.add(1, 'month');
        for (let d = 1; cells.length < GRID_CELLS; d++) cells.push(nextMonth.date(d));
        return cells;
    };

    const year = viewDate.year();
    const month = viewDate.month();

    const renderHeader = () => (
        <div className="animal-calendar-header">
            <div className="animal-calendar-header-left">
                <CalendarIcon size={16} className="animal-calendar-icon" aria-hidden />
                <button
                    type="button"
                    className="animal-calendar-mode-btn"
                    onClick={() => setMode(mode === 'month' ? 'year' : 'month')}
                >
                    {year}年{mode === 'month' ? `${month + 1}月` : ''}
                </button>
            </div>
            <div className="animal-calendar-header-right">
                <button
                    type="button"
                    className="animal-calendar-nav-btn"
                    aria-label={mode === 'month' ? '上个月' : '上一年'}
                    onClick={() => shiftView(-1, mode === 'month' ? 'month' : 'year')}
                >
                    <ChevronLeftIcon size={14} aria-hidden />
                </button>
                <button
                    type="button"
                    className="animal-calendar-nav-btn"
                    aria-label={mode === 'month' ? '下个月' : '下一年'}
                    onClick={() => shiftView(1, mode === 'month' ? 'month' : 'year')}
                >
                    <ChevronRightIcon size={14} aria-hidden />
                </button>
            </div>
        </div>
    );

    const renderMonthView = () => (
        <>
            <div className="animal-calendar-week-row">
                {WEEKDAYS.map((w) => (
                    <div key={w} className="animal-calendar-week-cell">{w}</div>
                ))}
            </div>
            <div className="animal-calendar-grid">
                {buildDayCells().map((cell) => {
                    const isToday = cell.isSame(today, 'day');
                    const isSelected = !!selectedDate && cell.isSame(selectedDate, 'day');
                    const isOutside = !cell.isSame(viewDate, 'month');
                    const isDisabled = disabledDate?.(cell.toDate()) === true;
                    return (
                        <div
                            key={cell.valueOf()}
                            className={cn(
                                'animal-calendar-day-cell',
                                isOutside && 'animal-calendar-day-outside',
                                isToday && 'animal-calendar-day-today',
                                isSelected && 'animal-calendar-day-selected',
                                isDisabled && 'animal-calendar-day-disabled'
                            )}
                            role="button"
                            tabIndex={isDisabled ? -1 : 0}
                            aria-label={`${cell.year()}年${cell.month() + 1}月${cell.date()}日${isToday ? '，今天' : ''}${isSelected ? '，已选' : ''}`}
                            aria-disabled={isDisabled || undefined}
                            aria-pressed={isSelected}
                            onClick={() => !isDisabled && handleSelect(cell)}
                            onKeyDown={(e) => {
                                if ((e.key === 'Enter' || e.key === ' ') && !isDisabled) {
                                    e.preventDefault();
                                    handleSelect(cell);
                                }
                            }}
                        >
                            <div className="animal-calendar-day-inner">
                                <span className="animal-calendar-day-number">{cell.date()}</span>
                                {dateCellRender && (
                                    <div className="animal-calendar-day-extra">{dateCellRender(cell)}</div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );

    const renderYearView = () => (
        <div className="animal-calendar-month-grid">
            {MONTHS_SHORT.map((label, i) => {
                const monthDate = viewDate.month(i).startOf('month');
                const isCurrentMonth = today.year() === year && today.month() === i;
                const isSelected = !!selectedDate && selectedDate.year() === year && selectedDate.month() === i;
                return (
                    <div
                        key={i}
                        className={cn(
                            'animal-calendar-month-cell',
                            isCurrentMonth && 'animal-calendar-month-today',
                            isSelected && 'animal-calendar-month-selected'
                        )}
                        role="button"
                        tabIndex={0}
                        aria-label={`${year}年${i + 1}月`}
                        aria-pressed={isSelected}
                        onClick={() => handleSelectMonth(i)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                handleSelectMonth(i);
                            }
                        }}
                    >
                        <span className="animal-calendar-month-label">{label}</span>
                        {monthCellRender && (
                            <div className="animal-calendar-month-extra">{monthCellRender(monthDate)}</div>
                        )}
                    </div>
                );
            })}
        </div>
    );

    return (
        <div
            className={cn(
                'animal-calendar',
                fullscreen ? 'animal-calendar-fullscreen' : 'animal-calendar-card',
                className
            )}
            style={style}
        >
            {renderHeader()}
            <div className="animal-calendar-body">
                {mode === 'month' ? renderMonthView() : renderYearView()}
            </div>
        </div>
    );
};

Calendar.displayName = 'Calendar';
