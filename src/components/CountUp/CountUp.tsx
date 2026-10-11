import React, { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '../../utils/cn';

export type CountUpSize = 'small' | 'middle' | 'large';
export type CountUpVariant = 'default' | 'island';

export type CountUpEasingName = 'linear' | 'easeInCubic' | 'easeOutCubic' | 'easeInOutCubic' | 'easeOutExpo';
export type CountUpEasingFunction = (progress: number) => number;
export type CountUpEasing = CountUpEasingName | CountUpEasingFunction;

export interface CountUpCompleteResult {
    shouldRepeat?: boolean;
    delay?: number;
    newStartAt?: number;
}

export interface CountUpCelebrateOptions {
    text?: React.ReactNode;
}

export interface CountUpRenderState {
    value: number;
    reset: (newStartAt?: number) => void;
}

export interface CountUpProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'prefix' | 'children'> {
    start?: number;
    end: number;
    duration?: number;
    isCounting?: boolean;
    decimalPlaces?: number;
    decimalSeparator?: string;
    thousandsSeparator?: string;
    easing?: CountUpEasing;
    formatter?: (value: number) => React.ReactNode;
    updateInterval?: number;
    prefix?: React.ReactNode;
    suffix?: React.ReactNode;
    size?: CountUpSize;
    variant?: CountUpVariant;
    bordered?: boolean;
    celebrate?: boolean | CountUpCelebrateOptions;
    onUpdate?: (value: number) => void;
    onComplete?: (elapsedTime: number) => void | CountUpCompleteResult;
    children?: (state: CountUpRenderState) => React.ReactNode;
}

const EASINGS: Record<CountUpEasingName, CountUpEasingFunction> = {
    linear: (progress) => progress,
    easeInCubic: (progress) => progress * progress * progress,
    easeOutCubic: (progress) => 1 - (1 - progress) ** 3,
    easeInOutCubic: (progress) =>
        progress < 0.5 ? 4 * progress * progress * progress : 1 - (-2 * progress + 2) ** 3 / 2,
    easeOutExpo: (progress) => (progress >= 1 ? 1 : 1 - 2 ** (-10 * progress)),
};

const resolveEasing = (easing: CountUpEasing): CountUpEasingFunction => {
    if (typeof easing === 'function') return easing;
    const named = (EASINGS as Record<string, CountUpEasingFunction>)[easing];
    return named ?? EASINGS.easeOutCubic;
};

const decimalCount = (value: number): number => {
    const text = String(value);
    const dot = text.indexOf('.');
    return dot === -1 ? 0 : text.length - dot - 1;
};

const groupThousands = (text: string, separator: string): string =>
    separator === '' ? text : text.replace(/\B(?=(\d{3})+(?!\d))/g, separator);

const formatNumber = (value: number, decimalPlaces: number, decimalSeparator: string, thousandsSeparator: string) => {
    if (decimalPlaces <= 0) {
        return groupThousands(String(Math.round(value)), thousandsSeparator);
    }
    const [integer, fraction] = value.toFixed(decimalPlaces).split('.');
    return `${groupThousands(integer, thousandsSeparator)}${decimalSeparator}${fraction}`;
};

const CELEBRATE_DURATION = 900;

export const CountUp: React.FC<CountUpProps> = ({
    start = 0,
    end,
    duration = 2,
    isCounting = false,
    decimalPlaces,
    decimalSeparator = '.',
    thousandsSeparator = '',
    easing = 'easeOutCubic',
    formatter,
    updateInterval = 0,
    prefix,
    suffix,
    size = 'middle',
    variant = 'default',
    bordered = false,
    celebrate = false,
    onUpdate,
    onComplete,
    children,
    className,
    ...rest
}) => {
    const places = decimalPlaces ?? Math.max(decimalCount(start), decimalCount(end));

    const [display, setDisplay] = useState(start);
    const [counting, setCounting] = useState(false);
    const [celebrating, setCelebrating] = useState(false);
    const [runToken, setRunToken] = useState(0);

    const frameRef = useRef<number | null>(null);
    const repeatTimerRef = useRef<number | null>(null);
    const celebrateTimerRef = useRef<number | null>(null);
    const elapsedRef = useRef(0);
    const lastTimestampRef = useRef<number | null>(null);
    const completedRef = useRef(false);
    const pendingStartRef = useRef<number | undefined>(undefined);
    const formattedRef = useRef<string | null>(null);
    const targetRef = useRef(`${start}|${end}|${duration}`);
    const tokenRef = useRef(0);

    const formatRef = useRef<(value: number) => React.ReactNode>(() => null);
    const easingRef = useRef(easing);
    const updateIntervalRef = useRef(updateInterval);
    const onUpdateRef = useRef(onUpdate);
    const onCompleteRef = useRef(onComplete);
    const celebrateRef = useRef(celebrate);

    formatRef.current = (value) =>
        formatter ? formatter(value) : formatNumber(value, places, decimalSeparator, thousandsSeparator);
    easingRef.current = easing;
    updateIntervalRef.current = updateInterval;
    onUpdateRef.current = onUpdate;
    onCompleteRef.current = onComplete;
    celebrateRef.current = celebrate;

    useEffect(() => {
        const clearFrame = () => {
            if (frameRef.current !== null) {
                cancelAnimationFrame(frameRef.current);
                frameRef.current = null;
            }
        };
        const clearRepeat = () => {
            if (repeatTimerRef.current !== null) {
                window.clearTimeout(repeatTimerRef.current);
                repeatTimerRef.current = null;
            }
        };
        const commit = (next: number, force = false) => {
            const rendered = formatRef.current(next);
            const key = typeof rendered === 'string' || typeof rendered === 'number' ? String(rendered) : null;
            if (!force && key !== null && key === formattedRef.current) return;
            formattedRef.current = key;
            setDisplay(next);
        };

        const finish = (elapsedMs: number) => {
            completedRef.current = true;
            lastTimestampRef.current = null;
            setCounting(false);
            commit(end, true);

            if (celebrateRef.current) {
                setCelebrating(true);
                if (celebrateTimerRef.current !== null) {
                    window.clearTimeout(celebrateTimerRef.current);
                }
                celebrateTimerRef.current = window.setTimeout(() => {
                    celebrateTimerRef.current = null;
                    setCelebrating(false);
                }, CELEBRATE_DURATION);
            }

            const result = onCompleteRef.current?.(elapsedMs / 1_000);
            if (result && result.shouldRepeat) {
                clearRepeat();
                repeatTimerRef.current = window.setTimeout(
                    () => {
                        repeatTimerRef.current = null;
                        pendingStartRef.current = result.newStartAt;
                        setRunToken((token) => token + 1);
                    },
                    Math.max(0, result.delay ?? 0) * 1_000
                );
            }
        };

        const totalMs = Math.max(0, duration) * 1_000;

        const step = (timestamp: number): void => {
            frameRef.current = null;
            if (lastTimestampRef.current === null) {
                lastTimestampRef.current = timestamp;
                frameRef.current = requestAnimationFrame(step);
                return;
            }

            elapsedRef.current += timestamp - lastTimestampRef.current;
            lastTimestampRef.current = timestamp;

            const elapsed = elapsedRef.current;
            const intervalMs = Math.max(0, updateIntervalRef.current) * 1_000;
            const quantized = intervalMs > 0 ? Math.floor(elapsed / intervalMs) * intervalMs : elapsed;
            const done = elapsed >= totalMs;
            const progress = done ? 1 : Math.min(1, Math.max(0, quantized / totalMs));
            const next = done ? end : start + (end - start) * resolveEasing(easingRef.current)(progress);

            onUpdateRef.current?.(next);

            if (done) {
                finish(elapsed);
                return;
            }

            commit(next);
            frameRef.current = requestAnimationFrame(step);
        };

        const target = `${start}|${end}|${duration}`;
        const restart = target !== targetRef.current || runToken !== tokenRef.current;
        const pendingStart = pendingStartRef.current;
        targetRef.current = target;
        tokenRef.current = runToken;

        if (restart) {
            elapsedRef.current = 0;
            lastTimestampRef.current = null;
            completedRef.current = false;
            setCelebrating(false);
            commit(typeof pendingStart === 'number' ? pendingStart : start, true);
        }
        pendingStartRef.current = undefined;

        if (!isCounting || completedRef.current) {
            setCounting(false);
            return undefined;
        }

        if (typeof requestAnimationFrame !== 'function' || typeof cancelAnimationFrame !== 'function') {
            setCounting(false);
            return undefined;
        }

        if (totalMs === 0) {
            finish(0);
            return () => {
                clearFrame();
                clearRepeat();
            };
        }

        lastTimestampRef.current = null;
        setCounting(true);
        frameRef.current = requestAnimationFrame(step);

        return () => {
            clearFrame();
            clearRepeat();
        };
    }, [isCounting, start, end, duration, runToken]);

    useEffect(
        () => () => {
            if (celebrateTimerRef.current !== null) {
                window.clearTimeout(celebrateTimerRef.current);
            }
        },
        []
    );

    const reset = useCallback((newStartAt?: number) => {
        pendingStartRef.current = newStartAt;
        setRunToken((token) => token + 1);
    }, []);

    const content = typeof children === 'function' ? children({ value: display, reset }) : formatRef.current(display);
    const readable = counting ? '' : formatNumber(display, places, decimalSeparator, thousandsSeparator);
    const celebrateText = typeof celebrate === 'object' ? celebrate.text : undefined;

    return (
        <div
            className={cn(
                'animal-count-up',
                `animal-count-up-${size}`,
                `animal-count-up-${variant}`,
                bordered && 'animal-count-up-bordered',
                celebrating && 'animal-count-up-celebrating',
                className
            )}
            role="status"
            {...rest}
        >
            <span className="animal-count-up-plate-wrap">
                {celebrating && (
                    <span className="animal-count-up-effects" aria-hidden="true">
                        <span className="animal-count-up-ring" />
                        <span className="animal-count-up-ring" />
                        <span className="animal-count-up-sparkles">
                            <span className="animal-count-up-sparkle" />
                            <span className="animal-count-up-sparkle" />
                            <span className="animal-count-up-sparkle" />
                            <span className="animal-count-up-sparkle" />
                        </span>
                        {celebrateText !== undefined && (
                            <span className="animal-count-up-badge-wrap">
                                <span className="animal-count-up-badge">{celebrateText}</span>
                            </span>
                        )}
                    </span>
                )}
                <span className="animal-count-up-plate" aria-hidden="true">
                    {prefix !== undefined && <span className="animal-count-up-affix">{prefix}</span>}
                    <span className="animal-count-up-number">{content}</span>
                    {suffix !== undefined && <span className="animal-count-up-affix">{suffix}</span>}
                </span>
            </span>
            <span className="animal-count-up-sr-only">{readable}</span>
        </div>
    );
};

CountUp.displayName = 'CountUp';
