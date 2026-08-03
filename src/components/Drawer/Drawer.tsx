import React, { useEffect, useCallback, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../utils/cn';
import { Cursor } from '../Cursor';

const FOCUSABLE_SELECTOR = [
    'a[href]',
    'area[href]',
    'button:not([disabled])',
    'input:not([disabled]):not([type="hidden"])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    'audio[controls]',
    'video[controls]',
    '[contenteditable]:not([contenteditable="false"])',
].join(',');

const getFocusable = (root: HTMLElement): HTMLElement[] => {
    return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
        (el) => !el.hasAttribute('disabled') && el.getAttribute('aria-hidden') !== 'true'
    );
};

let bodyScrollLocks = 0;
let savedBodyOverflow = '';

export type DrawerPlacement = 'left' | 'right' | 'top' | 'bottom';

export interface DrawerProps {
    open: boolean;
    title?: React.ReactNode;
    placement?: DrawerPlacement;
    width?: number | string;
    height?: number | string;
    maskClosable?: boolean;
    pushBackground?: boolean;
    footer?: React.ReactNode | null;
    onClose?: () => void;
    children?: React.ReactNode;
    className?: string;
    maskStyle?: React.CSSProperties;
}

export const Drawer: React.FC<DrawerProps> = ({
    open,
    title,
    placement = 'right',
    width = 378,
    height = 300,
    maskClosable = true,
    pushBackground = true,
    footer,
    onClose,
    children,
    className,
    maskStyle,
}) => {
    const dialogRef = useRef<HTMLDivElement>(null);
    const previouslyFocusedRef = useRef<HTMLElement | null>(null);
    const restoreTransitionRafRef = useRef<number | null>(null);

    // Save/restore focus
    useEffect(() => {
        if (open) {
            previouslyFocusedRef.current = document.activeElement as HTMLElement | null;
            const dialog = dialogRef.current;
            if (dialog) {
                const focusables = getFocusable(dialog);
                if (focusables.length > 0) {
                    focusables[0].focus();
                } else {
                    dialog.focus();
                }
            }
        } else {
            previouslyFocusedRef.current?.focus();
        }
    }, [open]);

    // ESC to close + focus trap
    useEffect(() => {
        if (!open) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                e.stopPropagation();
                onClose?.();
                return;
            }
            if (e.key !== 'Tab') return;
            const dialog = dialogRef.current;
            if (!dialog) return;
            const focusables = getFocusable(dialog);
            if (focusables.length === 0) {
                e.preventDefault();
                dialog.focus();
                return;
            }
            const first = focusables[0];
            const last = focusables[focusables.length - 1];
            const active = document.activeElement as HTMLElement | null;
            if (e.shiftKey) {
                if (active === first || !dialog.contains(active)) {
                    e.preventDefault();
                    last.focus();
                }
            } else {
                if (active === last || !dialog.contains(active)) {
                    e.preventDefault();
                    first.focus();
                }
            }
        };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [open, onClose]);

    // Body scroll lock (refcounted so overlapping Drawers don't unlock each other)
    useEffect(() => {
        if (open) {
            if (bodyScrollLocks === 0) {
                savedBodyOverflow = document.body.style.overflow;
                document.body.style.overflow = 'hidden';
            }
            bodyScrollLocks += 1;
            return () => {
                bodyScrollLocks -= 1;
                if (bodyScrollLocks === 0) {
                    document.body.style.overflow = savedBodyOverflow;
                }
            };
        }
        return undefined;
    }, [open]);

    // Push background depth effect
    useEffect(() => {
        if (!open || !pushBackground) return;

        if (restoreTransitionRafRef.current !== null) {
            cancelAnimationFrame(restoreTransitionRafRef.current);
            restoreTransitionRafRef.current = null;
        }

        const pushed: Array<{
            el: HTMLElement;
            transform: string;
            filter: string;
            borderRadius: string;
            overflow: string;
            transition: string;
        }> = [];

        const candidates = Array.from(document.body.children).filter((el): el is HTMLElement => {
            if (!(el instanceof HTMLElement)) return false;
            const tag = el.tagName;
            if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'NOSCRIPT') return false;
            if (el.hasAttribute('data-animal-drawer-ignore')) return false;
            if (el.hasAttribute('data-animal-drawer-portal')) return false;
            return getComputedStyle(el).position !== 'fixed';
        });

        candidates.forEach((el) => {
            pushed.push({
                el,
                transform: el.style.transform,
                filter: el.style.filter,
                borderRadius: el.style.borderRadius,
                overflow: el.style.overflow,
                transition: el.style.transition,
            });
            el.style.transition =
                'transform 0.36s cubic-bezier(0.2, 0, 0.2, 1), filter 0.36s ease, border-radius 0.36s ease';
        });

        const rafId = requestAnimationFrame(() => {
            pushed.forEach(({ el }) => {
                el.style.transform = 'scale(0.94)';
                el.style.filter = 'blur(1px)';
                el.style.borderRadius = '14px';
                el.style.overflow = 'hidden';
            });
        });

        return () => {
            cancelAnimationFrame(rafId);
            if (restoreTransitionRafRef.current !== null) {
                cancelAnimationFrame(restoreTransitionRafRef.current);
                restoreTransitionRafRef.current = null;
            }
            pushed.forEach(({ el, transform, filter, borderRadius, overflow }) => {
                el.style.transform = transform;
                el.style.filter = filter;
                el.style.borderRadius = borderRadius;
                el.style.overflow = overflow;
            });
            restoreTransitionRafRef.current = requestAnimationFrame(() => {
                pushed.forEach(({ el, transition }) => {
                    el.style.transition = transition;
                });
                restoreTransitionRafRef.current = null;
            });
        };
    }, [open, pushBackground]);

    const handleMaskClick = useCallback(() => {
        if (maskClosable) onClose?.();
    }, [maskClosable, onClose]);

    const handleContentClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
    }, []);

    const idPrefix = `animal-drawer-${useId().replace(/:/g, '')}`;
    const titleId = `${idPrefix}-title`;

    const inertProps = !open ? ({ inert: '' } as Record<string, string>) : {};

    const panelClass = cn(
        'animal-drawer-panel',
        placement === 'left' && 'animal-drawer-left',
        placement === 'right' && 'animal-drawer-right',
        placement === 'top' && 'animal-drawer-top',
        placement === 'bottom' && 'animal-drawer-bottom',
        open && 'animal-drawer-panel-open',
        className
    );

    const panelStyle: React.CSSProperties = {};
    if (placement === 'left' || placement === 'right') {
        panelStyle.width = typeof width === 'number' ? `${width}px` : width;
    } else {
        panelStyle.height = typeof height === 'number' ? `${height}px` : height;
    }

    const drawerContent = (
        <div data-animal-drawer-portal="">
            <Cursor>
                <div
                    className={cn('animal-drawer-mask', open && 'animal-drawer-mask-open')}
                    style={maskStyle}
                    onClick={handleMaskClick}
                    aria-hidden={!open}
                >
                    <div
                        ref={dialogRef}
                        className={panelClass}
                        style={panelStyle}
                        onClick={handleContentClick}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby={title ? titleId : undefined}
                        aria-hidden={!open}
                        tabIndex={-1}
                        {...inertProps}
                    >
                        {title && (
                            <div className="animal-drawer-header">
                                <div className="animal-drawer-title" id={titleId}>
                                    {title}
                                </div>
                                <button
                                    type="button"
                                    className="animal-drawer-close"
                                    onClick={onClose}
                                    aria-label="关闭"
                                >
                                    ×
                                </button>
                            </div>
                        )}
                        <div className="animal-drawer-body">{children}</div>
                        {footer && <div className="animal-drawer-footer">{footer}</div>}
                    </div>
                </div>
            </Cursor>
        </div>
    );

    if (typeof document === 'undefined') return null;
    return createPortal(drawerContent, document.body);
};

Drawer.displayName = 'Drawer';
