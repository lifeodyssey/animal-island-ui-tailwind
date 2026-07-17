import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { NotificationView } from './Notification';
import type { NotificationItem } from './types';

const makeItem = (overrides?: Partial<NotificationItem>): NotificationItem => ({
    key: 'test-key',
    message: 'Test message',
    type: 'info',
    position: 'top',
    placement: 'top',
    duration: 0,
    createdAt: 0,
    ...overrides,
});

describe('NotificationView', () => {
    it('渲染 message', () => {
        render(<NotificationView item={makeItem()} onRemove={vi.fn()} />);
        expect(screen.getByText('Test message')).toBeInTheDocument();
    });

    it('渲染 description', () => {
        render(<NotificationView item={makeItem({ description: 'desc text' })} onRemove={vi.fn()} />);
        expect(screen.getByText('desc text')).toBeInTheDocument();
    });

    it('渲染关闭按钮', () => {
        render(<NotificationView item={makeItem()} onRemove={vi.fn()} />);
        expect(screen.getByRole('button', { name: 'close' })).toBeInTheDocument();
    });

    it('type=success 应用 animal-notification-type-success', () => {
        const { container } = render(<NotificationView item={makeItem({ type: 'success' })} onRemove={vi.fn()} />);
        expect(container.firstChild).toHaveClass('animal-notification-type-success');
    });

    it('type=error 应用 animal-notification-type-error', () => {
        const { container } = render(<NotificationView item={makeItem({ type: 'error' })} onRemove={vi.fn()} />);
        expect(container.firstChild).toHaveClass('animal-notification-type-error');
    });

    it('placement=top 应用 animal-notification-placement-top', () => {
        const { container } = render(<NotificationView item={makeItem({ placement: 'top' })} onRemove={vi.fn()} />);
        expect(container.firstChild).toHaveClass('animal-notification-placement-top');
    });

    it('onClick 存在时应用 animal-notification-clickable', () => {
        const { container } = render(
            <NotificationView item={makeItem({ onClick: vi.fn() })} onRemove={vi.fn()} />
        );
        expect(container.firstChild).toHaveClass('animal-notification-clickable');
    });

    it('duration=0 时不自动关闭', async () => {
        const onRemove = vi.fn();
        render(<NotificationView item={makeItem({ duration: 0 })} onRemove={onRemove} />);
        await act(async () => { await new Promise((r) => setTimeout(r, 100)); });
        expect(onRemove).not.toHaveBeenCalled();
    });
});
