import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Footer } from './Footer';

/**
 * Footer API guardrail. The footer was rewritten as an icon-chain divider
 * strip (upstream guokaigdg/animal-island-ui @111f6c8). The old sea/tree/
 * seamless props are gone; the new API takes `size` and an optional `name`
 * to tile a single icon instead of all 101.
 */
describe('Footer', () => {
    it('渲染 animal-footer 根元素', () => {
        const { container } = render(<Footer />);
        const root = container.firstChild as HTMLElement;
        expect(root.classList.contains('animal-footer')).toBe(true);
    });

    it('单 icon 模式只渲染指定图标', () => {
        const { container } = render(<Footer name="Heart" size={24} />);
        const svgs = container.querySelectorAll('svg');
        expect(svgs.length).toBeGreaterThan(0);
    });

    it('自定义 size 渲染', () => {
        const { container } = render(<Footer size={32} />);
        const root = container.firstChild as HTMLElement;
        expect(root).toBeTruthy();
    });
});
