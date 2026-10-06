import { afterEach, describe, it, expect } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';

afterEach(cleanup);
import { Badge, BadgeColor } from './Badge';

const queryIndicator = (container: HTMLElement) => container.querySelector('sup') as HTMLElement | null;

describe('Badge', () => {
    describe('rendering', () => {
        it('渲染 count 数字', () => {
            render(<Badge count={5} />);
            expect(screen.getByText('5')).toBeInTheDocument();
        });

        it('包裹 children 并叠加角标', () => {
            const { container } = render(
                <Badge count={5}>
                    <span>头像</span>
                </Badge>
            );
            const root = container.firstChild as HTMLElement;
            expect(root).toHaveClass('animal-badge');
            expect(root).not.toHaveClass('animal-badge-standalone');
            expect(screen.getByText('头像')).toBeInTheDocument();
            expect(screen.getByText('5')).toBeInTheDocument();
        });

        it('默认应用 medium 尺寸与 app-red 颜色', () => {
            const { container } = render(<Badge count={5} />);
            const sup = queryIndicator(container) as HTMLElement;
            expect(sup).toHaveClass('animal-badge-size-medium');
            expect(sup).toHaveClass('animal-badge-color-app-red');
        });

        it('渲染为 sup 元素，便于附着在被包裹元素右上角', () => {
            const { container } = render(<Badge count={5} />);
            expect(container.querySelector('sup')).toBeInTheDocument();
        });

        it('支持 className 与 style', () => {
            const { container } = render(<Badge count={1} className="x" style={{ marginLeft: 4 }} />);
            const root = container.firstChild as HTMLElement;
            expect(root).toHaveClass('x');
            expect(root).toHaveStyle({ marginLeft: '4px' });
        });

        it('透传原生属性', () => {
            const { container } = render(<Badge count={1} aria-label="未读消息" />);
            expect(container.firstChild).toHaveAttribute('aria-label', '未读消息');
        });
    });

    describe('count 显隐', () => {
        it('不传 count 时不渲染角标', () => {
            const { container } = render(
                <Badge>
                    <span>头像</span>
                </Badge>
            );
            expect(queryIndicator(container)).toBeNull();
        });

        it('count=0 且 showZero=false 时隐藏', () => {
            const { container } = render(<Badge count={0} />);
            expect(queryIndicator(container)).toBeNull();
        });

        it('count=0 且 showZero=true 时显示', () => {
            render(<Badge count={0} showZero />);
            expect(screen.getByText('0')).toBeInTheDocument();
        });

        it('空字符串 count 不渲染角标', () => {
            const { container } = render(<Badge count="" />);
            expect(queryIndicator(container)).toBeNull();
        });

        it('纯空白 count 不渲染角标', () => {
            const { container } = render(<Badge count="  " />);
            expect(queryIndicator(container)).toBeNull();
        });
    });

    describe('overflowCount', () => {
        it('数字超出 overflowCount 时显示 overflowCount+', () => {
            render(<Badge count={100} overflowCount={99} />);
            expect(screen.getByText('99+')).toBeInTheDocument();
        });

        it('数字等于 overflowCount 时原样显示', () => {
            render(<Badge count={99} overflowCount={99} />);
            expect(screen.getByText('99')).toBeInTheDocument();
        });

        it('字符串 count 不参与封顶换算', () => {
            render(<Badge count="100" overflowCount={99} />);
            expect(screen.queryByText('99+')).not.toBeInTheDocument();
            expect(screen.getByText('100')).toBeInTheDocument();
        });
    });

    describe('dot', () => {
        it('dot=true 时渲染小圆点，无内容', () => {
            const { container } = render(<Badge dot />);
            const sup = queryIndicator(container) as HTMLElement;
            expect(sup).not.toBeNull();
            expect(sup).toHaveClass('animal-badge-dot');
            expect(sup.textContent).toBe('');
        });

        it('dot=true 且 count=0 时不渲染（isZero 优先）', () => {
            const { container } = render(<Badge dot count={0} />);
            expect(queryIndicator(container)).toBeNull();
        });
    });

    describe('standalone', () => {
        it('不传 children 时添加 standalone 类', () => {
            const { container } = render(<Badge count={5} />);
            expect(container.firstChild).toHaveClass('animal-badge-standalone');
        });

        it('传入 children 时不添加 standalone 类', () => {
            const { container } = render(
                <Badge count={5}>
                    <span />
                </Badge>
            );
            expect(container.firstChild).not.toHaveClass('animal-badge-standalone');
        });
    });

    describe('color', () => {
        const colors: BadgeColor[] = [
            'app-red', 'app-pink', 'app-orange', 'app-yellow', 'app-teal',
            'app-green', 'app-blue', 'purple', 'lime-green', 'yellow-green',
            'brown', 'warm-peach-pink',
        ];

        it.each(colors)('color="%s" 应用对应颜色类', (color) => {
            const { container } = render(<Badge count={1} color={color} />);
            const sup = queryIndicator(container) as HTMLElement;
            expect(sup).toHaveClass(`animal-badge-color-${color}`);
        });
    });

    describe('size', () => {
        it('size=small 应用 small 类', () => {
            const { container } = render(<Badge count={1} size="small" />);
            const sup = queryIndicator(container) as HTMLElement;
            expect(sup).toHaveClass('animal-badge-size-small');
        });
    });

    describe('circle vs capsule', () => {
        it('1 位数字应用 circle 类', () => {
            const { container } = render(<Badge count={5} />);
            const sup = queryIndicator(container) as HTMLElement;
            expect(sup).toHaveClass('animal-badge-circle');
        });

        it('3 位以上不应用 circle 类', () => {
            const { container } = render(<Badge count={100} overflowCount={999} />);
            const sup = queryIndicator(container) as HTMLElement;
            expect(sup).not.toHaveClass('animal-badge-circle');
        });
    });
});
