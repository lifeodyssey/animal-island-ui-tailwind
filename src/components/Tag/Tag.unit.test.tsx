import { describe, it, expect, afterEach, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { fireEvent } from '@testing-library/react';
import { Tag } from './Tag';

afterEach(() => {
    cleanup();
});

describe('Tag', () => {
    describe('rendering', () => {
        it('默认渲染 children 文本', () => {
            render(<Tag>hello</Tag>);
            expect(screen.getByText('hello')).toBeInTheDocument();
        });

        it('默认应用基础 tag 类与 medium/soft 尺寸', () => {
            const { container } = render(<Tag>x</Tag>);
            const root = container.firstChild as HTMLElement;
            expect(root).toHaveClass('animal-tag');
            expect(root).toHaveClass('animal-tag-medium');
            expect(root).toHaveClass('animal-tag-soft');
        });

        it('支持 className 与 style', () => {
            const { container } = render(
                <Tag className="x" style={{ marginLeft: 4 }}>
                    t
                </Tag>
            );
            const root = container.firstChild as HTMLElement;
            expect(root).toHaveClass('x');
            expect(root).toHaveStyle({ marginLeft: '4px' });
        });
    });

    describe('size', () => {
        it('size=small 应用对应类', () => {
            const { container } = render(<Tag size="small">x</Tag>);
            expect(container.firstChild).toHaveClass('animal-tag-small');
        });

        it('size=large 应用对应类', () => {
            const { container } = render(<Tag size="large">x</Tag>);
            expect(container.firstChild).toHaveClass('animal-tag-large');
        });
    });

    describe('variant', () => {
        it('variant=outlined 应用对应类', () => {
            const { container } = render(<Tag variant="outlined">x</Tag>);
            expect(container.firstChild).toHaveClass('animal-tag-outlined');
        });

        it('variant=dashed 应用对应类', () => {
            const { container } = render(<Tag variant="dashed">x</Tag>);
            expect(container.firstChild).toHaveClass('animal-tag-dashed');
        });

        it('variant=soft 应用对应类', () => {
            const { container } = render(<Tag variant="soft">x</Tag>);
            expect(container.firstChild).toHaveClass('animal-tag-soft');
        });
    });

    describe('color', () => {
        it('color=default 不应用任何 color 类', () => {
            const { container } = render(<Tag color="default">x</Tag>);
            const root = container.firstChild as HTMLElement;
            expect(root.className).not.toMatch(
                /animal-tag-(app-|purple|lime-green|yellow-green|brown|warm-peach-pink)/
            );
        });

        it('color=app-pink + solid 应用对应 color 类', () => {
            const { container } = render(
                <Tag color="app-pink" variant="solid">
                    x
                </Tag>
            );
            const root = container.firstChild as HTMLElement;
            expect(root).toHaveClass('animal-tag-app-pink');
            expect(root).toHaveClass('animal-tag-solid');
        });

        it('color=purple + outlined 应用对应 color 类', () => {
            const { container } = render(
                <Tag color="purple" variant="outlined">
                    x
                </Tag>
            );
            const root = container.firstChild as HTMLElement;
            expect(root).toHaveClass('animal-tag-purple');
            expect(root).toHaveClass('animal-tag-outlined');
        });

        it('color=app-blue + dashed 应用对应 color 类', () => {
            const { container } = render(
                <Tag color="app-blue" variant="dashed">
                    x
                </Tag>
            );
            const root = container.firstChild as HTMLElement;
            expect(root).toHaveClass('animal-tag-app-blue');
            expect(root).toHaveClass('animal-tag-dashed');
        });

        it('color=app-pink + soft 应用对应 color 类', () => {
            const { container } = render(
                <Tag color="app-pink" variant="soft">
                    x
                </Tag>
            );
            const root = container.firstChild as HTMLElement;
            expect(root).toHaveClass('animal-tag-app-pink');
            expect(root).toHaveClass('animal-tag-soft');
        });

        it('color=app-green + soft 应用对应 color 类', () => {
            const { container } = render(
                <Tag color="app-green" variant="soft">
                    x
                </Tag>
            );
            const root = container.firstChild as HTMLElement;
            expect(root).toHaveClass('animal-tag-app-green');
            expect(root).toHaveClass('animal-tag-soft');
        });
    });

    describe('closable', () => {
        it('closable=true 渲染关闭按钮', () => {
            render(<Tag closable>x</Tag>);
            const btn = screen.getByRole('button', { name: 'close' });
            expect(btn).toBeInTheDocument();
            // jest-dom v6: 关闭按钮显式 role + 通过 aria-label 提供可访问名
            expect(btn).toHaveRole('button');
            expect(btn).toHaveAccessibleName('close');
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

        it('disabled 状态下点击关闭按钮不触发 onClose', () => {
            const onClose = vi.fn();
            render(
                <Tag closable disabled onClose={onClose}>
                    x
                </Tag>
            );
            const btn = screen.getByRole('button', { name: 'close' });
            expect(btn).toBeDisabled();
            fireEvent.click(btn);
            expect(onClose).not.toHaveBeenCalled();
        });
    });

    describe('clickable', () => {
        it('提供 onClick 后标签渲染为 role=button 且可点击', () => {
            const onClick = vi.fn();
            render(<Tag onClick={onClick}>x</Tag>);
            const tag = screen.getByRole('button');
            expect(tag).toHaveClass('animal-tag-clickable');
            // jest-dom v6: 显式 role 校验 + 文本内容作为可访问名
            expect(tag).toHaveRole('button');
            expect(tag).toHaveAccessibleName('x');
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
            expect(root).toHaveClass('animal-tag-disabled');
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
        it('应用 is-disabled 类', () => {
            const { container } = render(<Tag disabled>x</Tag>);
            expect(container.firstChild).toHaveClass('animal-tag-disabled');
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
