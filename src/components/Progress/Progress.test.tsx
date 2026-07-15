import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Progress } from './Progress';

describe('Progress', () => {
    it('renders with default props', () => {
        const { container } = render(<Progress />);
        const el = container.querySelector('.animal-progress');
        expect(el).toBeInTheDocument();
    });

    it('shows percent info by default', () => {
        render(<Progress percent={42} />);
        expect(screen.getByText('42%')).toBeInTheDocument();
    });

    it('showInfo=false hides info text', () => {
        render(<Progress percent={42} showInfo={false} />);
        expect(screen.queryByText('42%')).not.toBeInTheDocument();
    });

    it('clamps percent below 0 to 0', () => {
        render(<Progress percent={-10} />);
        expect(screen.getByText('0%')).toBeInTheDocument();
    });

    it('clamps percent above 100 to 100', () => {
        render(<Progress percent={110} />);
        expect(screen.getByText('100%')).toBeInTheDocument();
    });

    it('custom format function', () => {
        render(<Progress percent={50} format={(p) => `done: ${p}`} />);
        expect(screen.getByText('done: 50')).toBeInTheDocument();
    });

    it('size=small applies track class', () => {
        const { container } = render(<Progress size="small" />);
        expect(container.querySelector('.animal-progress-track-small')).toBeInTheDocument();
    });

    it('size=middle applies track class', () => {
        const { container } = render(<Progress size="middle" />);
        expect(container.querySelector('.animal-progress-track-middle')).toBeInTheDocument();
    });

    it('size=large applies track class', () => {
        const { container } = render(<Progress size="large" />);
        expect(container.querySelector('.animal-progress-track-large')).toBeInTheDocument();
    });

    it('fill width reflects percent', () => {
        const { container } = render(<Progress percent={60} />);
        const fill = container.querySelector('.animal-progress-fill') as HTMLElement;
        expect(fill.style.width).toBe('60%');
    });

    it('strokeColor applies custom fill color', () => {
        const { container } = render(<Progress percent={50} strokeColor="#ff0000" />);
        const fill = container.querySelector('.animal-progress-fill') as HTMLElement;
        expect(fill.style.background).toBe('rgb(255, 0, 0)');
        expect(fill.style.backgroundImage).toBe('none');
    });

    it('infoPosition=right renders info outside track', () => {
        const { container } = render(<Progress percent={50} infoPosition="right" />);
        const row = container.querySelector('.animal-progress-row');
        expect(row?.querySelector('.animal-progress-info')).toBeInTheDocument();
        expect(row?.querySelector('.animal-progress-info-right')).toBeInTheDocument();
    });

    it('infoPosition=inside renders info inside fill', () => {
        const { container } = render(<Progress percent={50} infoPosition="inside" />);
        expect(container.querySelector('.animal-progress-info-inside')).toBeInTheDocument();
        expect(container.querySelector('.animal-progress-info-right')).not.toBeInTheDocument();
    });

    it('infoPosition=top renders info above track', () => {
        const { container } = render(<Progress percent={50} infoPosition="top" />);
        expect(container.querySelector('.animal-progress-info-top')).toBeInTheDocument();
        expect(container.querySelector('.animal-progress-body-no-gap')).toBeInTheDocument();
    });

    it('noTransition applies no-transition class', () => {
        const { container } = render(<Progress noTransition />);
        expect(container.querySelector('.animal-progress-fill-no-transition')).toBeInTheDocument();
    });

    it('custom className is applied', () => {
        const { container } = render(<Progress className="custom-class" />);
        expect(container.querySelector('.animal-progress')).toHaveClass('custom-class');
    });
});
