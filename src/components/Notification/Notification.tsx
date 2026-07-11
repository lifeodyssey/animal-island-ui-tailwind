// Notification single-item view.
// Enter/leave animation driven by placement class; leave: setLeaving → 300ms → parent removes from store.
import React, { useEffect, useRef, useState } from 'react';
import { cn } from '../../utils/cn';
import type { NotificationItem } from './types';

const ENTER_MS = 250;
const LEAVE_MS = 250;

export interface NotificationViewProps {
    item: NotificationItem;
    onRemove: (key: string) => void;
}

const DEFAULT_ICONS: Record<NotificationItem['type'], React.ReactNode> = {
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
            <path d="M12 4l9.5 16.5h-19z" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
            <path d="M12 10v4M12 16.5v.01" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
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

export const NotificationView: React.FC<NotificationViewProps> = ({ item, onRemove }) => {
    const [leaving, setLeaving] = useState(false);
    const closeTimerRef = useRef<number | null>(null);
    const removeTimerRef = useRef<number | null>(null);

    const triggerClose = React.useCallback(() => {
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
        // Intentionally omit item — leave timer only needs to reset on leaving/key/onClose changes.
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
        `animal-notification-${item.type}`,
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
            {item.btn && <div className="animal-notification-btn-slot">{item.btn}</div>}
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

export const NOTIFICATION_ENTER_MS = ENTER_MS;
export const NOTIFICATION_LEAVE_MS = LEAVE_MS;
