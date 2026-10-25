import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, render, screen } from '@testing-library/react';
import { Drawer } from './Drawer';

describe('Drawer focus lifecycle', () => {
    let trigger: HTMLButtonElement;

    beforeEach(() => {
        vi.useFakeTimers();
        trigger = document.createElement('button');
        trigger.textContent = 'Open drawer';
        document.body.append(trigger);
        trigger.focus();
    });

    afterEach(() => {
        cleanup();
        trigger.remove();
        vi.useRealTimers();
    });

    it('defers focus until the opening transition has started', () => {
        render(<Drawer open title="Settings" pushBackground={false} />);
        expect(trigger).toHaveFocus();
        act(() => vi.advanceTimersByTime(0));
        expect(screen.getByRole('button', { name: '关闭' })).toHaveFocus();
    });

    it('restores the trigger when an open drawer unmounts', () => {
        const { unmount } = render(<Drawer open title="Settings" pushBackground={false} />);
        act(() => vi.advanceTimersByTime(0));
        expect(screen.getByRole('button', { name: '关闭' })).toHaveFocus();
        unmount();
        expect(trigger).toHaveFocus();
    });

    it('cancels pending entry focus when closed immediately', () => {
        const { rerender } = render(<Drawer open title="Settings" pushBackground={false} />);
        rerender(<Drawer open={false} title="Settings" pushBackground={false} />);
        act(() => vi.advanceTimersByTime(0));
        expect(trigger).toHaveFocus();
    });

    it('cancels pending entry focus when unmounted immediately', () => {
        const { unmount } = render(<Drawer open title="Settings" pushBackground={false} />);
        unmount();
        act(() => vi.advanceTimersByTime(0));
        expect(trigger).toHaveFocus();
    });

    it('focuses the dialog itself when it has no interactive children', () => {
        render(<Drawer open pushBackground={false}>Details</Drawer>);
        act(() => vi.advanceTimersByTime(0));
        expect(screen.getByRole('dialog')).toHaveFocus();
    });
});
