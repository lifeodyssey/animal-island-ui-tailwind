import React, { useState, useEffect, useCallback } from 'react';
import { cn } from '../../utils/cn';
import base64 from './back-top.base64?raw';

export interface BackTopProps {
    /** Scroll distance from top (px) before the button appears */
    visibilityHeight?: number;
    /** Scroll duration in ms */
    duration?: number;
    /** Target element to scroll (defaults to window) */
    target?: () => HTMLElement | Window | Document;
    className?: string;
    style?: React.CSSProperties;
    onClick?: () => void;
}

export const BackTop: React.FC<BackTopProps> = ({
    visibilityHeight = 400,
    duration = 450,
    target,
    className,
    style,
    onClick,
}) => {
    const [visible, setVisible] = useState(false);

    const getScrollTarget = useCallback((): HTMLElement | Window => {
        if (target) {
            const el = target();
            if (el instanceof HTMLElement) return el;
        }
        return window;
    }, [target]);

    const handleScroll = useCallback(() => {
        const el = getScrollTarget();
        const scrollTop =
            el === window
                ? window.scrollY
                : (el as HTMLElement).scrollTop;
        setVisible(scrollTop > visibilityHeight);
    }, [getScrollTarget, visibilityHeight]);

    useEffect(() => {
        const el = getScrollTarget();
        el.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => el.removeEventListener('scroll', handleScroll);
    }, [getScrollTarget, handleScroll]);

    const scrollToTop = useCallback(() => {
        onClick?.();
        const el = getScrollTarget();
        const isWindow = el === window;
        const start = isWindow
            ? window.scrollY
            : (el as HTMLElement).scrollTop;

        if (start === 0) return;

        const startTime = performance.now();

        const ease = (t: number) => 1 - Math.pow(1 - t, 3);

        const step = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedValue = start * (1 - ease(progress));

            if (isWindow) {
                window.scrollTo(0, easedValue);
            } else {
                (el as HTMLElement).scrollTop = easedValue;
            }

            if (progress < 1) {
                requestAnimationFrame(step);
            }
        };

        requestAnimationFrame(step);
    }, [getScrollTarget, duration, onClick]);

    return (
        <button
            type="button"
            className={cn('animal-backtop', visible && 'animal-backtop-visible', className)}
            style={style}
            aria-label="Back to top"
            onClick={scrollToTop}
        >
            <img
                className="animal-backtop-img"
                src={`data:image/png;base64,${base64}`}
                alt=""
                aria-hidden="true"
            />
        </button>
    );
};

BackTop.displayName = 'BackTop';
