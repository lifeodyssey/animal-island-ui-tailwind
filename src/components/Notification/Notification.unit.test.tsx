import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { screen, waitFor, act } from '@testing-library/react';
import { Notification, notificationDestroy } from './NotificationPortal';

const wait = (ms = 0) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const getContainer = (): HTMLElement | null => document.querySelector('[data-animal-notification-root]');

const waitForContainer = async (): Promise<HTMLElement> => {
    return waitFor(() => {
        const el = getContainer();
        if (!el) throw new Error('notification root not mounted yet');
        return el;
    });
};

describe('Notification', () => {
    beforeEach(async () => {
        notificationDestroy();
        await wait();
        await wait(300);
    });

    afterEach(async () => {
        notificationDestroy();
        await wait(300);
    });

    it('open mounts notification root on body', async () => {
        expect(getContainer()).toBeNull();
        act(() => {
            Notification.info('hello');
        });
        const root = await waitForContainer();
        expect(root).not.toBeNull();
        await waitFor(() => {
            expect(screen.getByText('hello')).toBeInTheDocument();
        });
    });

    it('string shorthand renders as message', async () => {
        act(() => {
            Notification.success('success msg');
        });
        await waitForContainer();
        await waitFor(() => {
            expect(screen.getByText('success msg')).toBeInTheDocument();
        });
    });

    it('config object renders message + description', async () => {
        act(() => {
            Notification.info({ message: '标题', description: '描述' });
        });
        await waitForContainer();
        await waitFor(() => {
            expect(screen.getByText('标题')).toBeInTheDocument();
            expect(screen.getByText('描述')).toBeInTheDocument();
        });
    });

    it('destroy() removes all notifications', async () => {
        act(() => {
            Notification.info({ message: 'item', duration: 0 });
        });
        await waitForContainer();
        await waitFor(() => expect(screen.getByText('item')).toBeInTheDocument());
        act(() => {
            notificationDestroy();
        });
        await waitFor(() => expect(screen.queryByText('item')).not.toBeInTheDocument());
    });

    it('destroy(key) removes only matching notification', async () => {
        act(() => {
            Notification.info({ message: 'keep', key: 'keep', duration: 0 });
            Notification.info({ message: 'remove', key: 'remove', duration: 0 });
        });
        await waitForContainer();
        await waitFor(() => {
            expect(screen.getByText('keep')).toBeInTheDocument();
            expect(screen.getByText('remove')).toBeInTheDocument();
        });
        act(() => {
            notificationDestroy('remove');
        });
        await waitFor(() => {
            expect(screen.queryByText('remove')).not.toBeInTheDocument();
            expect(screen.getByText('keep')).toBeInTheDocument();
        });
    });

    it('type classes are applied correctly', async () => {
        act(() => {
            Notification.success({ message: 'ok', duration: 0 });
        });
        await waitForContainer();
        await waitFor(() => {
            const el = document.querySelector('[data-notification-key]');
            expect(el).toHaveClass('animal-notification-type-success');
        });
    });
});
