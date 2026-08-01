import { describe, it, expect, vi, afterEach } from 'vitest';
import { act, waitFor } from '@testing-library/react';
import { Notification, notificationDestroy } from './NotificationPortal';

afterEach(async () => {
    await act(async () => {
        notificationDestroy();
    });
});

describe('Notification imperative API', () => {
    it('Notification.open mounts animal-notification-root to body', async () => {
        await act(async () => {
            Notification.open({ message: 'Test', type: 'info', duration: 0 });
        });
        await waitFor(() => {
            expect(document.querySelector('.animal-notification-root')).not.toBeNull();
        });
    });

    it('renders animal-notification element', async () => {
        await act(async () => {
            Notification.open({ message: 'Test', type: 'info', duration: 0 });
        });
        await waitFor(() => {
            expect(document.querySelectorAll('.animal-notification').length).toBeGreaterThan(0);
        });
    });

    it('type=success applies animal-notification-success class', async () => {
        await act(async () => {
            Notification.open({ message: 'Success!', type: 'success', duration: 0 });
        });
        await waitFor(() => {
            expect(document.querySelector('.animal-notification-success')).not.toBeNull();
        });
    });

    it('type=error applies animal-notification-error class', async () => {
        await act(async () => {
            Notification.open({ message: 'Error!', type: 'error', duration: 0 });
        });
        await waitFor(() => {
            expect(document.querySelector('.animal-notification-error')).not.toBeNull();
        });
    });

    it('message content renders to animal-notification-title', async () => {
        await act(async () => {
            Notification.open({ message: '消息内容', type: 'info', duration: 0 });
        });
        await waitFor(() => {
            const title = document.querySelector('.animal-notification-title');
            expect(title?.textContent).toBe('消息内容');
        });
    });

    it('notificationDestroy removes all notifications', async () => {
        await act(async () => {
            Notification.open({ message: 'A', duration: 0, key: 'k1' });
            Notification.open({ message: 'B', duration: 0, key: 'k2' });
        });
        await waitFor(() => {
            expect(document.querySelectorAll('.animal-notification').length).toBe(2);
        });
        await act(async () => {
            notificationDestroy();
        });
        await waitFor(() => {
            expect(document.querySelectorAll('.animal-notification').length).toBe(0);
        });
    });

    it('calls onClose callback when close button is clicked', async () => {
        const onClose = vi.fn();
        await act(async () => {
            Notification.open({ message: 'Test', type: 'info', duration: 0, onClose });
        });
        await waitFor(() => {
            expect(document.querySelector('.animal-notification-close')).not.toBeNull();
        });
        await act(async () => {
            (document.querySelector('.animal-notification-close') as HTMLElement).click();
        });
        await waitFor(() => {
            expect(onClose).toHaveBeenCalledTimes(1);
        }, { timeout: 1000 });
    });
});
