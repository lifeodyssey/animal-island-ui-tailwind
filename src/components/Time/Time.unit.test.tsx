import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { render, screen, act, cleanup } from '@testing-library/react';
import { Time } from './Time';

afterEach(() => cleanup());

describe('Time', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2026-08-15T14:30:00'));
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    describe('game type (default)', () => {
        it('默认渲染 game 类型布局', () => {
            const { container } = render(<Time />);
            expect(container.querySelector('.animal-time-game')).toBeInTheDocument();
        });

        it('显示当前时分', () => {
            render(<Time />);
            expect(screen.getByText(/14.*30/)).toBeInTheDocument();
        });

        it('显示中文月日', () => {
            render(<Time />);
            expect(screen.getByText('8月15日')).toBeInTheDocument();
        });

        it('显示中文星期（周六 = 六）', () => {
            render(<Time />);
            expect(screen.getByText('六')).toBeInTheDocument();
        });

        it('应用自定义 className', () => {
            const { container } = render(<Time className="my-cls" />);
            expect(container.firstChild).toHaveClass('animal-time-game');
            expect(container.firstChild).toHaveClass('my-cls');
        });

        it('每秒刷新时间', () => {
            render(<Time />);
            act(() => {
                vi.setSystemTime(new Date('2026-08-15T14:31:00'));
                vi.advanceTimersByTime(1000);
            });
            expect(screen.getByText(/14.*31/)).toBeInTheDocument();
        });
    });

    describe('hud type', () => {
        it('渲染 hud 类型布局', () => {
            const { container } = render(<Time type="hud" />);
            expect(container.querySelector('.animal-time')).toBeInTheDocument();
            expect(container.querySelector('.animal-time-game')).not.toBeInTheDocument();
        });

        it('显示英文星期', () => {
            render(<Time type="hud" />);
            expect(screen.getByText('Saturday')).toBeInTheDocument();
        });

        it('显示英文月份和日期', () => {
            render(<Time type="hud" />);
            expect(screen.getByText('Aug 15')).toBeInTheDocument();
        });

        it('显示当前时分', () => {
            render(<Time type="hud" />);
            expect(screen.getByText(/14.*30/)).toBeInTheDocument();
        });

        it('应用自定义 className', () => {
            const { container } = render(<Time type="hud" className="hud-cls" />);
            expect(container.firstChild).toHaveClass('animal-time');
            expect(container.firstChild).toHaveClass('hud-cls');
        });
    });
});
