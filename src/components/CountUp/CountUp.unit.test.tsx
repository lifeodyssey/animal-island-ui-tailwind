import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CountUp } from './CountUp';

describe('CountUp animation restarts', () => {
    let frames: Map<number, FrameRequestCallback>;
    let frameId: number;
    const tick = (timestamp: number) => {
        act(() => {
            const pending = [...frames.values()];
            frames.clear();
            pending.forEach((callback) => callback(timestamp));
        });
    };

    beforeEach(() => {
        frames = new Map();
        frameId = 0;
        vi.useFakeTimers();
        vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
            frames.set(++frameId, callback);
            return frameId;
        });
        vi.stubGlobal('cancelAnimationFrame', (id: number) => { frames.delete(id); });
    });

    afterEach(() => {
        cleanup();
        vi.unstubAllGlobals();
        vi.useRealTimers();
    });

    it('interpolates from reset(newStartAt) and retains that start across pause/resume', () => {
        const content = ({ value, reset }: { value: number; reset: (start?: number) => void }) => (
            <button onClick={() => reset(50)}>{value}</button>
        );
        const { rerender } = render(
            <CountUp start={0} end={100} duration={1} easing="linear" isCounting>{content}</CountUp>
        );
        fireEvent.click(screen.getByRole('button', { hidden: true }));
        expect(screen.getByRole('button', { hidden: true })).toHaveTextContent('50');
        tick(0);
        tick(200);
        expect(screen.getByRole('button', { hidden: true })).toHaveTextContent('60');

        rerender(<CountUp start={0} end={100} duration={1} easing="linear">{content}</CountUp>);
        tick(700);
        rerender(<CountUp start={0} end={100} duration={1} easing="linear" isCounting>{content}</CountUp>);
        tick(800);
        tick(1_000);
        expect(screen.getByRole('button', { hidden: true })).toHaveTextContent('70');
    });

    it('uses onComplete.newStartAt for every frame of a repeated run', () => {
        const onComplete = vi.fn().mockReturnValueOnce({ shouldRepeat: true, delay: 0.5, newStartAt: 40 });
        const { container } = render(
            <CountUp start={0} end={100} duration={1} easing="linear" isCounting onComplete={onComplete} />
        );
        tick(0);
        tick(1_000);
        expect(onComplete).toHaveBeenCalledTimes(1);
        act(() => vi.advanceTimersByTime(500));
        expect(container.querySelector('.animal-count-up-number')).toHaveTextContent('40');
        tick(1_500);
        tick(2_000);
        expect(container.querySelector('.animal-count-up-number')).toHaveTextContent('70');
    });
});
