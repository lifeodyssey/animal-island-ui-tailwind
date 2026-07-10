import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Card } from './Card';

describe('Card', () => {
    it('渲染 children', () => {
        render(
            <Card>
                <span data-testid="c">hi</span>
            </Card>
        );
        expect(screen.getByTestId('c')).toBeInTheDocument();
    });

    it('默认不带类型/颜色/花纹相关类', () => {
        const { container } = render(<Card>x</Card>);
        const root = container.firstChild as HTMLElement;
        expect(root).toHaveClass('animal-card');
        expect(root).not.toHaveClass('animal-card-dashed');
    });

    it('type=dashed 应用对应类', () => {
        const { container } = render(<Card type="dashed">x</Card>);
        expect(container.firstChild).toHaveClass('animal-card-dashed');
    });

    it('color 非 default 时应用 animal-card-${color}', () => {
        const { container } = render(<Card color="app-pink">x</Card>);
        expect(container.firstChild).toHaveClass('animal-card-app-pink');
    });

    it('pattern 非 none 时应用 animal-card-pattern-${pattern}', () => {
        const { container } = render(<Card pattern="purple">x</Card>);
        expect(container.firstChild).toHaveClass('animal-card-pattern-purple');
    });

    it('透传原生 div 属性（onClick / className / style）', () => {
        const { container } = render(
            <Card className="extra" style={{ marginTop: 5 }} data-testid="root">
                x
            </Card>
        );
        const root = container.firstChild as HTMLElement;
        expect(root).toHaveClass('extra');
        expect(root).toHaveStyle({ marginTop: '5px' });
        expect(root).toHaveAttribute('data-testid', 'root');
    });

    it('type=default 显式不应用 animal-card-dashed', () => {
        const { container } = render(<Card type="default">x</Card>);
        expect(container.firstChild).not.toHaveClass('animal-card-dashed');
    });

    it('color=default 显式不应用任何 animal-card-${color} 类', () => {
        const { container } = render(<Card color="default">x</Card>);
        const root = container.firstChild as HTMLElement;
        expect(root.className).not.toMatch(/animal-card-(?!pattern|dashed|title)/);
    });

    it('color 全部 12 种枚举（default 之外的）都生成对应 class', () => {
        const colors = [
            'app-pink',
            'purple',
            'app-blue',
            'app-yellow',
            'app-orange',
            'app-teal',
            'app-green',
            'app-red',
            'lime-green',
            'yellow-green',
            'brown',
            'warm-peach-pink',
        ] as const;
        for (const c of colors) {
            const { container, unmount } = render(<Card color={c}>x</Card>);
            expect(container.firstChild).toHaveClass(`animal-card-${c}`);
            unmount();
        }
    });

    it('pattern 全部 13 种枚举（none 之外的）都生成对应 class', () => {
        const patterns = [
            'default',
            'app-pink',
            'purple',
            'app-blue',
            'app-yellow',
            'app-orange',
            'app-teal',
            'app-green',
            'app-red',
            'lime-green',
            'yellow-green',
            'brown',
            'warm-peach-pink',
        ] as const;
        for (const p of patterns) {
            const { container, unmount } = render(<Card pattern={p}>x</Card>);
            expect(container.firstChild).toHaveClass(`animal-card-pattern-${p}`);
            unmount();
        }
    });

    it('type + color + pattern 三者组合时同时应用对应 class', () => {
        const { container } = render(
            <Card type="dashed" color="app-pink" pattern="purple">
                x
            </Card>
        );
        const root = container.firstChild as HTMLElement;
        expect(root).toHaveClass('animal-card-dashed');
        expect(root).toHaveClass('animal-card-app-pink');
        expect(root).toHaveClass('animal-card-pattern-purple');
    });

    it('children 为空字符串时正常渲染根 div', () => {
        const { container } = render(<Card>{''}</Card>);
        const root = container.firstChild as HTMLElement;
        expect(root.tagName).toBe('DIV');
        expect(root).toHaveClass('animal-card');
    });

    it('children 为数字 / 字符串 / 节点均可', () => {
        const { rerender, container } = render(<Card>{42}</Card>);
        expect(container.firstChild?.textContent).toBe('42');
        rerender(<Card>plain text</Card>);
        expect(container.firstChild?.textContent).toBe('plain text');
        rerender(
            <Card>
                <em data-testid="e">em</em>
            </Card>
        );
        expect(screen.getByTestId('e')).toBeInTheDocument();
    });

    it('onClick 在 Card 上被点击时触发', async () => {
        const user = userEvent.setup();
        const onClick = vi.fn();
        const { container } = render(<Card onClick={onClick}>x</Card>);
        await user.click(container.firstChild as HTMLElement);
        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('aria-* / data-* 透传', () => {
        const { container } = render(
            <Card aria-label="card" data-testid="card-root" role="region">
                x
            </Card>
        );
        const root = container.firstChild as HTMLElement;
        expect(root).toHaveAttribute('aria-label', 'card');
        expect(root).toHaveAttribute('data-testid', 'card-root');
        expect(root).toHaveAttribute('role', 'region');
    });
});
