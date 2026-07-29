import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { Tag } from './Tag';

afterEach(cleanup);

const cls = (el: ChildNode | Element | null, name: string) => (el as HTMLElement).classList.contains(name);

describe('Tag', () => {
    describe('rendering', () => {
        it('默认渲染 children 文本', () => {
            render(<Tag>hello</Tag>);
            expect(screen.getByText('hello')).toBeTruthy();
        });

        it('默认应用 animal-tag、animal-tag-medium、animal-tag-soft 类', () => {
            const { container } = render(<Tag>x</Tag>);
            const root = container.firstChild as HTMLElement;
            expect(cls(root, 'animal-tag')).toBe(true);
            expect(cls(root, 'animal-tag-medium')).toBe(true);
            expect(cls(root, 'animal-tag-soft')).toBe(true);
        });

        it('支持 className 与 style', () => {
            const { container } = render(
                <Tag className="x" style={{ marginLeft: 4 }}>
                    t
                </Tag>
            );
            const root = container.firstChild as HTMLElement;
            expect(cls(root, 'x')).toBe(true);
            expect(root.style.marginLeft).toBe('4px');
        });
    });

    describe('size', () => {
        it('size=small 应用 animal-tag-small', () => {
            const { container } = render(<Tag size="small">x</Tag>);
            expect(cls(container.firstChild, 'animal-tag-small')).toBe(true);
        });

        it('size=large 应用 animal-tag-large', () => {
            const { container } = render(<Tag size="large">x</Tag>);
            expect(cls(container.firstChild, 'animal-tag-large')).toBe(true);
        });
    });

    describe('variant', () => {
        it('variant=outlined 应用 animal-tag-outlined', () => {
            const { container } = render(<Tag variant="outlined">x</Tag>);
            expect(cls(container.firstChild, 'animal-tag-outlined')).toBe(true);
        });

        it('variant=dashed 应用 animal-tag-dashed', () => {
            const { container } = render(<Tag variant="dashed">x</Tag>);
            expect(cls(container.firstChild, 'animal-tag-dashed')).toBe(true);
        });

        it('variant=soft 应用 animal-tag-soft', () => {
            const { container } = render(<Tag variant="soft">x</Tag>);
            expect(cls(container.firstChild, 'animal-tag-soft')).toBe(true);
        });
    });

    describe('color', () => {
        it('color=default 不应用任何 color 类', () => {
            const { container } = render(<Tag color="default">x</Tag>);
            const root = container.firstChild as HTMLElement;
            expect(root.className).not.toMatch(/animal-tag-color-/);
        });

        it('color=app-pink + solid 应用 animal-tag-color-app-pink-solid', () => {
            const { container } = render(
                <Tag color="app-pink" variant="solid">
                    x
                </Tag>
            );
            expect(cls(container.firstChild, 'animal-tag-color-app-pink-solid')).toBe(true);
        });

        it('color=purple + outlined 应用 animal-tag-color-purple-outlined', () => {
            const { container } = render(
                <Tag color="purple" variant="outlined">
                    x
                </Tag>
            );
            expect(cls(container.firstChild, 'animal-tag-color-purple-outlined')).toBe(true);
        });

        it('color=app-blue + dashed 应用 animal-tag-color-app-blue-dashed', () => {
            const { container } = render(
                <Tag color="app-blue" variant="dashed">
                    x
                </Tag>
            );
            expect(cls(container.firstChild, 'animal-tag-color-app-blue-dashed')).toBe(true);
        });

        it('color=app-pink + soft 应用 animal-tag-color-app-pink-soft', () => {
            const { container } = render(
                <Tag color="app-pink" variant="soft">
                    x
                </Tag>
            );
            expect(cls(container.firstChild, 'animal-tag-color-app-pink-soft')).toBe(true);
        });

        it('color=app-green + soft 应用 animal-tag-color-app-green-soft', () => {
            const { container } = render(
                <Tag color="app-green" variant="soft">
                    x
                </Tag>
            );
            expect(cls(container.firstChild, 'animal-tag-color-app-green-soft')).toBe(true);
        });
    });

    describe('closable', () => {
        it('closable=true 渲染关闭按钮', () => {
            render(<Tag closable>x</Tag>);
            const btn = screen.getByRole('button', { name: 'close' });
            expect(btn).toBeTruthy();
            expect(btn.getAttribute('aria-label')).toBe('close');
        });

        it('点击关闭按钮触发 onClose', () => {
            const onClose = vi.fn();
            render(
                <Tag closable onClose={onClose}>
                    x
                </Tag>
            );
            fireEvent.click(screen.getByRole('button', { name: 'close' }));
            expect(onClose).toHaveBeenCalledTimes(1);
        });

        it('disabled 状态下关闭按钮被禁用', () => {
            const onClose = vi.fn();
            render(
                <Tag closable disabled onClose={onClose}>
                    x
                </Tag>
            );
            const btn = screen.getByRole('button', { name: 'close' }) as HTMLButtonElement;
            expect(btn.disabled).toBe(true);
            fireEvent.click(btn);
            expect(onClose).not.toHaveBeenCalled();
        });
    });

    describe('clickable', () => {
        it('提供 onClick 后标签渲染为 role=button 且可点击', () => {
            const onClick = vi.fn();
            render(<Tag onClick={onClick}>x</Tag>);
            const tag = screen.getByRole('button');
            expect(cls(tag, 'animal-tag-clickable')).toBe(true);
            fireEvent.click(tag);
            expect(onClick).toHaveBeenCalledTimes(1);
        });

        it('disabled 状态下不响应 onClick', () => {
            const onClick = vi.fn();
            const { container } = render(
                <Tag disabled onClick={onClick}>
                    x
                </Tag>
            );
            const root = container.firstChild as HTMLElement;
            expect(cls(root, 'animal-tag-disabled')).toBe(true);
            fireEvent.click(root);
            expect(onClick).not.toHaveBeenCalled();
        });

        it('键盘 Enter 触发 onClick', () => {
            const onClick = vi.fn();
            render(<Tag onClick={onClick}>x</Tag>);
            const tag = screen.getByRole('button');
            fireEvent.keyDown(tag, { key: 'Enter' });
            expect(onClick).toHaveBeenCalledTimes(1);
        });

        it('未提供 onClick 时不渲染为 button', () => {
            const { container } = render(<Tag>x</Tag>);
            const root = container.firstChild as HTMLElement;
            expect(root.getAttribute('role')).toBeNull();
        });
    });

    describe('disabled', () => {
        it('应用 animal-tag-disabled 类', () => {
            const { container } = render(<Tag disabled>x</Tag>);
            expect(cls(container.firstChild, 'animal-tag-disabled')).toBe(true);
        });
    });

    describe('event isolation', () => {
        it('点击关闭按钮不会冒泡触发 onClick', () => {
            const onClick = vi.fn();
            const onClose = vi.fn();
            render(
                <Tag closable onClose={onClose} onClick={onClick}>
                    x
                </Tag>
            );
            fireEvent.click(screen.getByRole('button', { name: 'close' }));
            expect(onClose).toHaveBeenCalledTimes(1);
            expect(onClick).not.toHaveBeenCalled();
        });
    });
});
