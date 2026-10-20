import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cn } from '../../utils/cn';

export interface BackTopProps {
    target?: () => HTMLElement | Window;
    visibilityHeight?: number;
    onClick?: React.MouseEventHandler<HTMLDivElement>;
    className?: string;
    style?: React.CSSProperties;
    duration?: number;
}

export const BackTop: React.FC<BackTopProps> = ({
    target,
    visibilityHeight = 400,
    onClick,
    className,
    style,
    duration = 300,
}) => {
    const [visible, setVisible] = useState(false);
    const rafRef = useRef<number>(0);

    useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

    const getTarget = useCallback(() => {
        return target ? target() : window;
    }, [target]);

    const handleScroll = useCallback(() => {
        const el = getTarget();
        const scrollTop = el === window ? window.scrollY : (el as HTMLElement).scrollTop;
        setVisible(scrollTop > visibilityHeight);
    }, [getTarget, visibilityHeight]);

    useEffect(() => {
        const el = getTarget();
        el.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => el.removeEventListener('scroll', handleScroll);
    }, [getTarget, handleScroll]);

    const scrollToTop = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            const el = getTarget();
            const start = el === window ? window.scrollY : (el as HTMLElement).scrollTop;
            const startTime = performance.now();

            const animate = (now: number) => {
                const elapsed = now - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = progress < 0.5 ? 2 * progress * progress : 1 - (-2 * progress + 2) ** 2 / 2;
                const current = start * (1 - eased);

                if (el === window) {
                    window.scrollTo(0, current);
                } else {
                    (el as HTMLElement).scrollTop = current;
                }

                if (progress < 1) {
                    rafRef.current = requestAnimationFrame(animate);
                }
            };

            cancelAnimationFrame(rafRef.current);
            rafRef.current = requestAnimationFrame(animate);
            onClick?.(e);
        },
        [getTarget, duration, onClick]
    );

    return (
        <div
            className={cn('animal-backtop', visible && 'animal-backtop-visible', className)}
            style={style}
            onClick={scrollToTop}
            role="button"
            tabIndex={0}
            aria-label="返回顶部"
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    scrollToTop(e as unknown as React.MouseEvent<HTMLDivElement>);
                }
            }}
        >
            <svg
                className="animal-backtop-rocket"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                stroke="#2A2A2A"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
            >
                <path d="M24 6 C 16 6 14 18 14 26 L14 38 L34 38 L34 26 C 34 18 32 6 24 6 Z" fill="#FAEDCD" />
                <circle cx="24" cy="22" r="5" fill="#2A9D8F" />
                <path d="M14 30 L8 36 L8 42 L14 38" fill="#E76F51" />
                <path d="M34 30 L40 36 L40 42 L34 38" fill="#E76F51" />
                <path d="M18 42 L24 46 L30 42" fill="#E76F51" />
            </svg>
        </div>
    );
};

BackTop.displayName = 'BackTop';
