import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Footer } from './Footer';

/**
 * Footer seamless prop guardrail. Source of truth: upstream Footer.tsx +
 * footer.module.less `.seamless` rule (guokaigdg/animal-island-ui @18e7007) —
 * the `seamless` prop toggles repeat-x horizontal tiling through a dedicated
 * class. Upstream keys it off the CSS-module `styles.seamless`; this fork uses
 * the stable `animal-footer-seamless` class name.
 */
describe('Footer seamless', () => {
    it('seamless 为 true 时添加 animal-footer-seamless 类', () => {
        const { container } = render(<Footer seamless />);
        const root = container.firstChild as HTMLElement;
        expect(root.classList.contains('animal-footer-seamless')).toBe(true);
    });

    it('默认不添加 seamless 类', () => {
        const { container } = render(<Footer />);
        const root = container.firstChild as HTMLElement;
        expect(root.classList.contains('animal-footer-seamless')).toBe(false);
    });

    it('seamless 为 false 时不添加 seamless 类', () => {
        const { container } = render(<Footer seamless={false} />);
        const root = container.firstChild as HTMLElement;
        expect(root.classList.contains('animal-footer-seamless')).toBe(false);
    });
});
