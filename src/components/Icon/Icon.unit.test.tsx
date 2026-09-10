import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Icon, ICON_LIST } from './Icon';

describe('Icon', () => {
    it('name 渲染内置 SVG 图标并带 animal-icon 类', () => {
        const { container } = render(<Icon name="Heart" />);
        const root = container.firstChild as SVGSVGElement;
        expect(root.tagName).toBe('svg');
        expect(root.classList.contains('animal-icon')).toBe(true);
    });

    it('支持描边颜色和描边宽度覆盖', () => {
        const { container } = render(<Icon name="Heart" color="#123456" strokeWidth={2} />);
        const root = container.firstChild as SVGSVGElement;
        expect(root.tagName).toBe('svg');
        expect(root.getAttribute('stroke')).toBe('#123456');
        expect(root.getAttribute('stroke-width')).toBe('2');
    });

    it('ICON_LIST 的每个 name 都能渲染', () => {
        for (const { name } of ICON_LIST) {
            const { container, unmount } = render(<Icon name={name} />);
            expect(container.firstChild).not.toBeNull();
            unmount();
        }
    });

    it('src 模式渲染为内联 background-image 的 span', () => {
        const { container } = render(<Icon src="https://example.com/x.png" />);
        const root = container.firstChild as HTMLElement;
        expect(root.tagName).toBe('SPAN');
        expect(root.style.backgroundImage).toMatch(/url\(/);
    });

    it('默认 aria-hidden（装饰性），传 aria-label 时暴露 role=img', () => {
        const { container: plain } = render(<Icon name="Heart" />);
        expect((plain.firstChild as HTMLElement).getAttribute('aria-hidden')).toBe('true');

        const { container: labeled } = render(<Icon name="Heart" aria-label="心形" />);
        const labeledRoot = labeled.firstChild as HTMLElement;
        expect(labeledRoot.getAttribute('aria-hidden')).toBeNull();
        expect(labeledRoot.getAttribute('role')).toBe('img');
    });

    it('bounce 添加 animal-icon-bounce 类', () => {
        const { container } = render(<Icon name="Heart" bounce />);
        const root = container.firstChild as HTMLElement;
        expect(root.classList.contains('animal-icon-bounce')).toBe(true);
    });

    it('ICON_LIST 包含 101 个图标', () => {
        expect(ICON_LIST.length).toBe(101);
    });
});
