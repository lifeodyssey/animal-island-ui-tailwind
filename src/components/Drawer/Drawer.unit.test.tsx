import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Drawer } from './Drawer';

describe('Drawer', () => {
    it('open=false: dialog is not in the accessibility tree (aria-hidden)', () => {
        render(<Drawer open={false}>content</Drawer>);
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('open=true: renders role=dialog with aria-modal via portal', () => {
        render(
            <Drawer open title="标题">
                <p data-testid="body">body content</p>
            </Drawer>
        );
        const dialog = screen.getByRole('dialog');
        expect(dialog).toBeInTheDocument();
        expect(dialog).toHaveAttribute('aria-modal', 'true');
        expect(screen.getByText('标题')).toBeInTheDocument();
        expect(screen.getByTestId('body')).toBeInTheDocument();
    });

    it('clicking mask triggers onClose (default maskClosable)', async () => {
        const user = userEvent.setup();
        const onClose = vi.fn();
        render(<Drawer open onClose={onClose}>content</Drawer>);
        const mask = screen.getByRole('dialog').parentElement!;
        await user.click(mask);
        expect(onClose).toHaveBeenCalled();
    });

    it('maskClosable=false: clicking mask does not trigger onClose', async () => {
        const user = userEvent.setup();
        const onClose = vi.fn();
        render(
            <Drawer open maskClosable={false} onClose={onClose}>
                content
            </Drawer>
        );
        const mask = screen.getByRole('dialog').parentElement!;
        await user.click(mask);
        expect(onClose).not.toHaveBeenCalled();
    });

    it('clicking drawer content does not bubble to onClose', async () => {
        const user = userEvent.setup();
        const onClose = vi.fn();
        render(
            <Drawer open onClose={onClose}>
                <p>inside</p>
            </Drawer>
        );
        await user.click(screen.getByText('inside'));
        expect(onClose).not.toHaveBeenCalled();
    });

    it('Escape key triggers onClose', async () => {
        const user = userEvent.setup();
        const onClose = vi.fn();
        render(<Drawer open onClose={onClose}>content</Drawer>);
        await user.keyboard('{Escape}');
        expect(onClose).toHaveBeenCalled();
    });

    it('renders footer when provided', () => {
        render(
            <Drawer open footer={<button>OK</button>}>
                content
            </Drawer>
        );
        expect(screen.getByRole('button', { name: 'OK' })).toBeInTheDocument();
    });

    it('panel has correct placement class for right (default)', () => {
        render(<Drawer open>content</Drawer>);
        expect(document.body.querySelector('.animal-drawer-panel-right')).toBeInTheDocument();
    });

    it('panel has correct placement class for left', () => {
        render(
            <Drawer open placement="left">
                content
            </Drawer>
        );
        expect(document.body.querySelector('.animal-drawer-panel-left')).toBeInTheDocument();
    });
});
