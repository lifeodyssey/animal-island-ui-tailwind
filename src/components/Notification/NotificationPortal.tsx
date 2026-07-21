import React, { useCallback, useSyncExternalStore } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { cn } from '../../utils/cn';
import { NotificationView } from './Notification';
import type { NotificationConfig, NotificationItem, NotificationPosition, NotificationType } from './types';

const DEFAULT_DURATION = 4.5;

const POSITION_PLACEMENT: Record<NotificationPosition, 'top' | 'bottom'> = {
    top: 'top',
    topLeft: 'top',
    topRight: 'top',
    bottom: 'bottom',
    bottomLeft: 'bottom',
    bottomRight: 'bottom',
};

const POSITION_GROUPS: NotificationPosition[] = ['top', 'topLeft', 'topRight', 'bottom', 'bottomLeft', 'bottomRight'];

// ---- Module-level store ----
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
                        className={cn(`animal-notification-position-${position}`)}
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
        duration: normalized.duration ?? DEFAULT_DURATION,
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
        return;
    } else {
        removed = storeItems.slice();
        storeItems = [];
    }
    listeners.forEach((l) => l());
    removed.forEach((it) => it.onClose?.());
};

/**
 * 命令式 Notification,沿用 antd 风格静态方法。
 *
 * - `Notification.open(config)` / `Notification.success(config)` / `.info(config)` / `.warning(config)` / `.error(config)`
 * - `config` 可以是字符串(仅 message)或完整对象
 * - `Notification.destroy()` 关闭全部,`Notification.destroy(key)` 关闭指定 key
 * - 默认位置: `top`(顶部居中)
 * - 默认 `duration: 4.5` 秒;传 `0` 关闭自动关闭
 * - 显式指定 `key` 后再次调用同 key 会更新现有通知而不是新增
 */
export interface NotificationStatic {
    (config: NotificationConfig | string): void;
    open: (config: NotificationConfig | string) => void;
    success: (config: NotificationConfig | string) => void;
    info: (config: NotificationConfig | string) => void;
    warning: (config: NotificationConfig | string) => void;
    error: (config: NotificationConfig | string) => void;
    destroy: (key?: string) => void;
}

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
export const NOTIFICATION_DEFAULT_DURATION = DEFAULT_DURATION;
