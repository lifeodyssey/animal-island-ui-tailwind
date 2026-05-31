import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

/**
 * Closing-animation guardrail. Source of truth: upstream Loading.tsx:117-136
 * (guokaigdg/animal-island-ui) — on active=false the container gains the
 * closing class, a `--mask-r` transition (0 → finalR over `duration`s linear),
 * and is hidden via display:none after the timer; on active=true it clears
 * the closing class, resets --mask-r, and restores display:flex. Browser
 * story coverage was only "hidden within 1500ms"; this pins the mechanism.
 *
 * gsap is mocked (the idle-tween effect must run without a real animation
 * engine); jsdom getBoundingClientRect() returns 0 → finalR=50, duration=0.1.
 */
vi.mock('gsap', () => {
    const noop = () => ({});
    const gsap = {
        to: vi.fn(noop),
        fromTo: vi.fn(noop),
        set: vi.fn(noop),
        context: vi.fn((fn: () => void) => {
            fn();
            return { revert: vi.fn() };
        }),
        registerPlugin: vi.fn(),
        globalTimeline: { pause: vi.fn() },
    };
    return { gsap, default: gsap };
});
vi.mock('gsap/MotionPathPlugin', () => ({ MotionPathPlugin: {} }));

import { render, act, cleanup } from '@testing-library/react';
import { Loading } from './Loading';

beforeEach(() => {
    vi.useFakeTimers();
});
afterEach(() => {
    vi.useRealTimers();
    cleanup();
});

const containerOf = (root: HTMLElement) =>
    root.querySelector('.animal-loading-container') as HTMLElement;

describe('Loading closing animation (upstream parity)', () => {
    it('active=false adds closing class + mask-r transition, then hides', () => {
        let api!: ReturnType<typeof render>;
        act(() => {
            api = render(<Loading active />);
        });
        const el = containerOf(api.container);
        expect(el.classList.contains('animal-loading-closing')).toBe(false);

        act(() => {
            api.rerender(<Loading active={false} />);
        });
        expect(el.classList.contains('animal-loading-closing')).toBe(true);
        expect(el.style.transition).toContain('--mask-r');
        // jsdom rect is 0 → finalR = ceil(hypot(0,0)/2)+50 = 50
        expect(el.style.getPropertyValue('--mask-r')).toBe('50px');

        act(() => {
            vi.advanceTimersByTime(200);
        });
        expect(el.style.display).toBe('none');
    });

    it('re-activating clears the closing class and restores display:flex', () => {
        let api!: ReturnType<typeof render>;
        act(() => {
            api = render(<Loading active={false} />);
        });
        const el = containerOf(api.container);
        act(() => {
            api.rerender(<Loading active />);
        });
        expect(el.classList.contains('animal-loading-closing')).toBe(false);
        expect(el.style.display).toBe('flex');
        expect(el.style.getPropertyValue('--mask-r')).toBe('0px');
    });
});
