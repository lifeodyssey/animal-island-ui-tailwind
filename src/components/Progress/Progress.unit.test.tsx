import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Progress } from './Progress';

describe('Progress', () => {
    it('渲染 role=progressbar', () => {
        render(<Progress percent={50} />);
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('aria-valuenow 等于 percent', () => {
        render(<Progress percent={42} />);
        expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '42');
    });

    it('percent 超出范围时夹紧到 0–100', () => {
        const { rerender } = render(<Progress percent={-10} />);
        expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
        rerender(<Progress percent={150} />);
        expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
    });

    it('默认显示百分比文字', () => {
        render(<Progress percent={75} />);
        expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuetext', '75%');
    });

    it('showInfo=false 不渲染文字', () => {
        render(<Progress percent={50} showInfo={false} />);
        expect(screen.getByRole('progressbar').getAttribute('aria-valuetext')).toBeNull();
    });

    it('infoFormat 自定义格式', () => {
        render(<Progress percent={50} infoFormat={(p) => `${p} done`} />);
        expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuetext', '50 done');
    });

    it('size=small 应用 animal-progress-track-small', () => {
        const { container } = render(<Progress percent={50} size="small" />);
        expect(container.querySelector('.animal-progress-track')).toHaveClass('animal-progress-track-small');
    });

    it('size=large 应用 animal-progress-track-large', () => {
        const { container } = render(<Progress percent={50} size="large" />);
        expect(container.querySelector('.animal-progress-track')).toHaveClass('animal-progress-track-large');
    });

    it('infoPosition=right 渲染右侧文字', () => {
        const { container } = render(<Progress percent={60} infoPosition="right" />);
        expect(container.querySelector('.animal-progress-info-right')).toBeInTheDocument();
    });

    it('自定义 className 透传', () => {
        const { container } = render(<Progress percent={50} className="my-prog" />);
        expect(container.firstChild).toHaveClass('my-prog');
    });
});
