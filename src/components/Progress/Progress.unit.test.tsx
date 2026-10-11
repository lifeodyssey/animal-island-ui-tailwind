import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, render, screen } from '@testing-library/react';
import { Progress } from './Progress';
import type { ProgressInfoPosition, ProgressVariant } from './types';

afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
});

const getFill = (container: HTMLElement) =>
    container.querySelector<HTMLElement>('.animal-progress-fill')!;

describe('Progress', () => {
    it.each([
        { percent: -10, width: '0%', value: '0' },
        { percent: 0, width: '0%', value: '0' },
        { percent: Number.NaN, width: '0%', value: '0' },
        { percent: 42.6, width: '42.6%', value: '43' },
        { percent: 100, width: '100%', value: '100' },
        { percent: 150, width: '100%', value: '100' },
    ])('exposes bounded progress for $percent', ({ percent, width, value }) => {
        const { container } = render(<Progress percent={percent} aria-label="Upload progress" />);
        const progress = screen.getByRole('progressbar', { name: 'Upload progress' });

        expect(progress).toHaveAttribute('aria-valuemin', '0');
        expect(progress).toHaveAttribute('aria-valuemax', '100');
        expect(progress).toHaveAttribute('aria-valuenow', value);
        expect(progress).toHaveAttribute('aria-valuetext', `${value}%`);
        expect(getFill(container).style.width).toBe(width);
    });

    it('retains inside information by default with a stylesheet-controlled fill', () => {
        const { container } = render(<Progress percent={75} />);
        const fill = getFill(container);

        expect(fill).toContainElement(screen.getByText('75%'));
        expect(fill.style.backgroundColor).toBe('');
        expect(fill.style.backgroundImage).toBe('');
    });

    it('keeps low-percent information readable outside the narrow fill', () => {
        const { container } = render(<Progress percent={5} infoPosition="inside" />);
        const info = screen.getByText('5%');

        expect(getFill(container)).not.toContainElement(info);
        expect(container.querySelector('.animal-progress-track')).toContainElement(info);
    });

    it.each<ProgressInfoPosition>(['inside', 'right', 'top'])(
        'preserves the legacy %s information placement',
        (infoPosition) => {
            const { container } = render(<Progress percent={75} infoPosition={infoPosition} />);
            const info = screen.getByText('75%');

            expect(info).toHaveClass(
                infoPosition === 'inside'
                    ? 'animal-progress-info-inside'
                    : `animal-progress-info-${infoPosition}`,
            );
            if (infoPosition !== 'inside') {
                expect(getFill(container)).not.toContainElement(info);
            }
        },
    );

    it.each<ProgressInfoPosition>(['inside', 'right', 'top'])(
        'hides information for the legacy %s placement when requested',
        (infoPosition) => {
            render(<Progress percent={75} infoPosition={infoPosition} showInfo={false} />);

            expect(screen.queryByText('75%')).not.toBeInTheDocument();
            expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '75');
        },
    );

    it('formats the bounded value and exposes string information to assistive technology', () => {
        const infoFormat = vi.fn((percent: number) => `${percent} of 100 files`);
        render(<Progress percent={150} infoFormat={infoFormat} />);

        expect(infoFormat).toHaveBeenCalledWith(100);
        expect(screen.getByText('100 of 100 files')).toBeInTheDocument();
        expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuetext', '100 of 100 files');
    });

    it.each<ProgressVariant>(['sweet-corner', 'forest-grove', 'starry-camp', 'coffee-break'])(
        'uses the %s scene and keeps information on the right',
        (variant) => {
            const { container } = render(<Progress percent={100} variant={variant} infoPosition="top" />);
            const fill = getFill(container);

            expect(fill.style.backgroundImage).toContain(variant);
            expect(fill).toHaveStyle({ backgroundSize: '100% auto' });
            expect(fill.style.width).toBe('100%');
            expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
            expect(screen.getByText('100%')).toHaveClass('animal-progress-info-right');
        },
    );

    it('resizes the scene to the whole track and releases its observer when leaving scene mode', () => {
        let resize: ((width: number) => void) | undefined;
        const observe = vi.fn();
        const disconnect = vi.fn();
        vi.stubGlobal('ResizeObserver', class {
            constructor(callback: ResizeObserverCallback) {
                resize = (width) => callback(
                    [{ contentRect: { width } } as ResizeObserverEntry],
                    this as unknown as ResizeObserver,
                );
            }
            observe = observe;
            disconnect = disconnect;
        });
        const { container, rerender } = render(<Progress percent={50} variant="sweet-corner" />);

        expect(observe).toHaveBeenCalledWith(container.querySelector('.animal-progress-track'));
        act(() => resize?.(320));
        expect(getFill(container)).toHaveStyle({ backgroundSize: '320px auto' });
        expect(getFill(container).style.width).toBe('50%');

        rerender(<Progress percent={50} />);
        expect(disconnect).toHaveBeenCalledOnce();
        expect(getFill(container).style.backgroundImage).toBe('');
        expect(getFill(container)).toContainElement(screen.getByText('50%'));
    });

    it('retains completed semantics when the visible information is hidden', () => {
        render(<Progress percent={120} showInfo={false} aria-label="Completed task" />);

        expect(screen.getByRole('progressbar', { name: 'Completed task' }))
            .toHaveAttribute('aria-valuenow', '100');
        expect(screen.queryByText('100%')).not.toBeInTheDocument();
    });
});
