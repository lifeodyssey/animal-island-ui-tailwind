import React, { useState, useEffect, useCallback } from 'react';
import { cn } from '../../utils/cn';
import base64 from './back-top.base64?raw';

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
                    requestAnimationFrame(animate);
                }
            };

            requestAnimationFrame(animate);
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
            <img
                className="animal-backtop-img"
                src={`data:image/png;base64,${base64.trim()}`}
                alt="返回顶部"
            />
        </div>
    );
};

BackTop.displayName = 'BackTop';
