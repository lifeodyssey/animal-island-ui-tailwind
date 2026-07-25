import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Progress } from './Progress';

/**
 * Progress guardrail. Stable `animal-progress*` class names replace upstream
 * Less-module hashes. Structural parity with upstream Progress tests.
 */
describe('Progress', () => {
    it('渲染 animal-progress 根类及 role=progressbar', () => {
        const { container } = render(<Progress percent={50} />);
        const root = container.firstChild as HTMLElement;
        expect(root.classList.contains('animal-progress')).toBe(true);
        expect(root.getAttribute('role')).toBe('progressbar');
    });

    it('aria-valuenow 映射到 Math.round(percent)', () => {
        const { container } = render(<Progress percent={42.7} />);
        const root = container.firstChild as HTMLElement;
        expect(root.getAttribute('aria-valuenow')).toBe('43');
    });

    it('percent > 100 时钳制到 100', () => {
        const { container } = render(<Progress percent={150} />);
        const root = container.firstChild as HTMLElement;
        expect(root.getAttribute('aria-valuenow')).toBe('100');
    });

    it('percent < 0 时钳制到 0', () => {
        const { container } = render(<Progress percent={-10} />);
        const root = container.firstChild as HTMLElement;
        expect(root.getAttribute('aria-valuenow')).toBe('0');
    });

    it('NaN percent 使用 0', () => {
        const { container } = render(<Progress percent={NaN} />);
        const root = container.firstChild as HTMLElement;
        expect(root.getAttribute('aria-valuenow')).toBe('0');
    });

    it('fill 宽度等于 percent%', () => {
        const { container } = render(<Progress percent={60} />);
        const fill = container.querySelector('.animal-progress-fill') as HTMLElement;
        expect(fill.style.width).toBe('60%');
    });

    it('size=small 添加 animal-progress-track-small（应用在轨道元素）', () => {
        const { container } = render(<Progress percent={50} size="small" />);
        expect(container.querySelector('.animal-progress-track-small')).not.toBeNull();
    });

    it('size=large 添加 animal-progress-track-large', () => {
        const { container } = render(<Progress percent={50} size="large" />);
        expect(container.querySelector('.animal-progress-track-large')).not.toBeNull();
    });

    it('默认 size=middle 添加 animal-progress-track-middle', () => {
        const { container } = render(<Progress percent={50} />);
        expect(container.querySelector('.animal-progress-track-middle')).not.toBeNull();
    });

    it('showInfo=false 时不渲染百分比文本', () => {
        const { container } = render(<Progress percent={50} showInfo={false} />);
        expect(container.querySelector('.animal-progress-info')).toBeNull();
        expect(container.querySelector('.animal-progress-info-inside')).toBeNull();
    });

    it('infoPosition=right 时百分比在 animal-progress-info-right', () => {
        const { container } = render(<Progress percent={50} infoPosition="right" />);
        expect(container.querySelector('.animal-progress-info-right')).not.toBeNull();
    });

    it('infoPosition=top 时百分比在 animal-progress-info-top', () => {
        const { container } = render(<Progress percent={50} infoPosition="top" />);
        expect(container.querySelector('.animal-progress-info-top')).not.toBeNull();
    });

    it('infoFormat 自定义渲染', () => {
        const { container } = render(
            <Progress percent={75} infoPosition="right" infoFormat={(p) => `${p} done`} />
        );
        expect(container.querySelector('.animal-progress-info-right')?.textContent).toBe('75 done');
    });

    it('percent >= 18 时 inside label 渲染在 fill 内', () => {
        const { container } = render(<Progress percent={50} infoPosition="inside" />);
        const fill = container.querySelector('.animal-progress-fill');
        expect(fill?.querySelector('.animal-progress-info-inside')).not.toBeNull();
    });

    it('percent < 18 时 inside label 渲染在 fill 外', () => {
        const { container } = render(<Progress percent={10} infoPosition="inside" />);
        const fill = container.querySelector('.animal-progress-fill');
        expect(fill?.querySelector('.animal-progress-info-inside')).toBeNull();
        expect(container.querySelector('.animal-progress-info-inside')).not.toBeNull();
    });

    it('duration=0 添加 animal-progress-fill-no-transition（应用在 fill 元素）', () => {
        const { container } = render(<Progress percent={50} duration={0} />);
        expect(container.querySelector('.animal-progress-fill-no-transition')).not.toBeNull();
    });

    it('自定义 aria-label 透传', () => {
        const { container } = render(<Progress percent={50} aria-label="加载中" />);
        const root = container.firstChild as HTMLElement;
        expect(root.getAttribute('aria-label')).toBe('加载中');
    });
});
