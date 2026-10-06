import React, { useCallback, useId, useRef, useState } from 'react';
import { Star as StarIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

export type RateSize = 'small' | 'middle' | 'large';

export interface RateProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
    value?: number;
    defaultValue?: number;
    count?: number;
    size?: RateSize;
    readonly?: boolean;
    allowClear?: boolean;
    onChange?: (value: number) => void;
}

interface RateBurst {
    from: number;
    to: number;
    seq: number;
}

const BURST_STEP_MS = 60;

const toStarCount = (value: number, count: number) => Math.min(count, Math.max(0, Math.round(value)));

export const Rate: React.FC<RateProps> = ({
    value,
    defaultValue = 0,
    count = 5,
    size = 'middle',
    readonly = false,
    allowClear = true,
    onChange,
    className,
    style,
    onKeyDown,
    onMouseLeave,
    ...rest
}) => {
    const [innerValue, setInnerValue] = useState(defaultValue);
    const [hoverValue, setHoverValue] = useState(0);
    const [burst, setBurst] = useState<RateBurst>({ from: 0, to: 0, seq: 0 });

    const isControlled = value !== undefined;
    const rateValue = isControlled ? value! : innerValue;
    const displayValue = !readonly && hoverValue > 0 ? hoverValue : rateValue;
    const filledCount = toStarCount(displayValue, count);
    const checkedValue = toStarCount(rateValue, count);

    const reactId = useId();
    const groupName = `animal-rate-${reactId.replace(/:/g, '')}`;
    const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

    const commit = useCallback(
        (next: number) => {
            if (readonly || next === rateValue) return;
            if (!isControlled) setInnerValue(next);
            if (next === 0) setHoverValue(0);
            setBurst((prev) => ({ from: checkedValue, to: next, seq: prev.seq + 1 }));
            onChange?.(next);
        },
        [readonly, rateValue, checkedValue, isControlled, onChange]
    );

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLDivElement>) => {
            onKeyDown?.(e);
            if (readonly) return;

            let next = 0;
            switch (e.key) {
                case 'ArrowRight':
                case 'ArrowUp':
                    next = Math.min(count, checkedValue + 1);
                    break;
                case 'ArrowLeft':
                case 'ArrowDown':
                    next = Math.max(1, checkedValue - 1);
                    break;
                case 'Home':
                    next = 1;
                    break;
                case 'End':
                    next = count;
                    break;
                default:
                    return;
            }
            e.preventDefault();
            setHoverValue(0);
            inputRefs.current[next - 1]?.focus();
            commit(next);
        },
        [onKeyDown, readonly, checkedValue, count, commit]
    );

    const handleMouseLeave = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            setHoverValue(0);
            onMouseLeave?.(e);
        },
        [onMouseLeave]
    );

    return (
        <div
            role="radiogroup"
            aria-label="评分"
            aria-readonly={readonly || undefined}
            tabIndex={readonly ? undefined : 0}
            className={cn('animal-rate', `animal-rate-${size}`, readonly && 'animal-rate-readonly', className)}
            style={style}
            onKeyDown={handleKeyDown}
            onMouseLeave={handleMouseLeave}
            {...rest}
        >
            {Array.from({ length: count }, (_, index) => {
                const starValue = index + 1;
                const isActive = index < filledCount;
                const isChecked = checkedValue === starValue;
                const isTabStop = checkedValue > 0 ? isChecked : index === 0;
                const isBursting = burst.to > burst.from && index >= burst.from && index < burst.to;
                const isSplash = burst.to > burst.from && index === burst.to - 1;

                return (
                    <label
                        key={starValue}
                        className={cn('animal-rate-item', isActive && 'animal-rate-active')}
                        onMouseEnter={readonly ? undefined : () => setHoverValue(starValue)}
                    >
                        <input
                            ref={(el) => {
                                inputRefs.current[index] = el;
                            }}
                            className="animal-rate-input"
                            type="radio"
                            name={groupName}
                            checked={isChecked}
                            disabled={readonly}
                            tabIndex={!readonly && isTabStop ? 0 : -1}
                            aria-label={`${starValue} 星`}
                            onChange={() => commit(starValue)}
                            onClick={() => {
                                if (allowClear && checkedValue === starValue) commit(0);
                            }}
                        />
                        {isSplash && <span key={`splash-${burst.seq}`} className="animal-rate-splash" aria-hidden="true" />}
                        <span
                            key={isBursting ? `star-${burst.seq}` : 'star'}
                            className={cn('animal-rate-star', isBursting && 'animal-rate-pop')}
                            style={
                                isBursting
                                    ? ({
                                          '--rate-pop-delay': `${(index - burst.from) * BURST_STEP_MS}ms`,
                                      } as React.CSSProperties)
                                    : undefined
                            }
                        >
                            <StarIcon className="animal-rate-icon" aria-hidden="true" />
                        </span>
                    </label>
                );
            })}
        </div>
    );
};

Rate.displayName = 'Rate';
