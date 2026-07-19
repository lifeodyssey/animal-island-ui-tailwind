import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Progress } from './Progress';

describe('Progress', () => {
    describe('rendering', () => {
        it('renders with role=progressbar and clamps percent', () => {
            render(<Progress percent={-10} aria-label="test" />);
            const bar = screen.getByRole('progressbar');
            expect(bar).toBeInTheDocument();
            expect(bar).toHaveAttribute('aria-valuemin', '0');
            expect(bar).toHaveAttribute('aria-valuemax', '100');
            expect(bar).toHaveAttribute('aria-valuenow', '0');
        });

        it('clamps percent above 100 down to 100', () => {
            render(<Progress percent={150} aria-label="test" />);
            expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
        });

        it('rounds non-integer percent for aria-valuenow', () => {
            render(<Progress percent={33.7} aria-label="test" />);
            expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '34');
        });

        it('uses percent=0 as default safe value when given NaN', () => {
            render(<Progress percent={Number.NaN} aria-label="test" />);
            expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
        });

        it('forwards className and style', () => {
            const { container } = render(
                <Progress percent={50} className="custom-class" style={{ width: 320 }} aria-label="test" />
            );
            const root = container.firstChild as HTMLElement;
            expect(root).toHaveClass('custom-class');
            expect(root).toHaveStyle({ width: '320px' });
        });

        it('forwards aria-label and aria-labelledby', () => {
            const { rerender } = render(<Progress percent={50} aria-label="任务进度" />);
            expect(screen.getByRole('progressbar')).toHaveAttribute('aria-label', '任务进度');
            rerender(<Progress percent={50} aria-labelledby="external-title-id" />);
            expect(screen.getByRole('progressbar')).toHaveAttribute('aria-labelledby', 'external-title-id');
        });
    });

    describe('info text', () => {
        it('default shows percent with % suffix', () => {
            render(<Progress percent={42} aria-label="test" />);
            expect(screen.getByText('42%')).toBeInTheDocument();
        });

        it('showInfo=false hides percent text', () => {
            const { container } = render(<Progress percent={50} showInfo={false} aria-label="test" />);
            expect(container.textContent).not.toMatch(/\d+%/);
        });

        it('infoFormat receives percent and renders custom node', () => {
            render(<Progress percent={7} infoFormat={(p) => `${Math.round(p)}/10`} aria-label="test" />);
            expect(screen.getByText('7/10')).toBeInTheDocument();
        });

        it('infoPosition=right places info after track', () => {
            const { container } = render(<Progress percent={50} infoPosition="right" aria-label="test" />);
            expect(screen.getByText('50%')).toBeInTheDocument();
            const row = container.querySelector('.animal-progress-row');
            expect(row).toBeInTheDocument();
        });
    });

    describe('size', () => {
        it('size=small applies small track class', () => {
            const { container } = render(<Progress percent={50} size="small" aria-label="test" />);
            expect(container.querySelector('.animal-progress-track-small')).toBeInTheDocument();
        });

        it('size=middle applies middle track class (default)', () => {
            const { container } = render(<Progress percent={50} aria-label="test" />);
            expect(container.querySelector('.animal-progress-track-middle')).toBeInTheDocument();
        });

        it('size=large applies large track class', () => {
            const { container } = render(<Progress percent={50} size="large" aria-label="test" />);
            expect(container.querySelector('.animal-progress-track-large')).toBeInTheDocument();
        });
    });
});
