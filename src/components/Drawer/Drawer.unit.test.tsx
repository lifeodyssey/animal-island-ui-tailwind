import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Drawer } from './Drawer';

describe('Drawer', () => {
    it('open=false 时面板不可见（aria-hidden）', () => {
        render(<Drawer open={false}>content</Drawer>);
        const panel = document.querySelector('.animal-drawer-panel');
        expect(panel).toHaveAttribute('aria-hidden', 'true');
    });

    it('open=true 时渲染 role=dialog', () => {
        render(<Drawer open>content</Drawer>);
        expect(screen.getByRole('dialog', { hidden: true })).toBeInTheDocument();
    });

    it('渲染 title', () => {
        render(<Drawer open title="Test Title">content</Drawer>);
        expect(screen.getByText('Test Title')).toBeInTheDocument();
    });

    it('渲染 children', () => {
        render(<Drawer open><span data-testid="c">body</span></Drawer>);
        expect(screen.getByTestId('c')).toBeInTheDocument();
    });

    it('渲染 footer', () => {
        render(<Drawer open footer={<button>ok</button>}>content</Drawer>);
        expect(screen.getByRole('button', { name: 'ok' })).toBeInTheDocument();
    });

    it('点击关闭按钮触发 onClose', () => {
        const onClose = vi.fn();
        render(<Drawer open title="T" onClose={onClose}>content</Drawer>);
        fireEvent.click(screen.getByRole('button', { name: '关闭' }));
        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('默认 placement=right 添加 animal-drawer-panel-right 类', () => {
        render(<Drawer open>content</Drawer>);
        const panel = document.querySelector('.animal-drawer-panel');
        expect(panel).toHaveClass('animal-drawer-panel-right');
    });

    it('placement=left 添加 animal-drawer-panel-left 类', () => {
        render(<Drawer open placement="left">content</Drawer>);
        expect(document.querySelector('.animal-drawer-panel')).toHaveClass('animal-drawer-panel-left');
    });

    it('ESC 键触发 onClose', () => {
        const onClose = vi.fn();
        render(<Drawer open onClose={onClose}>content</Drawer>);
        fireEvent.keyDown(document, { key: 'Escape' });
        expect(onClose).toHaveBeenCalledTimes(1);
    });
});
