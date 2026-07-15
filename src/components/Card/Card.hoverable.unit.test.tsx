import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Card } from './Card';

/**
 * Card hoverable guardrail. Source of truth: upstream Card — the `hoverable`
 * prop opts into pointer cursor + translateY(-2px) hover effect. Default is
 * false (read-only cards have no hover effect).
 */
describe('Card hoverable', () => {
    it('默认不添加 hoverable 类', () => {
        const { container } = render(<Card>x</Card>);
        const root = container.firstChild as HTMLElement;
        expect(root.className).not.toContain('animal-card-hoverable');
    });

    it('hoverable=false 不添加 hoverable 类', () => {
        const { container } = render(<Card hoverable={false}>x</Card>);
        const root = container.firstChild as HTMLElement;
        expect(root.className).not.toContain('animal-card-hoverable');
    });

    it('hoverable=true 添加 animal-card-hoverable 类', () => {
        const { container } = render(<Card hoverable>x</Card>);
        const root = container.firstChild as HTMLElement;
        expect(root.classList.contains('animal-card-hoverable')).toBe(true);
    });

    it('hoverable 与 color/pattern 可叠加', () => {
        const { container } = render(<Card hoverable color="app-teal" pattern="app-blue">x</Card>);
        const root = container.firstChild as HTMLElement;
        expect(root.classList.contains('animal-card-hoverable')).toBe(true);
        expect(root.classList.contains('animal-card-app-teal')).toBe(true);
        expect(root.classList.contains('animal-card-pattern-app-blue')).toBe(true);
    });
});
