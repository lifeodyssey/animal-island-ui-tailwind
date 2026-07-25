import { describe, it, expect, vi } from 'vitest';
import { render, act, fireEvent } from '@testing-library/react';
import { NotificationView } from './Notification';
import type { NotificationItem } from './types';

const baseItem = (): NotificationItem => ({
    key: 'k1',
    type: 'info',
    position: 'topRight',
    placement: 'top',
    message: 'Hello',
    duration: 0,
    createdAt: 0,
});

/**
 * NotificationView guardrail. Stable `animal-notification*` class names replace
 * upstream Less-module hashes. Structural parity with upstream Notification tests.
 */
describe('NotificationView', () => {
    it('渲染 animal-notification 根类', () => {
        const { container } = render(<NotificationView item={baseItem()} onRemove={vi.fn()} />);
        const root = container.firstChild as HTMLElement;
        expect(root.classList.contains('animal-notification')).toBe(true);
    });

    it('type 映射到 animal-notification-type-{type}', () => {
        const types = ['success', 'info', 'warning', 'error'] as const;
        for (const type of types) {
            const { container } = render(
                <NotificationView item={{ ...baseItem(), type }} onRemove={vi.fn()} />
            );
            const root = container.firstChild as HTMLElement;
            expect(root.classList.contains(`animal-notification-type-${type}`)).toBe(true);
        }
    });

    it('placement 映射到 animal-notification-placement-{placement}', () => {
        const { container } = render(
            <NotificationView item={{ ...baseItem(), placement: 'bottom' }} onRemove={vi.fn()} />
        );
        const root = container.firstChild as HTMLElement;
        expect(root.classList.contains('animal-notification-placement-bottom')).toBe(true);
    });

    it('message 渲染到 animal-notification-title', () => {
        const { container } = render(
            <NotificationView item={{ ...baseItem(), message: 'Test msg' }} onRemove={vi.fn()} />
        );
        expect(container.querySelector('.animal-notification-title')?.textContent).toBe('Test msg');
    });

    it('description 存在时渲染到 animal-notification-description', () => {
        const { container } = render(
            <NotificationView item={{ ...baseItem(), description: 'Desc' }} onRemove={vi.fn()} />
        );
        expect(container.querySelector('.animal-notification-description')?.textContent).toBe('Desc');
    });

    it('description 缺失时不渲染 description 元素', () => {
        const { container } = render(<NotificationView item={baseItem()} onRemove={vi.fn()} />);
        expect(container.querySelector('.animal-notification-description')).toBeNull();
    });

    it('关闭按钮带 animal-notification-close 类', () => {
        const { container } = render(<NotificationView item={baseItem()} onRemove={vi.fn()} />);
        expect(container.querySelector('.animal-notification-close')).not.toBeNull();
    });

    it('点击关闭按钮后添加 animal-notification-leaving 类', async () => {
        const { container } = render(<NotificationView item={baseItem()} onRemove={vi.fn()} />);
        const closeBtn = container.querySelector('.animal-notification-close') as HTMLElement;
        await act(async () => {
            fireEvent.click(closeBtn);
        });
        const root = container.firstChild as HTMLElement;
        expect(root.classList.contains('animal-notification-leaving')).toBe(true);
    });

    it('有 onClick 时添加 animal-notification-clickable，渲染 role=button', () => {
        const onClick = vi.fn();
        const { container } = render(
            <NotificationView item={{ ...baseItem(), onClick }} onRemove={vi.fn()} />
        );
        const root = container.firstChild as HTMLElement;
        expect(root.classList.contains('animal-notification-clickable')).toBe(true);
        expect(root.getAttribute('role')).toBe('button');
    });

    it('btn slot 渲染到 animal-notification-btn-slot', () => {
        const { container } = render(
            <NotificationView item={{ ...baseItem(), btn: <button>OK</button> }} onRemove={vi.fn()} />
        );
        expect(container.querySelector('.animal-notification-btn-slot')).not.toBeNull();
    });
});
