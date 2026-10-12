import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BackTop } from './BackTop';

describe('BackTop', () => {
    it('默认隐藏（无 visible 类）', () => {
        const { container } = render(<BackTop />);
        const el = container.firstChild as HTMLElement;
        expect(el).toBeInTheDocument();
        expect(el).not.toHaveClass('animal-backtop-visible');
    });

    it('渲染默认 icon（SVG，aria-hidden）', () => {
        const { container } = render(<BackTop />);
        const svg = container.querySelector('svg');
        expect(svg).toBeInTheDocument();
        expect(svg).toHaveAttribute('viewBox', '0 0 48 48');
        // 纯装饰：无障碍名称由外层 role="button" 的 aria-label 提供
        expect(svg).toHaveAttribute('aria-hidden', 'true');
    });

    it('点击触发 onClick', async () => {
        const user = userEvent.setup();
        const onClick = vi.fn();
        const { container } = render(<BackTop onClick={onClick} />);
        const el = container.firstChild as HTMLElement;
        await user.click(el);
        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('应用自定义 className 和 style', () => {
        const { container } = render(<BackTop className="custom" style={{ bottom: 100 }} />);
        const el = container.firstChild as HTMLElement;
        expect(el).toHaveClass('custom');
        expect(el).toHaveStyle({ bottom: '100px' });
    });

    it('键盘 Enter 触发 onClick', async () => {
        const user = userEvent.setup();
        const onClick = vi.fn();
        const { container } = render(<BackTop onClick={onClick} />);
        const el = container.firstChild as HTMLElement;
        el.focus();
        await user.keyboard('{Enter}');
        expect(onClick).toHaveBeenCalledTimes(1);
    });
});
