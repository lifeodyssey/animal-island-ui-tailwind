import React, { useCallback, useEffect, useRef, useState } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../utils/cn';

export type CountdownSize = 'small' | 'middle' | 'large';
export type CountdownVariant = 'default' | 'island';

export interface CountdownProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'prefix'> {
    /** 结束时间，可以传时间戳或 Date */
    value: number | Date;
    /** 输出格式，支持 DD、HH、mm、ss，默认 HH:mm:ss */
    format?: string;
    /** 倒计时前的说明内容 */
    prefix?: React.ReactNode;
    /** 尺寸 */
    size?: CountdownSize;
    /** 显示风格 */
    variant?: CountdownVariant;
    /** 数字块是否带边框，默认无 */
    bordered?: boolean;
    /** 剩余毫秒变化时触发 */
    onChange?: (remaining: number) => void;
    /** 倒计时归零时触发 */
    onFinish?: () => void;
}

const toTimestamp = (value: number | Date) => (value instanceof Date ? value.getTime() : value);

const pad = (value: number) => String(value).padStart(2, '0');

type TimePart = { kind: 'token'; token: 'DD' | 'HH' | 'mm' | 'ss' } | { kind: 'literal'; text: string };

const parseFormat = (format: string): TimePart[] => {
    const parts: TimePart[] = [];
    const re = /DD|HH|mm|ss/g;
    let last = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(format)) !== null) {
        if (m.index > last) parts.push({ kind: 'literal', text: format.slice(last, m.index) });
        parts.push({ kind: 'token', token: m[0] as 'DD' | 'HH' | 'mm' | 'ss' });
        last = m.index + m[0].length;
    }
    if (last < format.length) parts.push({ kind: 'literal', text: format.slice(last) });
    return parts;
};

const splitRemaining = (remaining: number, format: string) => {
    const totalSeconds = Math.ceil(remaining / 1_000);
    const days = Math.floor(totalSeconds / 86_400);
    const hasDays = format.includes('DD');
    const hours = hasDays ? Math.floor((totalSeconds % 86_400) / 3_600) : Math.floor(totalSeconds / 3_600);
    const minutes = Math.floor((totalSeconds % 3_600) / 60);
    const seconds = totalSeconds % 60;
    return { DD: pad(days), HH: pad(hours), mm: pad(minutes), ss: pad(seconds) } as const;
};

const DIGIT_FACES = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'] as const;

const DigitRoll = ({ digit }: { digit: string }) => {
    const stripRef = useRef<HTMLSpanElement>(null);
    const posRef = useRef(Number(digit));
    const prevDigit = useRef(digit);

    useEffect(() => {
        const el = stripRef.current;
        if (!el) return;
        const prev = Number(prevDigit.current);
        const next = Number(digit);
        prevDigit.current = digit;
        if (prev === next) return;

        const delta = (prev - next + 10) % 10;
        let from = posRef.current;
        let target = from - delta;

        if (target < 0) {
            from += 10;
            target = from - delta;
            el.style.transition = 'none';
            el.style.transform = `translateY(-${from * 5}%)`;
            void el.offsetHeight;
            el.style.transition = '';
        }

        posRef.current = target;
        el.style.transform = `translateY(-${target * 5}%)`;
    }, [digit]);

    return (
        <span className="animal-countdown-digit-cell">
            <span
                ref={stripRef}
                className="animal-countdown-digit-strip"
                style={{ transform: `translateY(-${posRef.current * 5}%)` }}
            >
                {[...DIGIT_FACES, ...DIGIT_FACES].map((face, i) => (
                    <span key={i} className="animal-countdown-digit-face">
                        {face}
                    </span>
                ))}
            </span>
        </span>
    );
};

const countdownVariants = cva('animal-countdown', {
    variants: {
        size: {
            small: 'animal-countdown-small',
            middle: 'animal-countdown-middle',
            large: 'animal-countdown-large',
        },
        variant: {
            default: 'animal-countdown-default',
            island: 'animal-countdown-island',
        },
        bordered: { true: 'animal-countdown-bordered' },
    },
    defaultVariants: { size: 'middle', variant: 'default' },
});

export const Countdown: React.FC<CountdownProps> = ({
    value,
    format = 'HH:mm:ss',
    prefix,
    size = 'middle',
    variant = 'default',
    bordered = false,
    onChange,
    onFinish,
    className,
    ...rest
}) => {
    const getRemaining = useCallback(() => Math.max(0, toTimestamp(value) - Date.now()), [value]);
    const [remaining, setRemaining] = useState(getRemaining);
    const finishedRef = useRef(false);
    const onChangeRef = useRef(onChange);
    const onFinishRef = useRef(onFinish);

    onChangeRef.current = onChange;
    onFinishRef.current = onFinish;

    useEffect(() => {
        finishedRef.current = false;
        let timer: number | undefined;

        const update = () => {
            const next = getRemaining();
            setRemaining(next);
            onChangeRef.current?.(next);

            if (next === 0) {
                if (!finishedRef.current) {
                    finishedRef.current = true;
                    onFinishRef.current?.();
                }
                if (timer !== undefined) {
                    window.clearInterval(timer);
                    timer = undefined;
                }
            }
            return next;
        };

        if (update() > 0) {
            timer = window.setInterval(update, 250);
        }

        return () => {
            if (timer !== undefined) window.clearInterval(timer);
        };
    }, [getRemaining]);

    const parts = parseFormat(format);
    const digits = splitRemaining(remaining, format);
    const readable = parts.map((part) => (part.kind === 'token' ? digits[part.token] : part.text)).join('');

    return (
        <div
            className={cn(countdownVariants({ size, variant, bordered }), className)}
            role="timer"
            aria-live="off"
            {...rest}
        >
            {prefix !== undefined && <span className="animal-countdown-prefix">{prefix}</span>}
            <span className="animal-countdown-group" aria-hidden="true">
                {parts.map((part, i) =>
                    part.kind === 'token' ? (
                        <span key={`${part.token}-${i}`} className="animal-countdown-unit">
                            {digits[part.token].split('').map((d, j) => (
                                <DigitRoll key={`${part.token}-${j}`} digit={d} />
                            ))}
                        </span>
                    ) : (
                        <span key={`sep-${i}`} className={/[:：]/.test(part.text) ? 'animal-countdown-colon' : 'animal-countdown-sep'}>
                            {part.text}
                        </span>
                    )
                )}
            </span>
            <span className="animal-countdown-sr-only">{readable}</span>
        </div>
    );
};

Countdown.displayName = 'Countdown';
