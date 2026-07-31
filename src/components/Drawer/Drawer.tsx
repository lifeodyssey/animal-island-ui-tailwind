import React, { useEffect, useCallback, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Cursor } from '../Cursor';

export type DrawerPlacement = 'left' | 'right' | 'top' | 'bottom';

export interface DrawerProps {
    /** Whether the drawer is visible */
    open: boolean;
    /** Side from which the drawer slides in */
    placement?: DrawerPlacement;
    /** Drawer width (left/right placements) */
    width?: number | string;
    /** Drawer height (top/bottom placements) */
    height?: number | string;
    /** Drawer title */
    title?: React.ReactNode;
    /** Drawer footer */
    footer?: React.ReactNode;
    /** Close callback */
    onClose?: () => void;
    /** Whether clicking the mask closes the drawer */
    maskClosable?: boolean;
    /** Extra class name for the panel */
    className?: string;
    children?: React.ReactNode;
}

const FOCUSABLE_SELECTOR = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
].join(',');

function getFocusable(container: HTMLElement): HTMLElement[] {
    return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
}

export const Drawer: React.FC<DrawerProps> = ({
    open,
    placement = 'right',
    width = 378,
    height = 378,
    title,
    footer,
    onClose,
    maskClosable = true,
    className,
    children,
}) => {
    const panelRef = useRef<HTMLDivElement>(null);
    const id = useId();

    // Auto-focus first focusable element when drawer opens
    useEffect(() => {
        if (!open || !panelRef.current) return;
        const focusables = getFocusable(panelRef.current);
        if (focusables.length > 0) {
            focusables[0].focus();
        } else {
            panelRef.current.focus();
        }
    }, [open]);

    // ESC to close + Tab focus trap
    useEffect(() => {
        if (!open) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose?.();
                return;
            }
            if (e.key === 'Tab' && panelRef.current) {
                const focusables = getFocusable(panelRef.current);
                if (focusables.length === 0) {
                    e.preventDefault();
                    return;
                }
                const first = focusables[0];
                const last = focusables[focusables.length - 1];
                if (e.shiftKey) {
                    if (document.activeElement === first) {
                        e.preventDefault();
                        last.focus();
                    }
                } else {
                    if (document.activeElement === last) {
                        e.preventDefault();
                        first.focus();
                    }
                }
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [open, onClose]);

    // Scroll lock
    useEffect(() => {
        if (!open) return;
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = prevOverflow;
        };
    }, [open]);

    // Push background transform (subtle depth parallax)
    useEffect(() => {
        if (!open) return;
        const target = document.body;
        const prevTransition = target.style.transition;
        const prevTransform = target.style.transform;

        const offset = '30px';
        let transform = '';
        if (placement === 'right') transform = `translateX(-${offset})`;
        else if (placement === 'left') transform = `translateX(${offset})`;
        else if (placement === 'bottom') transform = `translateY(-${offset})`;
        else transform = `translateY(${offset})`;

        target.style.transition = 'transform 0.3s ease';
        target.style.transform = transform;

        return () => {
            target.style.transition = prevTransition;
            target.style.transform = prevTransform;
        };
    }, [open, placement]);

    const handleMaskClick = useCallback(() => {
        if (maskClosable) onClose?.();
    }, [maskClosable, onClose]);

    const handleContentClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
    }, []);

    const inertProps = open ? {} : { inert: '' };

    const maskClass = ['animal-drawer-mask', open && 'animal-drawer-mask-open']
        .filter(Boolean)
        .join(' ');

    const panelClass = [
        'animal-drawer-panel',
        placement === 'left' && 'animal-drawer-panel-left',
        placement === 'right' && 'animal-drawer-panel-right',
        placement === 'top' && 'animal-drawer-panel-top',
        placement === 'bottom' && 'animal-drawer-panel-bottom',
        open && 'animal-drawer-panel-open',
        className,
    ].filter(Boolean).join(' ');

    const panelStyle: React.CSSProperties =
        placement === 'left' || placement === 'right'
            ? { width }
            : { height };

    return createPortal(
        <Cursor>
            <div
                className={maskClass}
                onClick={handleMaskClick}
                aria-hidden={!open}
            >
                <div
                    ref={panelRef}
                    id={id}
                    className={panelClass}
                    style={panelStyle}
                    role="dialog"
                    aria-modal="true"
                    tabIndex={-1}
                    onClick={handleContentClick}
                    {...(inertProps as React.HTMLAttributes<HTMLDivElement>)}
                >
                    <div className="animal-drawer-header">
                        <span className="animal-drawer-title">{title}</span>
                        <button
                            className="animal-drawer-close"
                            type="button"
                            aria-label="Close drawer"
                            onClick={onClose}
                        >
                            ✕
                        </button>
                    </div>
                    <div className="animal-drawer-body">{children}</div>
                    {footer !== undefined && (
                        <div className="animal-drawer-footer">{footer}</div>
                    )}
                </div>
            </div>
        </Cursor>,
        document.body
    );
};

Drawer.displayName = 'Drawer';
