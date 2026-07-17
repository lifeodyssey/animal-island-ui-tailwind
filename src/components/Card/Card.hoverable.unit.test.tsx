import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Card } from './Card';

describe('Card hoverable', () => {
    it('默认不添加 animal-card-hoverable 类', () => {
        const { container } = render(<Card>x</Card>);
        expect((container.firstChild as HTMLElement).classList.contains('animal-card-hoverable')).toBe(false);
    });

    it('hoverable={false} 显式不添加 animal-card-hoverable 类', () => {
        const { container } = render(<Card hoverable={false}>x</Card>);
        expect((container.firstChild as HTMLElement).classList.contains('animal-card-hoverable')).toBe(false);
    });

    it('hoverable={true} 添加 animal-card-hoverable 类', () => {
        const { container } = render(<Card hoverable>x</Card>);
        const el = container.firstChild as HTMLElement;
        expect(el.classList.contains('animal-card-hoverable')).toBe(true);
        expect(el.classList.contains('animal-card')).toBe(true);
    });

    it('hoverable 与 type/color/pattern 自由组合', () => {
        const { container } = render(
            <Card type="dashed" color="app-pink" pattern="purple" hoverable>
                x
            </Card>
        );
        const root = container.firstChild as HTMLElement;
        expect(root.classList.contains('animal-card-hoverable')).toBe(true);
        expect(root.classList.contains('animal-card-dashed')).toBe(true);
        expect(root.classList.contains('animal-card-app-pink')).toBe(true);
    });
});
