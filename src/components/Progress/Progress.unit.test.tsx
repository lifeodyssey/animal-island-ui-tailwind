import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Progress } from './Progress';

describe('Progress', () => {
    describe('rendering', () => {
        it('renders with role=progressbar', () => {
            const { container } = render(<Progress percent={50} aria-label="progress" />);
            const el = container.querySelector('[role="progressbar"]');
            expect(el).not.toBeNull();
        });

        it('applies base animal-progress class', () => {
            const { container } = render(<Progress percent={50} aria-label="progress" />);
            expect(container.querySelector('.animal-progress')).not.toBeNull();
        });

        it('renders fill element', () => {
            const { container } = render(<Progress percent={50} aria-label="progress" />);
            expect(container.querySelector('.animal-progress-fill')).not.toBeNull();
        });

        it('renders track element', () => {
            const { container } = render(<Progress percent={50} aria-label="progress" />);
            expect(container.querySelector('.animal-progress-track')).not.toBeNull();
        });
    });

    describe('aria attributes', () => {
        it('sets aria-valuenow to percent value', () => {
            const { container } = render(<Progress percent={42} aria-label="progress" />);
            const el = container.querySelector('[role="progressbar"]');
            expect(el).toHaveAttribute('aria-valuenow', '42');
        });

        it('sets aria-valuemin=0 and aria-valuemax=100', () => {
            const { container } = render(<Progress percent={50} aria-label="progress" />);
            const el = container.querySelector('[role="progressbar"]');
            expect(el).toHaveAttribute('aria-valuemin', '0');
            expect(el).toHaveAttribute('aria-valuemax', '100');
        });

        it('sets aria-label', () => {
            const { container } = render(<Progress percent={50} aria-label="loading" />);
            const el = container.querySelector('[role="progressbar"]');
            expect(el).toHaveAttribute('aria-label', 'loading');
        });

        it('clamps percent above 100', () => {
            const { container } = render(<Progress percent={150} aria-label="progress" />);
            const el = container.querySelector('[role="progressbar"]');
            expect(el).toHaveAttribute('aria-valuenow', '100');
        });

        it('clamps percent below 0', () => {
            const { container } = render(<Progress percent={-10} aria-label="progress" />);
            const el = container.querySelector('[role="progressbar"]');
            expect(el).toHaveAttribute('aria-valuenow', '0');
        });
    });

    describe('size classes', () => {
        it('applies size-small class', () => {
            const { container } = render(<Progress percent={50} size="small" aria-label="progress" />);
            expect(container.querySelector('.animal-progress-small')).not.toBeNull();
        });

        it('applies size-middle class by default', () => {
            const { container } = render(<Progress percent={50} aria-label="progress" />);
            expect(container.querySelector('.animal-progress-middle')).not.toBeNull();
        });

        it('applies size-large class', () => {
            const { container } = render(<Progress percent={50} size="large" aria-label="progress" />);
            expect(container.querySelector('.animal-progress-large')).not.toBeNull();
        });
    });

    describe('info display', () => {
        it('shows percent text by default', () => {
            const { container } = render(<Progress percent={75} aria-label="progress" />);
            expect(container.textContent).toContain('75%');
        });

        it('hides info when showInfo=false', () => {
            const { container } = render(<Progress percent={75} showInfo={false} aria-label="progress" />);
            expect(container.textContent).not.toContain('75%');
        });

        it('uses custom format function', () => {
            const { container } = render(
                <Progress percent={75} format={(p) => `${p} done`} aria-label="progress" />
            );
            expect(container.textContent).toContain('75 done');
        });
    });

    describe('custom className and style', () => {
        it('applies custom className', () => {
            const { container } = render(<Progress percent={50} className="custom" aria-label="progress" />);
            expect(container.querySelector('.custom')).not.toBeNull();
        });

        it('applies custom style', () => {
            const { container } = render(
                <Progress percent={50} style={{ marginTop: 8 }} aria-label="progress" />
            );
            const el = container.querySelector('.animal-progress') as HTMLElement;
            expect(el.style.marginTop).toBe('8px');
        });
    });
});
