import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Card } from './Card';

/**
 * Card pattern guardrail. Source of truth: upstream Card @2ede61a/997936e — a
 * `pattern` prop adds a dotted-texture background (orthogonal to `color`) and
 * `CardPattern` is exported. This fork applies a shared base class plus a
 * per-pattern variant class; `pattern="none"` (default) adds nothing.
 */
describe('Card pattern', () => {
    it('pattern 非 none 时加上基类与变体类', () => {
        const { container } = render(<Card pattern="app-blue">x</Card>);
        const root = container.firstChild as HTMLElement;
        expect(root.classList.contains('animal-card-pattern')).toBe(true);
        expect(root.classList.contains('animal-card-pattern-app-blue')).toBe(true);
    });

    it('默认 pattern=none 不加任何 pattern 类', () => {
        const { container } = render(<Card>x</Card>);
        const root = container.firstChild as HTMLElement;
        expect(root.className).not.toMatch(/animal-card-pattern/);
    });

    it('pattern 与 color 可正交叠加', () => {
        const { container } = render(
            <Card color="app-pink" pattern="app-teal">
                x
            </Card>
        );
        const root = container.firstChild as HTMLElement;
        expect(root.classList.contains('animal-card-app-pink')).toBe(true);
        expect(root.classList.contains('animal-card-pattern-app-teal')).toBe(true);
    });

    it('保留兼容的 type="title"', () => {
        const { container } = render(<Card type="title">x</Card>);
        const root = container.firstChild as HTMLElement;
        expect(root.classList.contains('animal-card-title')).toBe(true);
    });
});
