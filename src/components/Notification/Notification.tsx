import React, { useEffect, useRef, useState, useCallback, useSyncExternalStore } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { cn } from '../../utils/cn';
import type { NotificationConfig, NotificationItem, NotificationPosition, NotificationType } from './types';

export type { NotificationConfig, NotificationItem, NotificationPosition, NotificationType } from './types';

const ENTER_MS = 250;
const LEAVE_MS = 250;

export const NOTIFICATION_DEFAULT_DURATION = 4.5;

// ---- Default icons (inline SVG, currentColor) ----
const DEFAULT_ICONS: Record<NotificationType, React.ReactNode> = {
    success: (
        <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden>
            <path
                d="M5 12.5l4.5 4.5L19 7.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    ),
    info: (
        <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden>
            <circle cx="12" cy="7" r="1.6" fill="currentColor" />
            <path d="M12 11v7" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
    ),
    warning: (
        <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden>
            <path
                d="M12 4l9.5 16.5h-19z"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinejoin="round"
            />
            <path
                d="M12 10v4M12 16.5v.01"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
            />
        </svg>
    ),
    error: (
        <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden>
            <path
                d="M6.5 6.5l11 11M17.5 6.5l-11 11"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
            />
        </svg>
    ),
};

// ---- Single notification view ----
export interface NotificationViewProps {
    item: NotificationItem;
    onRemove: (key: string) => void;
}

export const NotificationView: React.FC<NotificationViewProps> = ({ item, onRemove }) => {
    const [leaving, setLeaving] = useState(false);
    const closeTimerRef = useRef<number | null>(null);
    const removeTimerRef = useRef<number | null>(null);

    const triggerClose = useCallback(() => {
        if (leaving) return;
        setLeaving(true);
    }, [leaving]);

    useEffect(() => {
        if (!item.duration || item.duration <= 0) return;
        closeTimerRef.current = window.setTimeout(() => {
            triggerClose();
        }, item.duration * 1000);
        return () => {
            if (closeTimerRef.current !== null) {
                window.clearTimeout(closeTimerRef.current);
                closeTimerRef.current = null;
            }
        };
    }, [item.duration, triggerClose]);

    useEffect(() => {
        if (!leaving) return;
        removeTimerRef.current = window.setTimeout(() => {
            onRemove(item.key);
            item.onClose?.();
        }, LEAVE_MS);
        return () => {
            if (removeTimerRef.current !== null) {
                window.clearTimeout(removeTimerRef.current);
                removeTimerRef.current = null;
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [leaving, item.key, item.onClose, onRemove]);

    const handleCloseClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        triggerClose();
    };

    const handleClick = () => {
        if (item.onClick) item.onClick();
    };

    const cls = cn(
        'animal-notification',
        `animal-notification-type-${item.type}`,
        `animal-notification-placement-${item.placement}`,
        leaving && 'animal-notification-leaving',
        !!item.onClick && 'animal-notification-clickable',
        item.className
    );

    const iconNode = item.icon ?? DEFAULT_ICONS[item.type];

    return (
        <div
            className={cls}
            style={item.style}
            onClick={handleClick}
            role={item.onClick ? 'button' : undefined}
            tabIndex={item.onClick ? 0 : undefined}
            onKeyDown={(e) => {
                if (item.onClick && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    item.onClick();
                }
            }}
            data-notification-key={item.key}
        >
            <div className="animal-notification-icon" aria-hidden>
                {iconNode}
            </div>
            <div className="animal-notification-body">
                <div className="animal-notification-title">{item.message}</div>
                {item.description !== undefined && item.description !== null && (
                    <div className="animal-notification-description">{item.description}</div>
                )}
            </div>
            {item.btn && <div className="animal-notification-btn">{item.btn}</div>}
            <button
                type="button"
                className="animal-notification-close"
                aria-label="close"
                onClick={handleCloseClick}
            >
                {item.closeIcon ?? <span aria-hidden>×</span>}
            </button>
        </div>
    );
};

// ---- Module-level store ----
const POSITION_PLACEMENT: Record<NotificationPosition, 'top' | 'bottom'> = {
    top: 'top',
    topLeft: 'top',
    topRight: 'top',
    bottom: 'bottom',
    bottomLeft: 'bottom',
    bottomRight: 'bottom',
};

const POSITION_GROUPS: NotificationPosition[] = ['top', 'topLeft', 'topRight', 'bottom', 'bottomLeft', 'bottomRight'];

let storeItems: NotificationItem[] = [];
let counter = 0;
const listeners = new Set<() => void>();
let container: HTMLDivElement | null = null;
let root: Root | null = null;

const subscribe = (listener: () => void): (() => void) => {
    listeners.add(listener);
    return () => {
        listeners.delete(listener);
    };
};

const getSnapshot = (): NotificationItem[] => storeItems;
const getServerSnapshot = (): NotificationItem[] => [];

const mount = (): void => {
    if (root || typeof document === 'undefined') return;
    const el = document.createElement('div');
    el.setAttribute('data-animal-notification-root', '');
    el.className = 'animal-notification-root';
    document.body.appendChild(el);
    container = el;
    root = createRoot(container);
    root.render(<Bridge />);
};

const ensureMounted = (): void => {
    if (root || typeof document === 'undefined') return;
    mount();
};

const Bridge: React.FC = () => {
    const list = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
    return <NotificationContainer items={list} />;
};

const NotificationContainer: React.FC<{ items: NotificationItem[] }> = ({ items: list }) => {
    const handleRemove = useCallback((key: string) => {
        const next = storeItems.filter((it) => it.key !== key);
        if (next.length === storeItems.length) return;
        storeItems = next;
        listeners.forEach((l) => l());
    }, []);

    return (
        <>
            {POSITION_GROUPS.map((position) => {
                const groupItems = list.filter((it) => it.position === position);
                if (groupItems.length === 0) return null;
                return (
                    <div
                        key={position}
                        className={cn('animal-notification-group', `animal-notification-group-${position}`)}
                        data-position={position}
                    >
                        {groupItems.map((it) => (
                            <NotificationView key={it.key} item={it} onRemove={handleRemove} />
                        ))}
                    </div>
                );
            })}
        </>
    );
};

// ---- Public API ----
const buildItem = (config: NotificationConfig | string, type: NotificationType): NotificationItem => {
    const normalized: NotificationConfig = typeof config === 'string' ? { message: config } : { ...config };
    const position: NotificationPosition = normalized.position ?? 'top';
    counter += 1;
    return {
        ...normalized,
        type,
        key: normalized.key ?? `animal-notification-${Date.now()}-${counter}`,
        position,
        placement: POSITION_PLACEMENT[position],
        duration: normalized.duration ?? NOTIFICATION_DEFAULT_DURATION,
        createdAt: Date.now(),
    };
};

const open = (config: NotificationConfig | string, type: NotificationType = 'info'): void => {
    if (typeof document === 'undefined') return;
    const item = buildItem(config, type);

    if (item.key) {
        const idx = storeItems.findIndex((it) => it.key === item.key);
        if (idx !== -1) {
            const next = storeItems.slice();
            next[idx] = item;
            storeItems = next;
            listeners.forEach((l) => l());
            return;
        }
    }

    storeItems = [...storeItems, item];
    listeners.forEach((l) => l());
    ensureMounted();
};

const destroy = (key?: string): void => {
    let removed: NotificationItem[] = [];
    if (key) {
        removed = storeItems.filter((it) => it.key === key);
        const next = storeItems.filter((it) => it.key !== key);
        if (next.length === storeItems.length) return;
        storeItems = next;
    } else if (storeItems.length === 0) {
        // Clean up root even when store is empty (for afterEach cleanup in tests)
        if (root && container) {
            root.unmount();
            container.remove();
            root = null;
            container = null;
        }
        return;
    } else {
        removed = storeItems.slice();
        storeItems = [];
    }
    listeners.forEach((l) => l());
    removed.forEach((it) => it.onClose?.());
    // If all items removed, tear down the root
    if (storeItems.length === 0 && root && container) {
        // Defer unmount to allow React to flush the empty render first.
        // Re-check the store when the timeout fires: an open() issued between
        // destroy() and this callback must not have its root torn down.
        setTimeout(() => {
            if (storeItems.length !== 0) return;
            root?.unmount();
            container?.remove();
            root = null;
            container = null;
        }, 0);
    }
};

export interface NotificationStatic {
    (config: NotificationConfig | string): void;
    open: (config: NotificationConfig | string) => void;
    success: (config: NotificationConfig | string) => void;
    info: (config: NotificationConfig | string) => void;
    warning: (config: NotificationConfig | string) => void;
    error: (config: NotificationConfig | string) => void;
    destroy: (key?: string) => void;
}

// eslint-disable-next-line react-refresh/only-export-components
const notificationApi = ((config: NotificationConfig | string) => open(config, 'info')) as NotificationStatic;
notificationApi.open = (config) => open(config, 'info');
notificationApi.success = (config) => open(config, 'success');
notificationApi.info = (config) => open(config, 'info');
notificationApi.warning = (config) => open(config, 'warning');
notificationApi.error = (config) => open(config, 'error');
notificationApi.destroy = destroy;

export const Notification = notificationApi;
// eslint-disable-next-line react-refresh/only-export-components
export { open as notificationOpen, destroy as notificationDestroy };
