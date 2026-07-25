import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Card } from './Card';

/**
 * Card hoverable guardrail. Source of truth: upstream Card @b203a0b — adds an
 * opt-in `hoverable` prop (default false). When false the card has no pointer
 * cursor and no translateY hover; when true the `animal-card-hoverable` class
 * is added and CSS applies the interaction styles.
 */
describe('Card hoverable', () => {
    it('hoverable=false（默认）不添加 animal-card-hoverable 类', () => {
        const { container } = render(<Card>x</Card>);
        const root = container.firstChild as HTMLElement;
        expect(root.classList.contains('animal-card-hoverable')).toBe(false);
    });

    it('hoverable=true 添加 animal-card-hoverable 类', () => {
        const { container } = render(<Card hoverable>x</Card>);
        const root = container.firstChild as HTMLElement;
        expect(root.classList.contains('animal-card-hoverable')).toBe(true);
        expect(root.classList.contains('animal-card')).toBe(true);
    });

    it('hoverable 与 color/type 可叠加', () => {
        const { container } = render(
            <Card hoverable color="app-pink" type="dashed">
                x
            </Card>
        );
        const root = container.firstChild as HTMLElement;
        expect(root.classList.contains('animal-card-hoverable')).toBe(true);
        expect(root.classList.contains('animal-card-app-pink')).toBe(true);
        expect(root.classList.contains('animal-card-dashed')).toBe(true);
    });
});
