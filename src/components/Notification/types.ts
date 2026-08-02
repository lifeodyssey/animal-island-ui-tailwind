import type { ReactNode } from 'react';

export type NotificationType = 'success' | 'info' | 'warning' | 'error';

export type NotificationPosition = 'top' | 'topLeft' | 'topRight' | 'bottom' | 'bottomLeft' | 'bottomRight';

export type NotificationPlacement = 'top' | 'bottom';

export interface NotificationConfig {
    message: ReactNode;
    description?: ReactNode;
    duration?: number;
    position?: NotificationPosition;
    type?: NotificationType;
    icon?: ReactNode;
    btn?: ReactNode;
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
