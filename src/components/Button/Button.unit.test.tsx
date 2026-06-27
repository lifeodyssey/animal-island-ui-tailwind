import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { Button } from './Button';

describe('Button', () => {
    afterEach(() => { cleanup(); });

    it('渲染 children 文案', () => {
        render(<Button>OK</Button>);
        expect(screen.getByRole('button', { name: 'OK' })).toBeInTheDocument();
    });

    it('应用 type / size / 状态相关类', () => {
        render(
            <Button type="primary" size="large" danger ghost block loading>
                OK
            </Button>
        );
        const btn = screen.getByRole('button');
        expect(btn).toHaveClass('animal-btn-primary');
        expect(btn).toHaveClass('animal-btn-large');
        expect(btn).toHaveClass('animal-btn-danger');
        expect(btn).toHaveClass('animal-btn-ghost');
        expect(btn).toHaveClass('animal-btn-block');
        expect(btn).toHaveClass('animal-btn-loading');
    });

    it('htmlType 默认 button，可改为 submit', () => {
        const { rerender } = render(<Button>x</Button>);
        expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
        rerender(<Button htmlType="submit">x</Button>);
        expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
    });

    it('disabled 设置原生 disabled 属性', () => {
        render(<Button disabled>x</Button>);
        expect(screen.getByRole('button')).toBeDisabled();
    });

    it('点击触发 onClick', () => {
        const onClick = vi.fn();
        render(<Button onClick={onClick}>x</Button>);
        fireEvent.click(screen.getByRole('button'));
        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('icon 在非 loading 时渲染，loading 时不渲染图标', () => {
        const { rerender } = render(<Button icon={<i data-testid="ic" />}>x</Button>);
        expect(screen.getByTestId('ic')).toBeInTheDocument();
        rerender(
            <Button icon={<i data-testid="ic" />} loading>
                x
            </Button>
        );
        expect(screen.queryByTestId('ic')).not.toBeInTheDocument();
    });

    // ── 补充测试 (ported from upstream fc630cd) ──

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
            'primary', 'default', 'dashed', 'text', 'link',
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

    it('loading 时设置 aria-busy 与 aria-disabled', () => {
        render(<Button loading>x</Button>);
        const btn = screen.getByRole('button');
        expect(btn).toHaveAttribute('aria-busy', 'true');
        expect(btn).toHaveAttribute('aria-disabled', 'true');
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

    it('onClick 接收原生 MouseEvent 参数', () => {
        const onClick = vi.fn();
        render(<Button onClick={onClick}>x</Button>);
        fireEvent.click(screen.getByRole('button'));
        expect(onClick.mock.calls[0][0]).toBeInstanceOf(Object);
        expect(onClick.mock.calls[0][0].type).toBe('click');
    });
});
