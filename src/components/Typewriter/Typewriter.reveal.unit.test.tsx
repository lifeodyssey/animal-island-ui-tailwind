import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, act, cleanup } from '@testing-library/react';
import { Typewriter } from './Typewriter';

/**
 * Incremental-reveal guardrail. Source of truth: upstream Typewriter.tsx
 * (guokaigdg/animal-island-ui) — autoPlay default true, a window.setInterval
 * ticking `count` 0→total at `speed` ms, slicing children to `count` chars,
 * firing onDone at completion. Our implementation is line-for-line equivalent;
 * this pins the timing behavior, which the browser story runner can't assert
 * (no fake timers there).
 */
beforeEach(() => {
    vi.useFakeTimers();
});
afterEach(() => {
    vi.useRealTimers();
    cleanup();
});

describe('Typewriter incremental reveal (upstream parity)', () => {
    it('autoPlay reveals one character per speed tick', () => {
        let host!: HTMLElement;
        act(() => {
            host = render(<Typewriter speed={50}>ABCDE</Typewriter>).container;
        });
        expect(host.textContent).toBe(''); // t=0, count=0
        act(() => {
            vi.advanceTimersByTime(50);
        });
        expect(host.textContent).toBe('A');
        act(() => {
            vi.advanceTimersByTime(150);
        });
        expect(host.textContent).toBe('ABCD');
        act(() => {
            vi.advanceTimersByTime(50);
        });
        expect(host.textContent).toBe('ABCDE');
    });

    it('autoPlay=false shows the full text immediately', () => {
        let host!: HTMLElement;
        act(() => {
            host = render(
                <Typewriter autoPlay={false} speed={50}>
                    ABCDE
                </Typewriter>,
            ).container;
        });
        expect(host.textContent).toBe('ABCDE');
    });

    it('fires onDone once the reveal completes', () => {
        const onDone = vi.fn();
        act(() => {
            render(
                <Typewriter speed={50} onDone={onDone}>
                    AB
                </Typewriter>,
            );
        });
        expect(onDone).not.toHaveBeenCalled();
        act(() => {
            vi.advanceTimersByTime(100);
        });
        expect(onDone).toHaveBeenCalled();
    });
});
