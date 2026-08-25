import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act, cleanup } from '@testing-library/react';
import { Time } from './Time';

describe('Time', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2026-06-08T09:30:00'));
    });

    afterEach(() => {
        cleanup();
        vi.useRealTimers();
    });

    it('type=hud 渲染当前星期、月日与 HH:MM', () => {
        const { container } = render(<Time type="hud" />);
        expect(screen.getByText('Monday')).toBeInTheDocument();
        expect(screen.getByText('Jun 8')).toBeInTheDocument();
        expect(container.textContent).toContain('09');
        expect(container.textContent).toContain('30');
    });

    it('默认渲染 game 布局（时间 / 日期 + 周几）', () => {
        const { container } = render(<Time />);
        expect(container.textContent).toContain('09');
        expect(container.textContent).toContain('30');
        expect(screen.getByText('6月8日')).toBeInTheDocument();
        expect(screen.getByText('一')).toBeInTheDocument();
    });

    it('每秒刷新（推进 1s 后状态可能更新）', () => {
        render(<Time type="hud" />);
        act(() => {
            vi.advanceTimersByTime(1000);
        });
        // 不断言具体时间，只验证渲染不报错
    });

    it('应用 className', () => {
        const { container } = render(<Time className="my-time" />);
        expect(container.firstChild).toHaveClass('my-time');
    });

    it('type=game 渲染上下结构：时间 / 分割线 / 日期 + 周几（周一显示一）', () => {
        const { container } = render(<Time type="game" />);
        expect(container.textContent).toContain('09');
        expect(container.textContent).toContain('30');
        expect(screen.getByText('6月8日')).toBeInTheDocument();
        expect(screen.getByText('一')).toBeInTheDocument();
    });

    it('type=game 周日显示"日"', () => {
        vi.setSystemTime(new Date('2026-06-14T09:30:00')); // Sunday
        render(<Time type="game" />);
        expect(screen.getByText('日')).toBeInTheDocument();
    });

    it('type=game 应用 className', () => {
        const { container } = render(<Time type="game" className="my-game-time" />);
        expect(container.firstChild).toHaveClass('my-game-time');
    });
});
