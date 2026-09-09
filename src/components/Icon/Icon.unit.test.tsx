import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Heart } from 'lucide-react';
import { Icon, ICON_LIST } from './Icon';

describe('Icon', () => {
    it('name 渲染彩色素材并保留 animal-<name> 类', () => {
        const { container } = render(<Icon name="icon-map" />);
        const root = container.firstChild as HTMLElement;
        expect(root.tagName).toBe('SPAN');
        expect(root.style.backgroundSize).toBe('300% 300%');
        expect(root.classList.contains('animal-icon')).toBe(true);
        expect(root.classList.contains('animal-icon-map')).toBe(true);
    });

    it('utility names continue to support vector color and stroke controls', () => {
        const { container } = render(<Icon name="wifi" color="#123456" strokeWidth={3} />);
        const root = container.firstChild as SVGSVGElement;
        expect(root.tagName).toBe('svg');
        expect(root.getAttribute('stroke')).toBe('#123456');
        expect(root.getAttribute('stroke-width')).toBe('3');
    });

    it('ICON_LIST 的每个 name 都能渲染', () => {
        for (const { name } of ICON_LIST) {
            const { container, unmount } = render(<Icon name={name} />);
            expect(container.firstChild).not.toBeNull();
            unmount();
        }
    });

    it('icon prop 支持任意 lucide 组件', () => {
        const { container } = render(<Icon name="icon-camera" icon={Heart} />);
        const root = container.firstChild as HTMLElement;
        expect(root.tagName).toBe('svg');
        expect(root.classList.contains('animal-icon')).toBe(true);
    });

    it('src 模式渲染为内联 background-image 的 span', () => {
        const { container } = render(<Icon src="https://example.com/x.png" />);
        const root = container.firstChild as HTMLElement;
        expect(root.tagName).toBe('SPAN');
        expect(root.style.backgroundImage).toMatch(/url\(/);
    });

    it('默认 aria-hidden（装饰性），传 aria-label 时暴露 role=img', () => {
        const { container: plain } = render(<Icon name="icon-camera" />);
        expect((plain.firstChild as HTMLElement).getAttribute('aria-hidden')).toBe('true');

        const { container: labeled } = render(<Icon name="icon-camera" aria-label="相机" />);
        const labeledRoot = labeled.firstChild as HTMLElement;
        expect(labeledRoot.getAttribute('aria-hidden')).toBeNull();
        expect(labeledRoot.getAttribute('role')).toBe('img');
    });
});
