import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, cleanup, act, fireEvent } from '@testing-library/react';
import { Drawer } from './Drawer';

afterEach(cleanup);

/**
 * Drawer guardrail. Stable `animal-drawer*` class names replace upstream
 * Less-module hashes. Portal renders into document.body.
 */
describe('Drawer', () => {
    it('open=false 时面板不带 animal-drawer-panel-open 类', () => {
        render(<Drawer open={false} onClose={vi.fn()}>x</Drawer>);
        const panel = document.querySelector('.animal-drawer-panel');
        expect(panel?.classList.contains('animal-drawer-panel-open')).toBe(false);
    });

    it('open=true 时面板带 animal-drawer-panel-open 类', () => {
        render(<Drawer open onClose={vi.fn()}>x</Drawer>);
        const panel = document.querySelector('.animal-drawer-panel');
        expect(panel?.classList.contains('animal-drawer-panel-open')).toBe(true);
    });

    it('placement=left 添加 animal-drawer-panel-left', () => {
        render(<Drawer open placement="left" onClose={vi.fn()}>x</Drawer>);
        const panel = document.querySelector('.animal-drawer-panel');
        expect(panel?.classList.contains('animal-drawer-panel-left')).toBe(true);
    });

    it('placement=right 添加 animal-drawer-panel-right', () => {
        render(<Drawer open placement="right" onClose={vi.fn()}>x</Drawer>);
        const panel = document.querySelector('.animal-drawer-panel');
        expect(panel?.classList.contains('animal-drawer-panel-right')).toBe(true);
    });

    it('placement=top 添加 animal-drawer-panel-top', () => {
        render(<Drawer open placement="top" onClose={vi.fn()}>x</Drawer>);
        const panel = document.querySelector('.animal-drawer-panel');
        expect(panel?.classList.contains('animal-drawer-panel-top')).toBe(true);
    });

    it('placement=bottom 添加 animal-drawer-panel-bottom', () => {
        render(<Drawer open placement="bottom" onClose={vi.fn()}>x</Drawer>);
        const panel = document.querySelector('.animal-drawer-panel');
        expect(panel?.classList.contains('animal-drawer-panel-bottom')).toBe(true);
    });

    it('title 渲染到 animal-drawer-title', () => {
        render(<Drawer open title="抽屉标题" onClose={vi.fn()}>x</Drawer>);
        expect(document.querySelector('.animal-drawer-title')?.textContent).toBe('抽屉标题');
    });

    it('无 title 时不渲染 animal-drawer-header', () => {
        render(<Drawer open onClose={vi.fn()}>x</Drawer>);
        expect(document.querySelector('.animal-drawer-header')).toBeNull();
    });

    it('children 渲染到 animal-drawer-body', () => {
        render(<Drawer open onClose={vi.fn()}><span id="test-child">内容</span></Drawer>);
        expect(document.querySelector('.animal-drawer-body #test-child')).not.toBeNull();
    });

    it('footer 渲染到 animal-drawer-footer', () => {
        render(<Drawer open footer={<button>确定</button>} onClose={vi.fn()}>x</Drawer>);
        expect(document.querySelector('.animal-drawer-footer')).not.toBeNull();
    });

    it('maskClosable=true 点击 mask 触发 onClose', async () => {
        const onClose = vi.fn();
        render(<Drawer open maskClosable onClose={onClose}>x</Drawer>);
        const mask = document.querySelector('.animal-drawer-mask') as HTMLElement;
        await act(async () => { fireEvent.click(mask); });
        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('maskClosable=false 点击 mask 不触发 onClose', async () => {
        const onClose = vi.fn();
        render(<Drawer open maskClosable={false} onClose={onClose}>x</Drawer>);
        const mask = document.querySelector('.animal-drawer-mask') as HTMLElement;
        await act(async () => { fireEvent.click(mask); });
        expect(onClose).not.toHaveBeenCalled();
    });

    it('ESC 键触发 onClose', async () => {
        const onClose = vi.fn();
        render(<Drawer open onClose={onClose}>x</Drawer>);
        await act(async () => {
            fireEvent.keyDown(document, { key: 'Escape' });
        });
        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('面板有 role=dialog 和 aria-modal=true', () => {
        render(<Drawer open onClose={vi.fn()}>x</Drawer>);
        const panel = document.querySelector('.animal-drawer-panel');
        expect(panel?.getAttribute('role')).toBe('dialog');
        expect(panel?.getAttribute('aria-modal')).toBe('true');
    });

    it('open=false 时面板带 inert 属性', () => {
        render(<Drawer open={false} onClose={vi.fn()}>x</Drawer>);
        const panel = document.querySelector('.animal-drawer-panel');
        expect(panel?.hasAttribute('inert')).toBe(true);
    });
});
