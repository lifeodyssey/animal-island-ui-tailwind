import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

// Adapted from upstream guokaigdg/animal-island-ui Button.test.tsx (commit fc630cd).
// Class assertions use animal-* names (our Tailwind-compiled contract) instead of
// CSS-module refs from the upstream Less implementation.

describe('Button', () => {
    it('渲染 children', () => {
        render(<Button>click me</Button>);
        expect(screen.getByRole('button')).toBeInTheDocument();
        expect(screen.getByText('click me')).toBeInTheDocument();
    });

    it('默认 type=default 应用 animal-btn-default 类', () => {
        render(<Button>x</Button>);
        expect(screen.getByRole('button')).toHaveClass('animal-btn-default');
    });

    it('onClick 被调用', async () => {
        const user = userEvent.setup();
        const onClick = vi.fn();
        render(<Button onClick={onClick}>x</Button>);
        await user.click(screen.getByRole('button'));
        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('disabled 不触发 onClick', async () => {
        const user = userEvent.setup();
        const onClick = vi.fn();
        render(
            <Button disabled onClick={onClick}>
                x
            </Button>
        );
        await user.click(screen.getByRole('button'));
        expect(onClick).not.toHaveBeenCalled();
    });

    it('loading 时应用 animal-btn-loading 类', () => {
        render(<Button loading>x</Button>);
        expect(screen.getByRole('button')).toHaveClass('animal-btn-loading');
    });

    it('icon 渲染 animal-btn-icon span（非 loading 时）', () => {
        const { container } = render(
            <Button icon={<i data-testid="ic" />}>label</Button>
        );
        expect(screen.getByTestId('ic')).toBeInTheDocument();
        expect(container.querySelector('.animal-btn-icon')).toBeInTheDocument();
    });

    it('loading 时不渲染 icon', () => {
        render(
            <Button loading icon={<i data-testid="ic" />}>
                x
            </Button>
        );
        expect(screen.queryByTestId('ic')).not.toBeInTheDocument();
    });

    // ---------- 补充测试 ----------

    it('无 icon 时不渲染 animal-btn-icon span', () => {
        const { container } = render(<Button>x</Button>);
        expect(container.querySelector('.animal-btn-icon')).toBeNull();
    });

    it('children 为空时只渲染 button 容器', () => {
        const { container } = render(<Button />);
        const btn = container.querySelector('button');
        expect(btn).toBeInTheDocument();
        expect(btn?.textContent).toBe('');
    });

    it('children 与 icon 同时渲染（顺序：icon 在前）', () => {
        const { container } = render(
            <Button icon={<i data-testid="ic" />}>
                <span data-testid="txt">label</span>
            </Button>
        );
        const btn = container.querySelector('button')!;
        expect(btn.children[0].contains(screen.getByTestId('ic'))).toBe(true);
        expect(btn.children[1].contains(screen.getByTestId('txt'))).toBe(true);
    });

    it('htmlType=reset 渲染原生 reset 类型', () => {
        render(<Button htmlType="reset">x</Button>);
        expect(screen.getByRole('button')).toHaveAttribute('type', 'reset');
    });

    it('type 全部枚举（primary / default / dashed / text / link）', () => {
        const types: Array<'primary' | 'default' | 'dashed' | 'text' | 'link'> = [
            'primary',
            'default',
            'dashed',
            'text',
            'link',
        ];
        for (const t of types) {
            const { unmount } = render(<Button type={t}>x</Button>);
            expect(screen.getByRole('button')).toHaveClass(`animal-btn-${t}`);
            unmount();
        }
    });

    it('size 全部枚举（small / middle / large）', () => {
        const sizes: Array<'small' | 'middle' | 'large'> = ['small', 'middle', 'large'];
        for (const s of sizes) {
            const { unmount } = render(<Button size={s}>x</Button>);
            expect(screen.getByRole('button')).toHaveClass(`animal-btn-${s}`);
            unmount();
        }
    });

    it('danger / ghost / block / loading 单独应用', () => {
        const { rerender } = render(<Button danger>x</Button>);
        expect(screen.getByRole('button')).toHaveClass('animal-btn-danger');
        rerender(<Button ghost>x</Button>);
        expect(screen.getByRole('button')).toHaveClass('animal-btn-ghost');
        rerender(<Button block>x</Button>);
        expect(screen.getByRole('button')).toHaveClass('animal-btn-block');
        rerender(<Button loading>x</Button>);
        expect(screen.getByRole('button')).toHaveClass('animal-btn-loading');
    });

    it('键盘 Enter 触发 onClick', async () => {
        const user = userEvent.setup();
        const onClick = vi.fn();
        render(<Button onClick={onClick}>x</Button>);
        screen.getByRole('button').focus();
        await user.keyboard('{Enter}');
        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('键盘 Space 触发 onClick', async () => {
        const user = userEvent.setup();
        const onClick = vi.fn();
        render(<Button onClick={onClick}>x</Button>);
        screen.getByRole('button').focus();
        await user.keyboard(' ');
        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('disabled 状态禁用键盘 Enter 触发', async () => {
        const user = userEvent.setup();
        const onClick = vi.fn();
        render(
            <Button disabled onClick={onClick}>
                x
            </Button>
        );
        screen.getByRole('button').focus();
        await user.keyboard('{Enter}');
        expect(onClick).not.toHaveBeenCalled();
    });

    it('loading 状态点击不触发 onClick（CSS pointer-events:none 下 fireEvent 仍冒泡，但业务逻辑拦截）', () => {
        const onClick = vi.fn();
        render(
            <Button loading onClick={onClick}>
                x
            </Button>
        );
        // loading 时 handleClick 内部 stopPropagation + preventDefault，onClick 不会被调用
        fireEvent.click(screen.getByRole('button'));
        expect(onClick).not.toHaveBeenCalled();
    });

    it('className / style / data-* 透传到原生 button', () => {
        render(
            <Button className="custom" style={{ padding: 10 }} data-testid="b" aria-label="go">
                x
            </Button>
        );
        const btn = screen.getByTestId('b');
        expect(btn).toHaveClass('custom');
        expect(btn).toHaveStyle({ padding: '10px' });
        expect(btn).toHaveAttribute('aria-label', 'go');
    });

    it('onClick 接收原生 MouseEvent 参数', async () => {
        const user = userEvent.setup();
        const onClick = vi.fn();
        render(<Button onClick={onClick}>x</Button>);
        await user.click(screen.getByRole('button'));
        expect(onClick.mock.calls[0][0]).toBeInstanceOf(Object);
        expect(onClick.mock.calls[0][0].type).toBe('click');
    });
});
