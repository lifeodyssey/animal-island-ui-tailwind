import type { ReactNode } from 'react';

export type NotificationType = 'success' | 'info' | 'warning' | 'error';
export type NotificationPosition = 'top' | 'topLeft' | 'topRight' | 'bottom' | 'bottomLeft' | 'bottomRight';
export type NotificationPlacement = 'top' | 'bottom';

export interface NotificationConfig {
    /** 通知标题（必填） */
    message: ReactNode;
    description?: ReactNode;
    /** 自动关闭延时（秒），默认 4.5；传 0 不自动关闭 */
    duration?: number;
    position?: NotificationPosition;
    type?: NotificationType;
    icon?: ReactNode;
    btn?: ReactNode;
    /** 显式指定 key 后再次调用同 key 会更新现有通知 */
    key?: string;
    onClose?: () => void;
    onClick?: () => void;
    closeIcon?: ReactNode;
    className?: string;
    style?: React.CSSProperties;
}

export interface NotificationItem extends NotificationConfig {
    key: string;
    type: NotificationType;
    position: NotificationPosition;
    placement: NotificationPlacement;
    createdAt: number;
}
