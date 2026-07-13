import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { Drawer } from './Drawer';

describe('Drawer', () => {
    it('open=false 时 dialog 不在无障碍树（aria-hidden=true）', () => {
        render(<Drawer open={false}>content</Drawer>);
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('open=true 通过 portal 渲染到 body 且包含 role="dialog" + aria-modal', () => {
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

    it('点击遮罩触发 onClose（默认 maskClosable）', async () => {
        const user = userEvent.setup();
        const onClose = vi.fn();
        const { container } = render(<Drawer open onClose={onClose}>content</Drawer>);
        const mask = container.ownerDocument.querySelector('.animal-drawer-mask') as HTMLElement;
        expect(mask).not.toBeNull();
        await user.click(mask);
        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('maskClosable=false 时点击遮罩不触发 onClose', async () => {
        const user = userEvent.setup();
        const onClose = vi.fn();
        render(<Drawer open maskClosable={false} onClose={onClose}>content</Drawer>);
        const mask = document.querySelector('.animal-drawer-mask') as HTMLElement;
        await user.click(mask);
        expect(onClose).not.toHaveBeenCalled();
    });

    it('点击抽屉内容不冒泡触发 onClose', async () => {
        const user = userEvent.setup();
        const onClose = vi.fn();
        render(
            <Drawer open onClose={onClose}>
                <button>inner button</button>
            </Drawer>
        );
        await user.click(screen.getByText('inner button'));
        expect(onClose).not.toHaveBeenCalled();
    });

    it('Esc 触发 onClose', async () => {
        const user = userEvent.setup();
        const onClose = vi.fn();
        render(<Drawer open onClose={onClose}>content</Drawer>);
        await user.keyboard('{Escape}');
        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('placement=left 应用 animal-drawer-panel-left', () => {
        render(<Drawer open placement="left">content</Drawer>);
        const dialog = screen.getByRole('dialog');
        expect(dialog.className).toContain('animal-drawer-panel-left');
    });

    it('placement=right 应用 animal-drawer-panel-right (default)', () => {
        render(<Drawer open>content</Drawer>);
        const dialog = screen.getByRole('dialog');
        expect(dialog.className).toContain('animal-drawer-panel-right');
    });

    it('placement=top 应用 animal-drawer-panel-top', () => {
        render(<Drawer open placement="top">content</Drawer>);
        const dialog = screen.getByRole('dialog');
        expect(dialog.className).toContain('animal-drawer-panel-top');
    });

    it('placement=bottom 应用 animal-drawer-panel-bottom', () => {
        render(<Drawer open placement="bottom">content</Drawer>);
        const dialog = screen.getByRole('dialog');
        expect(dialog.className).toContain('animal-drawer-panel-bottom');
    });

    it('open=true 时 panel 有 animal-drawer-panel-open', () => {
        render(<Drawer open>content</Drawer>);
        const dialog = screen.getByRole('dialog');
        expect(dialog.className).toContain('animal-drawer-panel-open');
    });

    it('width 应用到面板内联样式（right placement）', () => {
        render(<Drawer open width={500}>content</Drawer>);
        const dialog = screen.getByRole('dialog');
        expect(dialog.style.width).toBe('500px');
    });

    it('height 应用到面板内联样式（bottom placement）', () => {
        render(<Drawer open placement="bottom" height={400}>content</Drawer>);
        const dialog = screen.getByRole('dialog');
        expect(dialog.style.height).toBe('400px');
    });

    it('footer 传入时渲染', () => {
        render(
            <Drawer open footer={<button data-testid="footer-btn">OK</button>}>
                content
            </Drawer>
        );
        expect(screen.getByTestId('footer-btn')).toBeInTheDocument();
        expect(document.querySelector('.animal-drawer-footer')).toBeInTheDocument();
    });

    it('默认不渲染 footer', () => {
        render(<Drawer open>content</Drawer>);
        expect(document.querySelector('.animal-drawer-footer')).not.toBeInTheDocument();
    });

    it('自定义 className 追加到 panel', () => {
        render(<Drawer open className="my-drawer">content</Drawer>);
        const dialog = screen.getByRole('dialog');
        expect(dialog.className).toContain('my-drawer');
    });

    describe('a11y', () => {
        it('title 存在时 aria-labelledby 关联 title id', () => {
            render(<Drawer open title="我的抽屉">content</Drawer>);
            const dialog = screen.getByRole('dialog');
            const labelledBy = dialog.getAttribute('aria-labelledby');
            expect(labelledBy).toBeTruthy();
            const titleEl = document.getElementById(labelledBy!);
            expect(titleEl).not.toBeNull();
            expect(titleEl!.textContent).toBe('我的抽屉');
        });

        it('无 title 时 aria-labelledby 缺省', () => {
            render(<Drawer open>content</Drawer>);
            const dialog = screen.getByRole('dialog');
            expect(dialog).not.toHaveAttribute('aria-labelledby');
        });

        it('关闭按钮 aria-label="关闭" 且点击触发 onClose', async () => {
            const user = userEvent.setup();
            const onClose = vi.fn();
            render(<Drawer open title="标题" onClose={onClose}>content</Drawer>);
            const closeBtn = screen.getByLabelText('关闭');
            expect(closeBtn).toBeInTheDocument();
            await user.click(closeBtn);
            expect(onClose).toHaveBeenCalledTimes(1);
        });

        it('打开时焦点送进抽屉（落到第一个可聚焦元素）', async () => {
            render(
                <Drawer open>
                    <button data-testid="first-btn">First</button>
                </Drawer>
            );
            await waitFor(() => {
                expect(document.activeElement).toBe(screen.getByTestId('first-btn'));
            });
        });

        it('关闭时焦点归还触发元素', async () => {
            const user = userEvent.setup();
            const Controlled = () => {
                const [open, setOpen] = useState(false);
                return (
                    <>
                        <button data-testid="trigger" onClick={() => setOpen(true)}>Open</button>
                        <Drawer open={open} onClose={() => setOpen(false)}>
                            <button data-testid="inner">Inner</button>
                        </Drawer>
                    </>
                );
            };
            render(<Controlled />);
            await user.click(screen.getByTestId('trigger'));
            await waitFor(() => {
                expect(screen.getByRole('dialog')).toBeInTheDocument();
            });
            await user.keyboard('{Escape}');
            await waitFor(() => {
                expect(document.activeElement).toBe(screen.getByTestId('trigger'));
            });
        });
    });
});
