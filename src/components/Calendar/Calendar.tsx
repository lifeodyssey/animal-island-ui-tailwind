import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import dayjs, { type Dayjs } from 'dayjs';
import { cn } from '../../utils/cn';
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from '../../utils/icons';

export type CalendarColor = 'teal' | 'amber' | 'coral' | 'green' | 'purple';

export interface CalendarEvent {
    title: React.ReactNode;
    start: string | Dayjs;
    end?: string | Dayjs;
    color?: CalendarColor;
    showTime?: boolean;
}

export interface CalendarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'> {
    value?: string;
    defaultValue?: string;
    panelValue?: string;
    defaultPanelValue?: string;
    onChange?: (date: string) => void;
    onPanelChange?: (month: string) => void;
    events?: CalendarEvent[];
    showEventTime?: boolean;
    draggableEvents?: boolean;
    onEventCreate?: (start: string, end: string) => void;
    width?: number | string;
    'aria-label'?: string;
    'aria-labelledby'?: string;
    className?: string;
    style?: React.CSSProperties;
}

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];
const GRID_CELLS = 42;
const COLS = 7;
const CELL_ROWS = GRID_CELLS / COLS;
const LAYOUT_BASE = {
    width: 750,
    header: 32,
    cellHeight: 104,
    numberBand: 42,
    eventRow: 22,
};
const MIN_SCALE = 0.6;
const MAX_SCALE = 2;
const MAX_EVENT_ROWS = 2;

const toDateKey = (date: Dayjs) => date.format('YYYY-MM-DD');

const parseDate = (value: string | Dayjs | null | undefined): Dayjs | null => {
    if (!value) return null;
    const parsed = dayjs.isDayjs(value) ? value : dayjs(value);
    return parsed.isValid() ? parsed : null;
};

const parseMonthValue = (value: string | null | undefined): Dayjs | null => {
    if (!value) return null;
    const parsed = /^\d{4}-\d{1,2}$/.test(value) ? dayjs(`${value}-01`) : dayjs(value);
    return parsed.isValid() ? parsed : null;
};

const gridStartOf = (month: Dayjs) => {
    const first = month.date(1);
    return first.subtract(first.day(), 'day');
};

const cellIndexOf = (date: Dayjs, gridStart: Dayjs) => {
    const index = date.startOf('day').diff(gridStart.startOf('day'), 'day');
    return Math.min(GRID_CELLS - 1, Math.max(0, index));
};

const isEventVisibleInGrid = (start: Dayjs, end: Dayjs, gridStart: Dayjs): boolean => {
    const last = end.isBefore(start, 'day') ? start : end;
    return !last.isBefore(gridStart, 'day') && start.isBefore(gridStart.add(GRID_CELLS, 'day'), 'day');
};

const clampToGrid = (date: Dayjs, gridStart: Dayjs): Dayjs => {
    if (date.isBefore(gridStart, 'day')) return gridStart;
    const last = gridStart.add(GRID_CELLS - 1, 'day');
    return date.isAfter(last, 'day') ? last : date;
};

interface EventSegment {
    event: CalendarEvent;
    index: number;
    endIndex: number;
    continuation: boolean;
    span: number;
    row: number;
}

interface EventLayout {
    segments: EventSegment[];
    counts: number[];
}

const layoutEvents = (
    events: CalendarEvent[],
    gridStart: Dayjs,
    today: Dayjs,
    nonCountingEvent?: CalendarEvent | null
): EventLayout => {
    const segments: EventSegment[] = [];
    const counts = new Array<number>(GRID_CELLS).fill(0);
    const rows = Array.from({ length: GRID_CELLS }, () => new Array<boolean>(MAX_EVENT_ROWS).fill(false));

    const sorted = [...events]
        .map((event) => ({
            event,
            start: parseDate(event.start) ?? today.startOf('day'),
            end: parseDate(event.end) ?? parseDate(event.start) ?? today.startOf('day'),
        }))
        .sort((a, b) => a.start.valueOf() - b.start.valueOf());

    for (const { event, start, end } of sorted) {
        const last = end.isBefore(start, 'day') ? start : end;
        const from = cellIndexOf(start, gridStart);
        const to = cellIndexOf(last, gridStart);

        if (!isEventVisibleInGrid(start, last, gridStart)) continue;

        if (event !== nonCountingEvent) {
            for (let i = from; i <= to; i += 1) counts[i] += 1;
        }

        for (let row = 0; row < CELL_ROWS; row += 1) {
            const rowStart = row * COLS;
            const rowEnd = rowStart + COLS - 1;
            if (to < rowStart || from > rowEnd) continue;
            const segFrom = Math.max(from, rowStart);
            const segTo = Math.min(to, rowEnd);
            const span = segTo - segFrom + 1;

            let placed = -1;
            for (let r = 0; r < MAX_EVENT_ROWS; r += 1) {
                let free = true;
                for (let i = segFrom; i <= segTo; i += 1) {
                    if (rows[i][r]) { free = false; break; }
                }
                if (free) { placed = r; break; }
            }
            if (placed < 0) continue;

            for (let i = segFrom; i <= segTo; i += 1) rows[i][placed] = true;
            segments.push({
                event,
                index: segFrom,
                endIndex: segTo,
                continuation: !start.isSame(gridStart.add(segFrom, 'day'), 'day'),
                span,
                row: placed,
            });
        }
    }

    return { segments, counts };
};

const textOf = (node: React.ReactNode): string => {
    if (node === null || node === undefined || typeof node === 'boolean') return '';
    if (typeof node === 'string') return node;
    if (typeof node === 'number') return String(node);
    if (Array.isArray(node)) return node.map(textOf).join('');
    if (React.isValidElement<{ children?: React.ReactNode }>(node)) return textOf(node.props.children);
    return '';
};

const eventLabel = (event: CalendarEvent, firstSegment: boolean, showTime: boolean) => {
    const start = parseDate(event.start);
    if (!showTime || !event.showTime || !start || !firstSegment) return event.title;
    return (
        <>
            <span className="animal-calendar-event-time">{start.format('HH:mm')}</span>
            <span className="animal-calendar-event-title">{event.title}</span>
        </>
    );
};

export const Calendar: React.FC<CalendarProps> = ({
    value,
    defaultValue,
    panelValue,
    defaultPanelValue,
    onChange,
    onPanelChange,
    events = [],
    showEventTime = true,
    draggableEvents = false,
    onEventCreate,
    width,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    className,
    style,
    onMouseLeave,
    onPointerUp,
    onPointerCancel,
    ...rest
}) => {
    const isControlled = value !== undefined;
    const [innerValue, setInnerValue] = useState<string>(() => defaultValue ?? toDateKey(dayjs()));
    const selectedValue = isControlled ? value : innerValue;

    const isPanelControlled = panelValue !== undefined;
    const [innerPanel, setInnerPanel] = useState<Dayjs>(
        () => parseMonthValue(defaultPanelValue) ?? parseDate(defaultValue) ?? parseDate(value) ?? dayjs()
    );
    const viewMonth = isPanelControlled ? (parseMonthValue(panelValue) ?? dayjs()) : innerPanel;
    const gridStart = gridStartOf(viewMonth);

    const [focusCursor, setFocusCursor] = useState<Dayjs>(() => parseDate(selectedValue) ?? dayjs());
    const [dragging, setDragging] = useState(false);
    const [dragAnchor, setDragAnchor] = useState<Dayjs | null>(null);
    const [dragHead, setDragHead] = useState<Dayjs | null>(null);

    const today = dayjs();
    const focusDate = clampToGrid(focusCursor, gridStart);
    const focusKey = toDateKey(focusDate);
    const monthKey = viewMonth.format('YYYY-MM');
    const todayKey = today.format('YYYY-MM-DD');
    const gridStartKey = gridStart.format('YYYY-MM-DD');
    const selectedDate = parseDate(selectedValue);
    const selectedKey = selectedDate ? toDateKey(clampToGrid(selectedDate, gridStart)) : '';
    const wrapperRef = useRef<HTMLDivElement>(null);
    const pendingFocusRef = useRef(false);
    const [measuredWidth, setMeasuredWidth] = useState(0);

    useEffect(() => {
        const node = wrapperRef.current;
        if (!node || typeof ResizeObserver === 'undefined') return;
        const observer = new ResizeObserver((entries) => {
            const next = entries[0]?.contentRect.width ?? 0;
            if (next > 0) setMeasuredWidth(next);
        });
        observer.observe(node);
        return () => observer.disconnect();
    }, []);

    const numericWidth = typeof width === 'number' ? width : 0;
    const effectiveWidth = numericWidth || measuredWidth || LAYOUT_BASE.width;
    const scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, effectiveWidth / LAYOUT_BASE.width));
    const metrics = {
        header: LAYOUT_BASE.header * scale,
        cellHeight: LAYOUT_BASE.cellHeight * scale,
        numberBand: LAYOUT_BASE.numberBand * scale,
        eventRow: LAYOUT_BASE.eventRow * scale,
    };

    useEffect(() => {
        const next = parseDate(selectedValue);
        if (next) setFocusCursor(next);
    }, [selectedValue]);

    const lastSelectedRef = useRef(selectedValue);
    useEffect(() => {
        if (lastSelectedRef.current === selectedValue) return;
        lastSelectedRef.current = selectedValue;
        if (isPanelControlled) return;
        const next = parseDate(selectedValue);
        if (next && next.format('YYYY-MM') !== monthKey) setInnerPanel(next);
    }, [isPanelControlled, selectedValue, monthKey]);

    const goToMonth = useCallback(
        (month: Dayjs, focus?: Dayjs) => {
            if (!isPanelControlled) setInnerPanel(month);
            onPanelChange?.(month.format('YYYY-MM'));
            if (focus) setFocusCursor(focus);
        },
        [isPanelControlled, onPanelChange]
    );

    useEffect(() => {
        if (!pendingFocusRef.current) return;
        pendingFocusRef.current = false;
        const node = wrapperRef.current?.querySelector<HTMLElement>(`[data-date="${focusKey}"]`);
        node?.focus();
    }, [focusKey, monthKey]);

    const shiftMonth = useCallback(
        (delta: number) => {
            const next = viewMonth.add(delta, 'month').date(1);
            goToMonth(next, next.date(Math.min(focusDate.date(), next.daysInMonth())));
        },
        [viewMonth, focusDate, goToMonth]
    );

    const shiftYear = useCallback(
        (delta: number) => {
            const next = viewMonth.add(delta, 'year').date(1);
            goToMonth(next, next.date(Math.min(focusDate.date(), next.daysInMonth())));
        },
        [viewMonth, focusDate, goToMonth]
    );

    const selectDate = useCallback(
        (date: Dayjs) => {
            const next = toDateKey(date);
            setFocusCursor(date);
            if (!isControlled) setInnerValue(next);
            onChange?.(next);
            if (date.format('YYYY-MM') !== monthKey) {
                const month = date.date(1);
                if (!isPanelControlled) setInnerPanel(month);
                onPanelChange?.(month.format('YYYY-MM'));
            }
        },
        [isControlled, isPanelControlled, monthKey, onChange, onPanelChange]
    );

    const dragPreview = useMemo(() => {
        if (!dragging || !dragAnchor || !dragHead) return null;
        const from = dragAnchor.isBefore(dragHead, 'day') ? dragAnchor : dragHead;
        const to = dragAnchor.isBefore(dragHead, 'day') ? dragHead : dragAnchor;
        return { from, to };
    }, [dragging, dragAnchor, dragHead]);

    const previewEvent = useMemo<CalendarEvent | null>(
        () => (dragPreview ? { title: '', start: dragPreview.from, end: dragPreview.to, color: 'teal' } : null),
        [dragPreview]
    );
    const layoutEventsSource = useMemo<CalendarEvent[]>(
        () => (previewEvent ? [...events, previewEvent] : events),
        [events, previewEvent]
    );

    const layout = useMemo(
        () => layoutEvents(layoutEventsSource, dayjs(gridStartKey), dayjs(todayKey), previewEvent),
        [layoutEventsSource, gridStartKey, todayKey, previewEvent]
    );

    const eventsByCell = useMemo(() => {
        const map = new Map<number, CalendarEvent[]>();
        const viewStart = dayjs(gridStartKey);
        const fallbackDay = dayjs(todayKey);
        for (const event of events) {
            const start = parseDate(event.start) ?? fallbackDay;
            const declaredEnd = parseDate(event.end);
            const end = !declaredEnd || declaredEnd.isBefore(start, 'day') ? start : declaredEnd;
            if (!isEventVisibleInGrid(start, end, viewStart)) continue;
            const from = cellIndexOf(start, viewStart);
            const to = cellIndexOf(end, viewStart);
            for (let i = from; i <= to; i += 1) {
                const list = map.get(i) ?? [];
                list.push(event);
                map.set(i, list);
            }
        }
        return map;
    }, [events, gridStartKey, todayKey]);

    const overlaySegments = layout.segments;

    const overflowCounts = useMemo(() => {
        const drawn = new Array<number>(GRID_CELLS).fill(0);
        for (const segment of layout.segments) {
            for (let i = 0; i < segment.span; i += 1) {
                const at = segment.index + i;
                if (at < GRID_CELLS) drawn[at] += 1;
            }
        }
        return layout.counts.map((count, i) => count - drawn[i]);
    }, [layout]);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        const { key } = event;
        if (key === 'PageUp' || key === 'PageDown') {
            event.preventDefault();
            pendingFocusRef.current = true;
            shiftMonth(key === 'PageUp' ? -1 : 1);
            return;
        }
        const delta = key === 'ArrowLeft' ? -1 : key === 'ArrowRight' ? 1 : key === 'ArrowUp' ? -COLS : key === 'ArrowDown' ? COLS : 0;
        if (delta !== 0) {
            event.preventDefault();
            const next = focusDate.add(delta, 'day');
            pendingFocusRef.current = true;
            setFocusCursor(next);
            if (!next.isSame(viewMonth, 'month')) {
                const month = next.date(1);
                if (!isPanelControlled) setInnerPanel(month);
                onPanelChange?.(month.format('YYYY-MM'));
            }
            return;
        }
        if (key === 'Enter' || key === ' ') {
            event.preventDefault();
            selectDate(focusDate);
        }
    };

    const startDragAt = (index: number) => {
        const date = gridStart.add(index, 'day');
        if (!draggableEvents) return;
        setDragging(true);
        setDragAnchor(date);
        setDragHead(date);
    };

    const extendDragAt = (index: number) => {
        if (!dragging) return;
        setDragHead(gridStart.add(index, 'day'));
    };

    const finishDrag = () => {
        if (!dragging) return;
        const anchor = dragAnchor;
        const head = dragHead;
        setDragging(false);
        setDragAnchor(null);
        setDragHead(null);
        if (!anchor || !head) return;
        const from = anchor.isBefore(head, 'day') ? anchor : head;
        const to = anchor.isBefore(head, 'day') ? head : anchor;
        if (from.isSame(to, 'day')) return;
        onEventCreate?.(toDateKey(from), toDateKey(to));
    };

    useEffect(() => {
        if (!dragging) return;
        const stop = () => {
            setDragging(false);
            setDragAnchor(null);
            setDragHead(null);
        };
        document.addEventListener('pointerup', stop);
        document.addEventListener('pointercancel', stop);
        return () => {
            document.removeEventListener('pointerup', stop);
            document.removeEventListener('pointercancel', stop);
        };
    }, [dragging]);

    const renderCell = (cell: Dayjs, index: number) => {
        const cellKey = toDateKey(cell);
        const outside = cell.month() !== viewMonth.month();
        const selected = cellKey === selectedKey;
        const isToday = cell.isSame(today, 'day');
        const extra = overflowCounts[index];
        const dayEvents = eventsByCell.get(index) ?? [];
        const isFocusable = cellKey === focusKey;

        const label = (() => {
            if (dayEvents.length === 0) return cellKey;
            const titles = Array.from(new Set(dayEvents.map((event) => textOf(event.title)).filter(Boolean)));
            if (titles.length === 0) return `${cellKey} ${dayEvents.length} 项事项`;
            const collapsed = titles.length < dayEvents.length ? ' 等' : '';
            return `${cellKey} ${dayEvents.length} 项事项：${titles.join('，')}${collapsed}`;
        })();

        return (
            <td
                key={`${monthKey}-cell-${cellKey}`}
                role="gridcell"
                tabIndex={isFocusable ? 0 : -1}
                aria-selected={selected || undefined}
                aria-label={label}
                data-date={cellKey}
                className={cn(
                    'animal-calendar-cell',
                    outside && 'animal-calendar-cell-outside',
                    selected && 'animal-calendar-cell-selected',
                    isToday && 'animal-calendar-cell-today',
                )}
                onClick={() => selectDate(cell)}
                onMouseDown={(event) => { if (event.button === 0) startDragAt(index); }}
                onMouseEnter={() => extendDragAt(index)}
            >
                <span className="animal-calendar-cell-inner">
                    <span className="animal-calendar-day-number">{cell.date()}</span>
                    {extra > 0 && <span className="animal-calendar-more">+{extra}</span>}
                </span>
            </td>
        );
    };

    const gridRows = Array.from({ length: GRID_CELLS / COLS }, (_, row) =>
        Array.from({ length: COLS }, (_, col) => gridStart.add(row * COLS + col, 'day'))
    );

    return (
        <div
            ref={wrapperRef}
            className={cn('animal-calendar', className)}
            data-draggable={draggableEvents ? 'true' : undefined}
            onPointerUp={(event) => { finishDrag(); onPointerUp?.(event); }}
            onPointerCancel={(event) => { finishDrag(); onPointerCancel?.(event); }}
            style={{ width, ['--animal-calendar-scale' as string]: scale, ...style }}
            {...rest}
        >
            <div className="animal-calendar-header">
                <div className="animal-calendar-header-group">
                    <button type="button" className="animal-calendar-nav-btn" aria-label="上一年" onClick={() => shiftYear(-1)}>
                        <ChevronLeftIcon className="animal-calendar-nav-icon" size={14} strokeWidth={2.6} />
                    </button>
                    <button type="button" className="animal-calendar-nav-btn" aria-label="上个月" onClick={() => shiftMonth(-1)}>
                        <ChevronLeftIcon className="animal-calendar-nav-icon" size={16} strokeWidth={2.6} />
                    </button>
                </div>
                <span className="animal-calendar-month-label">
                    <CalendarIcon className="animal-calendar-month-icon" size={16} />
                    {viewMonth.year()}年{viewMonth.month() + 1}月
                </span>
                <div className="animal-calendar-header-group">
                    <button type="button" className="animal-calendar-today-btn" onClick={() => selectDate(today)}>
                        今天
                    </button>
                    <button type="button" className="animal-calendar-nav-btn" aria-label="下个月" onClick={() => shiftMonth(1)}>
                        <ChevronRightIcon className="animal-calendar-nav-icon" size={16} strokeWidth={2.6} />
                    </button>
                    <button type="button" className="animal-calendar-nav-btn" aria-label="下一年" onClick={() => shiftYear(1)}>
                        <ChevronRightIcon className="animal-calendar-nav-icon" size={14} strokeWidth={2.6} />
                    </button>
                </div>
            </div>
            <div className="animal-calendar-body" onKeyDown={handleKeyDown} onMouseLeave={onMouseLeave}>
                <table role="grid" aria-label={ariaLabel} aria-labelledby={ariaLabelledBy} className="animal-calendar-table">
                    <thead>
                        <tr role="row">
                            {WEEKDAYS.map((weekday) => (
                                <th key={weekday} role="columnheader" scope="col" className="animal-calendar-week-cell">
                                    {weekday}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {gridRows.map((row, rowIndex) => (
                            <tr role="row" key={`${monthKey}-row-${rowIndex}`}>
                                {row.map((cell, colIndex) => renderCell(cell, rowIndex * COLS + colIndex))}
                            </tr>
                        ))}
                    </tbody>
                </table>
                {overlaySegments.length > 0 && (
                    <div className="animal-calendar-events-layer" aria-hidden>
                        {overlaySegments.map((segment) => {
                            const content = eventLabel(segment.event, !segment.continuation, showEventTime);
                            const col = (segment.index % COLS) + 1;
                            const colSpan = segment.span;
                            const palette = segment.event.color ?? 'teal';
                            return (
                                <div
                                    key={`${monthKey}-evt-${segment.index}-${segment.row}`}
                                    data-color={palette}
                                    data-span={segment.span > 1 ? 'true' : undefined}
                                    data-start={segment.index % COLS === 0 ? 'true' : undefined}
                                    data-end={segment.endIndex % COLS === COLS - 1 ? 'true' : undefined}
                                    data-preview={segment.event === previewEvent ? 'true' : undefined}
                                    className="animal-calendar-event"
                                    style={{
                                        ['--animal-calendar-bar-top' as string]: `${
                                            metrics.header +
                                            Math.floor(segment.index / COLS) * metrics.cellHeight +
                                            metrics.numberBand +
                                            (segment.row + 0.5) * metrics.eventRow
                                        }px`,
                                        ['--animal-calendar-bar-left' as string]: `calc((100% / 7) * ${col - 1} + 5px)`,
                                        ['--animal-calendar-bar-width' as string]: `calc((100% / 7) * ${colSpan} - 10px)`,
                                    }}
                                >
                                    {content}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

Calendar.displayName = 'Calendar';
