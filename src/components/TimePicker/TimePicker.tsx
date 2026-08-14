import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import { cn } from '../../utils/cn';

export type TimePickerSize = 'small' | 'middle' | 'large';

export type TimePickerStatus = 'error' | 'warning';

/** 时分秒对象 */
export type TimePart = { h: number; m: number; s: number };

export interface TimePickerProps {
    /** 当前选中时间（受控），格式 HH:mm:ss */
    value?: string;
    /** 默认选中时间（非受控），格式 HH:mm:ss */
    defaultValue?: string;
    /** 值变化回调，清空时返回 null */
    onChange?: (value: string | null) => void;
    /** 占位文本 */
    placeholder?: string;
    /** 是否禁用 */
    disabled?: boolean;
    /** 是否允许一键清空 */
    allowClear?: boolean;
    /** 尺寸 */
    size?: TimePickerSize;
    /** 校验状态 */
    status?: TimePickerStatus;
    /** 展示格式，支持 HH / mm / ss 占位符，默认 HH:mm:ss；包含 ss 时面板显示秒列 */
    format?: string;
    /** 小时步进（默认 1） */
    hourStep?: number;
    /** 分钟步进（默认 1） */
    minuteStep?: number;
    /** 秒步进（默认 1） */
    secondStep?: number;
    /** 受控展开状态 */
    open?: boolean;
    /** 展开状态变化回调 */
    onOpenChange?: (open: boolean) => void;
    /** 对外暴露的无障碍标签（无可见 label 时使用） */
    'aria-label'?: string;
    /** 关联外部可见 label 的 id */
    'aria-labelledby'?: string;
    /** 额外类名 */
    className?: string;
    /** 行内样式 */
    style?: React.CSSProperties;
}

const pad2 = (n: number) => `${n}`.padStart(2, '0');

/** 将 HH:mm:ss 字符串解析为时分秒对象，非法输入返回 null */
const parseTime = (value: string | null | undefined): TimePart | null => {
    if (!value) return null;
    const match = /^(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?$/.exec(value);
    if (!match) return null;
    const part: TimePart = { h: Number(match[1]), m: Number(match[2]), s: Number(match[3] ?? 0) };
    return part.h > 23 || part.m > 59 || part.s > 59 ? null : part;
};

/** 将时分秒序列化为 HH:mm:ss */
const toValue = (part: TimePart) => `${pad2(part.h)}:${pad2(part.m)}:${pad2(part.s)}`;

/** 按模板格式化时间，支持 HH / mm / ss 占位符 */
const formatTime = (part: TimePart, format: string) =>
    format.replace('HH', pad2(part.h)).replace('mm', pad2(part.m)).replace('ss', pad2(part.s));

/** 面板是否展示秒列：format 包含 ss */
const hasSeconds = (format: string) => format.includes('ss');

/** 关闭退场动画时长 */
const CLOSE_ANIMATION_MS = 200;

export const TimePicker: React.FC<TimePickerProps> = ({
    value,
    defaultValue,
    onChange,
    placeholder = '请选择时间',
    disabled = false,
    allowClear = false,
    size = 'middle',
    status,
    format = 'HH:mm:ss',
    hourStep = 1,
    minuteStep = 1,
    secondStep = 1,
    open: openProp,
    onOpenChange,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    className,
    style,
}) => {
    const [innerValue, setInnerValue] = useState<string | null>(defaultValue ?? null);
    const [innerOpen, setInnerOpen] = useState(false);
    const [pending, setPending] = useState<TimePart | null>(() => parseTime(defaultValue));
    const [panelStyle, setPanelStyle] = useState<React.CSSProperties>({});
    const [mounted, setMounted] = useState(false);
    const [closing, setClosing] = useState(false);
    const closingRef = useRef(false);
    const closeTimerRef = useRef<number | null>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLDivElement>(null);
    const hourListRef = useRef<HTMLDivElement>(null);
    const minuteListRef = useRef<HTMLDivElement>(null);
    const secondListRef = useRef<HTMLDivElement>(null);

    const isControlled = value !== undefined;
    const currentValue = isControlled ? (value ?? null) : innerValue;
    const parsed = parseTime(currentValue);
    const open = openProp !== undefined ? openProp : innerOpen;

    const idPrefix = `animal-time-picker-${useId().replace(/:/g, '')}`;
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
        const part = parseTime(valueRef.current) ?? { h: 0, m: 0, s: 0 };
        setPending(part);
        // 条目高 28px + 间距 10px
        const itemHeight = 38;
        const center = (list: HTMLDivElement | null, unit: number, step: number) => {
            if (!list) return;
            const index = Math.floor(unit / Math.max(1, step));
            list.scrollTop = index * itemHeight - list.clientHeight / 2 + itemHeight / 2;
        };
        center(hourListRef.current, part.h, hourStep);
        center(minuteListRef.current, part.m, minuteStep);
        if (hasSeconds(format)) center(secondListRef.current, part.s, secondStep);
    }, [open, format, hourStep, minuteStep, secondStep]);

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
            const panelHeight = 320;
            const newStyle: React.CSSProperties = { position: 'absolute', left: 0 };
            if (rect.bottom + panelHeight > viewportHeight && rect.top > viewportHeight - rect.bottom) {
                newStyle.bottom = '100%';
                newStyle.marginBottom = '6px';
            } else {
                newStyle.top = '100%';
                newStyle.marginTop = '6px';
            }
            if (rect.left + 260 > window.innerWidth) {
                newStyle.right = 0;
                newStyle.left = 'auto';
            }
            setPanelStyle(newStyle);
            requestAnimationFrame(() => setMounted(true));
        } else if (!open) {
            setMounted(false);
        }
    }, [open]);

    const pickUnit = (part: TimePart) => setPending(part);

    const setNow = () => {
        const now = new Date();
        setPending({ h: now.getHours(), m: now.getMinutes(), s: now.getSeconds() });
    };

    const confirmTime = () => {
        if (!pending) return;
        const next = toValue(pending);
        if (next !== currentValue) {
            if (!isControlled) setInnerValue(next);
            onChange?.(next);
        }
        closePanel();
        triggerRef.current?.focus();
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!isControlled) setInnerValue(null);
        onChange?.(null);
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
        } else if (key === 'Enter') {
            e.preventDefault();
            confirmTime();
        }
    };

    const base = pending ?? { h: 0, m: 0, s: 0 };
    const hours = Array.from({ length: 24 }, (_, i) => i).filter((h) => h % Math.max(1, hourStep) === 0);
    const minutes = Array.from({ length: 60 }, (_, i) => i).filter((m) => m % Math.max(1, minuteStep) === 0);
    const seconds = hasSeconds(format)
        ? Array.from({ length: 60 }, (_, i) => i).filter((s) => s % Math.max(1, secondStep) === 0)
        : [];

    const triggerCls = cn(
        'animal-time-picker-trigger',
        `animal-time-picker-trigger-${size}`,
        status && `animal-time-picker-trigger-${status}`,
        open && 'animal-time-picker-trigger-open'
    );

    return (
        <div
            ref={wrapperRef}
            className={cn('animal-time-picker', disabled && 'animal-time-picker-disabled', className)}
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
                className={triggerCls}
                onClick={() => !disabled && !closing && setOpen(!open)}
            >
                <span className={currentValue ? 'animal-time-picker-value' : 'animal-time-picker-placeholder'}>
                    {open && pending ? formatTime(pending, format) : parsed ? formatTime(parsed, format) : placeholder}
                </span>
                {allowClear && currentValue && !disabled && (
                    <button
                        type="button"
                        className="animal-time-picker-clear"
                        aria-label="清除时间"
                        onClick={handleClear}
                        onMouseDown={(e) => e.preventDefault()}
                    >
                        ×
                    </button>
                )}
                <span className="animal-time-picker-clock-icon" aria-hidden>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.4" />
                        <path d="M7 4.2V7l2 1.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                    </svg>
                </span>
            </div>
            {open && (
                <div
                    id={panelId}
                    role="dialog"
                    aria-label="选择时间"
                    className={cn(
                        'animal-time-picker-panel',
                        !hasSeconds(format) && 'animal-time-picker-panel-no-seconds',
                        closing ? 'animal-time-picker-panel-closing' : mounted ? 'animal-time-picker-panel-visible' : ''
                    )}
                    style={panelStyle}
                >
                    <div className="animal-time-picker-columns">
                        <div className="animal-time-picker-column">
                            <div className="animal-time-picker-column-title">时</div>
                            <div ref={hourListRef} className="animal-time-picker-column-list">
                                {hours.map((h) => (
                                    <button
                                        key={h}
                                        type="button"
                                        className={cn(
                                            'animal-time-picker-option',
                                            base.h === h && 'animal-time-picker-option-selected'
                                        )}
                                        aria-label={`${h} 时`}
                                        onClick={() => pickUnit({ ...base, h })}
                                        onMouseDown={(e) => e.preventDefault()}
                                    >
                                        {pad2(h)}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="animal-time-picker-column">
                            <div className="animal-time-picker-column-title">分</div>
                            <div ref={minuteListRef} className="animal-time-picker-column-list">
                                {minutes.map((m) => (
                                    <button
                                        key={m}
                                        type="button"
                                        className={cn(
                                            'animal-time-picker-option',
                                            base.m === m && 'animal-time-picker-option-selected'
                                        )}
                                        aria-label={`${m} 分`}
                                        onClick={() => pickUnit({ ...base, m })}
                                        onMouseDown={(e) => e.preventDefault()}
                                    >
                                        {pad2(m)}
                                    </button>
                                ))}
                            </div>
                        </div>
                        {seconds.length > 0 && (
                            <div className="animal-time-picker-column">
                                <div className="animal-time-picker-column-title">秒</div>
                                <div ref={secondListRef} className="animal-time-picker-column-list">
                                    {seconds.map((s) => (
                                        <button
                                            key={s}
                                            type="button"
                                            className={cn(
                                                'animal-time-picker-option',
                                                base.s === s && 'animal-time-picker-option-selected'
                                            )}
                                            aria-label={`${s} 秒`}
                                            onClick={() => pickUnit({ ...base, s })}
                                            onMouseDown={(e) => e.preventDefault()}
                                        >
                                            {pad2(s)}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="animal-time-picker-footer">
                        <button
                            type="button"
                            className="animal-time-picker-footer-btn"
                            onClick={setNow}
                            onMouseDown={(e) => e.preventDefault()}
                        >
                            此刻
                        </button>
                        <button
                            type="button"
                            className="animal-time-picker-confirm-btn"
                            onClick={confirmTime}
                            onMouseDown={(e) => e.preventDefault()}
                        >
                            确定
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

TimePicker.displayName = 'TimePicker';
