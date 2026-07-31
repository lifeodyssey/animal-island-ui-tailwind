import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { NotificationItem } from './types';

export interface NotificationViewProps {
    item: NotificationItem;
    onClose: (key: string) => void;
}

const ENTER_MS = 300;
const LEAVE_MS = 300;

const DEFAULT_ICONS: Record<string, React.ReactNode> = {
    success: (
        <svg viewBox="0 0 1024 1024" width="1em" height="1em" fill="currentColor" aria-hidden="true">
            <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm193.5 301.7l-210.6 292a31.8 31.8 0 01-51.7 0L318.5 484.9c-3.8-5.3 0-12.7 6.5-12.7h46.9c10.2 0 19.9 4.9 25.9 13.3l71.2 98.8 157.2-218c6-8.3 15.6-13.3 25.9-13.3H699c6.5 0 10.3 7.4 6.5 12.7z" />
        </svg>
    ),
    info: (
        <svg viewBox="0 0 1024 1024" width="1em" height="1em" fill="currentColor" aria-hidden="true">
            <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm32 664c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V456c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v272zm-32-344a48.01 48.01 0 010-96 48.01 48.01 0 010 96z" />
        </svg>
    ),
    warning: (
        <svg viewBox="0 0 1024 1024" width="1em" height="1em" fill="currentColor" aria-hidden="true">
            <path d="M955.7 856l-416-720c-12.5-21.7-45.9-21.7-58.4 0l-416 720C53.5 877.4 68.4 904 89.9 904h836.2c21.5 0 36.4-26.6 29.6-48zM480 416c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v184c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V416zm32 352a48.01 48.01 0 010-96 48.01 48.01 0 010 96z" />
        </svg>
    ),
    error: (
        <svg viewBox="0 0 1024 1024" width="1em" height="1em" fill="currentColor" aria-hidden="true">
            <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm165.4 618.2l-66-.3L512 563.4l-99.3 118.4-66.1.3c-4.4 0-8-3.5-8-8 0-1.9.7-3.7 1.9-5.2l130.1-155.3-130.1-155c-1.2-1.5-1.9-3.3-1.9-5.2 0-4.4 3.6-8 8-8l66.1.3L512 460.7l99.3-118.4 66-.3c4.4 0 8 3.5 8 8 0 1.9-.7 3.7-1.9 5.2L553.5 510l130 155.3c1.2 1.5 1.9 3.3 1.9 5.2 0 4.4-3.5 8-7.9 8l-.1-.1z" />
        </svg>
    ),
};

// Suppress unused-import warning — ENTER_MS is part of the upstream spec and
// kept here as a documented constant even though CSS drives the enter animation.
void ENTER_MS;

export function NotificationView({ item, onClose }: NotificationViewProps) {
    const [leaving, setLeaving] = useState(false);
    const autoCloseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const leaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const leavingRef = useRef(false);

    const startLeave = useCallback(() => {
        if (leavingRef.current) return;
        leavingRef.current = true;
        setLeaving(true);
        leaveTimerRef.current = setTimeout(() => {
            item.onClose?.();
            onClose(item.key);
        }, LEAVE_MS);
    }, [item, onClose]);

    useEffect(() => {
        // Reset leaving state when item key changes (new notification on same slot)
        leavingRef.current = false;
        if (autoCloseTimerRef.current !== null) {
            clearTimeout(autoCloseTimerRef.current);
            autoCloseTimerRef.current = null;
        }
        if (leaveTimerRef.current !== null) {
            clearTimeout(leaveTimerRef.current);
            leaveTimerRef.current = null;
        }

        if (item.duration && item.duration > 0) {
            autoCloseTimerRef.current = setTimeout(startLeave, item.duration);
        }

        return () => {
            if (autoCloseTimerRef.current !== null) clearTimeout(autoCloseTimerRef.current);
            if (leaveTimerRef.current !== null) clearTimeout(leaveTimerRef.current);
        };
    }, [item.key, item.duration, startLeave]);

    const handleCloseClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (autoCloseTimerRef.current !== null) {
            clearTimeout(autoCloseTimerRef.current);
            autoCloseTimerRef.current = null;
        }
        startLeave();
    };

    const handleClick = () => {
        item.onClick?.();
    };

    const cls = [
        'animal-notification',
        `animal-notification-${item.type}`,
        `animal-notification-placement-${item.placement}`,
        leaving && 'animal-notification-leaving',
        !!item.onClick && 'animal-notification-clickable',
        item.className,
    ].filter(Boolean).join(' ');

    const icon = item.icon !== undefined ? item.icon : DEFAULT_ICONS[item.type];
    const closeIcon = item.closeIcon !== undefined ? item.closeIcon : '×';

    return (
        <div
            className={cls}
            style={item.style}
            onClick={handleClick}
            role="alert"
            aria-live="assertive"
        >
            {icon && (
                <span className="animal-notification-icon">{icon}</span>
            )}
            <div className="animal-notification-body">
                <div className="animal-notification-title">{item.message}</div>
                {item.description != null && (
                    <div className="animal-notification-desc">{item.description}</div>
                )}
            </div>
            {item.btn != null && (
                <div className="animal-notification-btn">{item.btn}</div>
            )}
            <button
                type="button"
                className="animal-notification-close"
                onClick={handleCloseClick}
                aria-label="关闭"
            >
                {closeIcon}
            </button>
        </div>
    );
}

NotificationView.displayName = 'NotificationView';
