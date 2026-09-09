import React, { useEffect, useRef } from 'react';
import { cn } from '../../utils/cn';

import islandImage from './assets/island.png';
import fishImage from './assets/fish.png';

export interface LoadingProps {
    className?: string;
    style?: React.CSSProperties;
    active?: boolean;
}

export function Loading({ className, style, active = true }: LoadingProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const preContainerRef = useRef<HTMLDivElement>(null);
    const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (!preContainerRef.current || !containerRef.current) return;

        const container = containerRef.current;
        const rect = container.getBoundingClientRect();
        const finalR = Math.ceil(Math.hypot(rect.width, rect.height) / 2) + 50;
        const duration = Math.max(0.1, finalR / 1500);

        // Clear any pending hide timer before processing the new state
        if (hideTimerRef.current !== null) {
            clearTimeout(hideTimerRef.current);
            hideTimerRef.current = null;
        }

        if (active) {
            container.classList.remove('animal-loading-closing');
            container.style.transition = '';
            container.style.setProperty('--mask-r', '0px');
            container.style.display = 'flex';
        } else {
            container.classList.add('animal-loading-closing');
            container.style.transition = '';
            container.style.setProperty('--mask-r', '0px');
            // Force reflow so the initial value takes effect
            void container.offsetHeight;
            container.style.transition = `--mask-r ${duration}s linear`;
            container.style.setProperty('--mask-r', `${finalR}px`);
            hideTimerRef.current = setTimeout(() => {
                hideTimerRef.current = null;
                if (containerRef.current) {
                    containerRef.current.style.display = 'none';
                }
            }, duration * 1000);
        }

        return () => {
            if (hideTimerRef.current !== null) {
                clearTimeout(hideTimerRef.current);
                hideTimerRef.current = null;
            }
        };
    }, [active]);

    return (
        <div ref={preContainerRef} className="animal-loading-wrapper">
            <div ref={containerRef} className={cn('animal-loading-container', className)} style={style} data-active={active} role="status" aria-label="正在加载">
                <div className="animal-loading-artwork" aria-hidden="true">
                    <span className="animal-loading-water animal-loading-water-back" />
                    <img className="animal-loading-fish" src={fishImage} alt="" draggable={false} />
                    <img className="animal-loading-island" src={islandImage} alt="" draggable={false} />
                    <span className="animal-loading-water animal-loading-water-front" />
                    <span className="animal-loading-ripple" />
                </div>
            </div>
        </div>
    );
}

Loading.displayName = 'Loading';
