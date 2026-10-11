import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { Modal } from './Modal';

afterEach(cleanup);

describe('Modal variants', () => {
    it('defaults to the game frame and retains the explicit default frame', () => {
        const { rerender } = render(<Modal open title="Island" typewriter={false}>Welcome</Modal>);
        expect(screen.getByRole('dialog').querySelector('.animal-modal-clipped-game')).not.toBeNull();
        rerender(<Modal open variant="default" title="Island" typewriter={false}>Welcome</Modal>);
        expect(screen.getByRole('dialog').querySelector('.animal-modal-clipped-game')).toBeNull();
    });

    it('preserves Escape dismissal for the new default frame', () => {
        const onClose = vi.fn();
        render(<Modal open title="Island" typewriter={false} onClose={onClose}>Welcome</Modal>);
        fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
        expect(onClose).toHaveBeenCalledOnce();
    });
});
