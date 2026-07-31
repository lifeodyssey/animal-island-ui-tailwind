import React, { useSyncExternalStore } from 'react';
import { createRoot } from 'react-dom/client';
import { NotificationView } from './Notification';
import type { NotificationConfig, NotificationItem, NotificationPlacement, NotificationType } from './types';

// ─── Module-level store ──────────────────────────────────────────────────────

export const NOTIFICATION_DEFAULT_DURATION = 3000;

let storeItems: NotificationItem[] = [];
const listeners = new Set<() => void>();
let counter = 0;
let container: HTMLElement | null = null;
let root: ReturnType<typeof createRoot> | null = null;

// ─── Store helpers ────────────────────────────────────────────────────────────

function subscribe(listener: () => void): () => void {
    listeners.add(listener);
    return () => {
        listeners.delete(listener);
    };
}

function getSnapshot(): NotificationItem[] {
    return storeItems;
}

function getServerSnapshot(): NotificationItem[] {
    return [];
}

function notify(): void {
    // Each mutation already assigns a new array reference to storeItems so that
    // useSyncExternalStore detects the change via Object.is comparison.
    listeners.forEach((l) => l());
}

// ─── Portal mounting ──────────────────────────────────────────────────────────

function mount(el: HTMLElement): void {
    el.className = 'animal-notification-root';
    document.body.appendChild(el);
}

function ensureMounted(): void {
    if (typeof document === 'undefined') return;
    // Recreate if the container has been detached from the DOM (e.g. between tests)
    if (root !== null && container !== null && document.body.contains(container)) return;

    const el = document.createElement('div');
    mount(el);
    container = el;
    root = createRoot(el);
    root.render(React.createElement(Bridge));
}

// ─── React components ─────────────────────────────────────────────────────────

function handleClose(key: string): void {
    storeItems = storeItems.filter((item) => item.key !== key);
    notify();
}

function NotificationContainer(): React.ReactElement | null {
    const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

    // Group by position, preserving insertion order within each group
    const byPosition = items.reduce<Record<string, NotificationItem[]>>((acc, item) => {
        const pos = item.position;
        if (!acc[pos]) acc[pos] = [];
        acc[pos].push(item);
        return acc;
    }, {});

    const positions = Object.keys(byPosition);
    if (positions.length === 0) return null;

    return (
        <>
            {positions.map((position) => (
                <div key={position} className={'animal-notification-position-' + position}>
                    {byPosition[position].map((item) => (
                        <NotificationView key={item.key} item={item} onClose={handleClose} />
                    ))}
                </div>
            ))}
        </>
    );
}

function Bridge(): React.ReactElement {
    return <NotificationContainer />;
}

// ─── Build item ───────────────────────────────────────────────────────────────

function buildItem(config: NotificationConfig): NotificationItem {
    const key = config.key ?? String(++counter);
    const position = config.position ?? 'topRight';
    const placement: NotificationPlacement = position.startsWith('bottom') ? 'bottom' : 'top';
    const type: NotificationType = config.type ?? 'info';
    return {
        ...config,
        key,
        type,
        position,
        placement,
        duration: config.duration !== undefined ? config.duration : NOTIFICATION_DEFAULT_DURATION,
        createdAt: Date.now(),
    };
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function notificationOpen(config: NotificationConfig): void {
    ensureMounted();
    const item = buildItem(config);
    const idx = storeItems.findIndex((i) => i.key === item.key);
    if (idx !== -1) {
        // Update existing item in place, producing a new array reference
        storeItems = [
            ...storeItems.slice(0, idx),
            item,
            ...storeItems.slice(idx + 1),
        ];
    } else {
        storeItems = [...storeItems, item];
    }
    notify();
}

export function notificationDestroy(key?: string): void {
    if (key !== undefined) {
        storeItems = storeItems.filter((i) => i.key !== key);
    } else {
        storeItems = [];
    }
    notify();
}

export interface NotificationStatic {
    open: (config: NotificationConfig) => void;
    destroy: (key?: string) => void;
}

export const notificationApi: NotificationStatic = {
    open: notificationOpen,
    destroy: notificationDestroy,
};

export const Notification = notificationApi;
