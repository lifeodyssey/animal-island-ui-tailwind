import React, { useCallback, useEffect, useRef, useState } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../utils/cn';

export type CountdownSize = 'small' | 'middle' | 'large';
export type CountdownVariant = 'default' | 'island';

export interface CountdownProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'prefix'> {
    value: number | Date;
    format?: string;
    prefix?: React.ReactNode;
    size?: CountdownSize;
    variant?: CountdownVariant;
    onChange?: (remaining: number) => void;
    onFinish?: () => void;
}

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
    },
    defaultVariants: { size: 'middle', variant: 'default' },
});

const toTimestamp = (value: number | Date) => (value instanceof Date ? value.getTime() : value);
const pad = (value: number) => String(value).padStart(2, '0');

const formatRemaining = (remaining: number, format: string) => {
    const totalSeconds = Math.ceil(remaining / 1_000);
    const days = Math.floor(totalSeconds / 86_400);
    const hasDays = format.includes('DD');
    const hours = hasDays ? Math.floor((totalSeconds % 86_400) / 3_600) : Math.floor(totalSeconds / 3_600);
    const minutes = Math.floor((totalSeconds % 3_600) / 60);
    const seconds = totalSeconds % 60;
    return format
        .replace(/DD/g, pad(days))
        .replace(/HH/g, pad(hours))
        .replace(/mm/g, pad(minutes))
        .replace(/ss/g, pad(seconds));
};

export const Countdown: React.FC<CountdownProps> = ({
    value,
    format = 'HH:mm:ss',
    prefix,
    size = 'middle',
    variant = 'default',
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
        const update = () => {
            const next = getRemaining();
            setRemaining(next);
            onChangeRef.current?.(next);
            if (next === 0 && !finishedRef.current) {
                finishedRef.current = true;
                onFinishRef.current?.();
            }
            return next;
        };
        if (update() === 0) return;
        const timer = window.setInterval(update, 250);
        return () => window.clearInterval(timer);
    }, [getRemaining]);

    return (
        <div
            className={cn(countdownVariants({ size, variant }), className)}
            role="timer"
            aria-live="off"
            {...rest}
        >
            {prefix !== undefined && <span className="animal-countdown-prefix">{prefix}</span>}
            <span className="animal-countdown-value">{formatRemaining(remaining, format)}</span>
        </div>
    );
};

Countdown.displayName = 'Countdown';
