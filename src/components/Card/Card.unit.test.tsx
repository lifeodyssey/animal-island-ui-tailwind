import { describe, it, expect, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach } from 'vitest';
import { Card } from './Card';

afterEach(cleanup);

const cls = (el: ChildNode | Element | null, name: string) => (el as HTMLElement).classList.contains(name);

describe('Card', () => {
    it('渲染 children', () => {
        render(
            <Card>
                <span data-testid="c">hi</span>
            </Card>
        );
        expect(screen.getByTestId('c')).toBeTruthy();
    });

    it('默认应用 animal-card 类，不带 animal-card-dashed', () => {
        const { container } = render(<Card>x</Card>);
        const root = container.firstChild as HTMLElement;
        expect(cls(root, 'animal-card')).toBe(true);
        expect(cls(root, 'animal-card-dashed')).toBe(false);
    });

    it('type=dashed 应用 animal-card-dashed', () => {
        const { container } = render(<Card type="dashed">x</Card>);
        expect(cls(container.firstChild, 'animal-card-dashed')).toBe(true);
    });

    it('color 非 default 时应用 animal-card-${color}', () => {
        const { container } = render(<Card color="app-pink">x</Card>);
        expect(cls(container.firstChild, 'animal-card-app-pink')).toBe(true);
    });

    it('pattern 非 none 时应用 animal-card-pattern 及 animal-card-pattern-${pattern}', () => {
        const { container } = render(<Card pattern="purple">x</Card>);
        expect(cls(container.firstChild, 'animal-card-pattern')).toBe(true);
        expect(cls(container.firstChild, 'animal-card-pattern-purple')).toBe(true);
    });

    it('透传原生 div 属性（className / style / data-*）', () => {
        const { container } = render(
            <Card className="extra" style={{ marginTop: 5 }} data-testid="root">
                x
            </Card>
        );
        const root = container.firstChild as HTMLElement;
        expect(cls(root, 'extra')).toBe(true);
        expect(root.style.marginTop).toBe('5px');
        expect(root.getAttribute('data-testid')).toBe('root');
    });

    it('type=default 显式不应用 animal-card-dashed', () => {
        const { container } = render(<Card type="default">x</Card>);
        expect(cls(container.firstChild, 'animal-card-dashed')).toBe(false);
    });

    it('color=default 显式不应用任何 animal-card-color 类', () => {
        const { container } = render(<Card color="default">x</Card>);
        const root = container.firstChild as HTMLElement;
        expect(cls(root, 'animal-card-app-pink')).toBe(false);
        expect(cls(root, 'animal-card-purple')).toBe(false);
    });

    it('pattern=none 显式不应用任何 animal-card-pattern-* 类', () => {
        const { container } = render(<Card pattern="none">x</Card>);
        const root = container.firstChild as HTMLElement;
        expect(cls(root, 'animal-card-pattern-app-pink')).toBe(false);
        expect(cls(root, 'animal-card-pattern-default')).toBe(false);
    });

    it('color 全部 12 种枚举都生成对应 class', () => {
        const colors = [
            'app-pink', 'purple', 'app-blue', 'app-yellow', 'app-orange',
            'app-teal', 'app-green', 'app-red', 'lime-green', 'yellow-green',
            'brown', 'warm-peach-pink',
        ] as const;
        for (const c of colors) {
            const { container, unmount } = render(<Card color={c}>x</Card>);
            expect(cls(container.firstChild, `animal-card-${c}`)).toBe(true);
            unmount();
        }
    });

    it('pattern 全部 13 种枚举（none 之外的）都生成对应 class', () => {
        const patterns = [
            'default', 'app-pink', 'purple', 'app-blue', 'app-yellow', 'app-orange',
            'app-teal', 'app-green', 'app-red', 'lime-green', 'yellow-green',
            'brown', 'warm-peach-pink',
        ] as const;
        for (const p of patterns) {
            const { container, unmount } = render(<Card pattern={p}>x</Card>);
            expect(cls(container.firstChild, `animal-card-pattern-${p}`)).toBe(true);
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
        expect(cls(root, 'animal-card-dashed')).toBe(true);
        expect(cls(root, 'animal-card-app-pink')).toBe(true);
        expect(cls(root, 'animal-card-pattern-purple')).toBe(true);
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
        expect(root.getAttribute('aria-label')).toBe('card');
        expect(root.getAttribute('data-testid')).toBe('card-root');
        expect(root.getAttribute('role')).toBe('region');
    });

    it('默认（不传 hoverable）不应用 animal-card-hoverable 类', () => {
        const { container } = render(<Card>x</Card>);
        expect(cls(container.firstChild, 'animal-card-hoverable')).toBe(false);
    });

    it('hoverable={false} 显式不应用 animal-card-hoverable 类', () => {
        const { container } = render(<Card hoverable={false}>x</Card>);
        expect(cls(container.firstChild, 'animal-card-hoverable')).toBe(false);
    });

    it('hoverable={true} 应用 animal-card-hoverable 类', () => {
        const { container } = render(<Card hoverable>x</Card>);
        const root = container.firstChild as HTMLElement;
        expect(cls(root, 'animal-card-hoverable')).toBe(true);
        expect(cls(root, 'animal-card')).toBe(true);
    });

    it('hoverable 与 type / color / pattern 自由组合', () => {
        const { container } = render(
            <Card type="dashed" color="app-pink" pattern="purple" hoverable>
                x
            </Card>
        );
        const root = container.firstChild as HTMLElement;
        expect(cls(root, 'animal-card-hoverable')).toBe(true);
        expect(cls(root, 'animal-card-dashed')).toBe(true);
        expect(cls(root, 'animal-card-app-pink')).toBe(true);
        expect(cls(root, 'animal-card-pattern-purple')).toBe(true);
    });

    it('className 透传仍然生效，且与 hoverable 共存', () => {
        const { container } = render(
            <Card hoverable className="my-card">
                x
            </Card>
        );
        const root = container.firstChild as HTMLElement;
        expect(cls(root, 'my-card')).toBe(true);
        expect(cls(root, 'animal-card-hoverable')).toBe(true);
    });
});
