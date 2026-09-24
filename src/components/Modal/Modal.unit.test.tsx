import { afterEach, describe, it, expect, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Modal } from './Modal';

afterEach(cleanup);

describe('Modal variant default', () => {
    it('默认（不传 variant）应用异形外框类', () => {
        render(
            <Modal open typewriter={false}>
                content
            </Modal>
        );
        const dialog = screen.getByRole('dialog');
        expect(dialog.querySelector('.animal-modal-clipped-game')).not.toBeNull();
    });

    it('variant="default" 使用常规圆角矩形，无 game 变体类', () => {
        render(
            <Modal open variant="default" typewriter={false}>
                content
            </Modal>
        );
        const dialog = screen.getByRole('dialog');
        expect(dialog.querySelector('.animal-modal-clipped-game')).toBeNull();
    });

    it('variant="game" 应用异形外框类', () => {
        render(
            <Modal open variant="game" typewriter={false}>
                content
            </Modal>
        );
        const dialog = screen.getByRole('dialog');
        expect(dialog.querySelector('.animal-modal-clipped-game')).not.toBeNull();
    });

    it('open=false 不渲染', () => {
        render(<Modal open={false}>content</Modal>);
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('width 应用到 dialog 节点', () => {
        render(
            <Modal open width={400} typewriter={false}>
                body
            </Modal>
        );
        expect(screen.getByRole('dialog')).toHaveStyle({ width: '400px' });
    });

    it('footer={null} 不渲染默认按钮', () => {
        const { baseElement } = render(
            <Modal open footer={null} typewriter={false}>
                body
            </Modal>
        );
        expect(baseElement.querySelector('.animal-modal-footer')).toBeNull();
    });

    it('Esc 触发 onClose', async () => {
        const user = userEvent.setup();
        const onClose = vi.fn();
        render(
            <Modal open onClose={onClose} typewriter={false}>
                content
            </Modal>
        );
        await user.keyboard('{Escape}');
        expect(onClose).toHaveBeenCalled();
    });
});
