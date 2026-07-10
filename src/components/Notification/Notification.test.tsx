import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { screen, waitFor, act, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Notification, notificationDestroy } from './NotificationPortal';

const wait = (ms = 0) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const getContainer = (): HTMLElement | null => document.querySelector('[data-animal-notification-root]');

const waitForContainer = async (): Promise<HTMLElement> => {
    return waitFor(() => {
        const el = getContainer();
        if (!el) throw new Error('notification root not mounted yet');
        return el;
    });
};

const waitForGone = async (text: string): Promise<void> => {
    await waitFor(
        () => {
            expect(screen.queryByText(text)).not.toBeInTheDocument();
        },
        { timeout: 2000 }
    );
};

describe('Notification', () => {
    beforeEach(async () => {
        notificationDestroy();
        await wait();
        await wait(300);
    });

    afterEach(async () => {
        notificationDestroy();
        await wait(300);
    });

    describe('静态方法挂载与渲染', () => {
        it('首次 open 后在 body 创建通知根容器', async () => {
            expect(getContainer()).toBeNull();
            act(() => {
                Notification.info('hello');
            });
            const root = await waitForContainer();
            expect(root).not.toBeNull();
            await waitFor(() => {
                expect(screen.getByText('hello')).toBeInTheDocument();
            });
        });

        it('字符串简写会作为 message 渲染', async () => {
            act(() => {
                Notification.success('简写消息');
            });
            await waitForContainer();
            await waitFor(() => {
                expect(screen.getByText('简写消息')).toBeInTheDocument();
            });
        });

        it('对象 config 渲染 message + description', async () => {
            act(() => {
                Notification.info({ message: '标题', description: '详细描述内容' });
            });
            await waitForContainer();
            await waitFor(() => {
                expect(screen.getByText('标题')).toBeInTheDocument();
                expect(screen.getByText('详细描述内容')).toBeInTheDocument();
            });
        });

        it('不同 type 应用对应 class', async () => {
            act(() => {
                Notification.success('s');
                Notification.error('e');
                Notification.warning('w');
                Notification.info('i');
            });
            await waitForContainer();
            await waitFor(() => {
                const root = getContainer()!;
                const items = root.querySelectorAll('.animal-notification');
                expect(items.length).toBe(4);
                expect(items[0].className).toContain('animal-notification-type-success');
                expect(items[1].className).toContain('animal-notification-type-error');
                expect(items[2].className).toContain('animal-notification-type-warning');
                expect(items[3].className).toContain('animal-notification-type-info');
            });
        });
    });

    describe('位置分组', () => {
        it('position=top 默认时通知挂到 top 组', async () => {
            act(() => {
                Notification.info({ message: 'top' });
            });
            await waitForContainer();
            await waitFor(() => {
                const topGroup = document.querySelector('.animal-notification-position-top');
                expect(topGroup).not.toBeNull();
                expect(topGroup).toHaveAttribute('data-position', 'top');
            });
        });

        it('position=topRight 走 topRight 组', async () => {
            act(() => {
                Notification.info({ message: 'right', position: 'topRight' });
            });
            await waitForContainer();
            await waitFor(() => {
                const group = document.querySelector('.animal-notification-position-topRight');
                expect(group).not.toBeNull();
            });
        });

        it('position=bottom 走 bottom 组,placement=bottom', async () => {
            act(() => {
                Notification.info({ message: 'b', position: 'bottom' });
            });
            await waitForContainer();
            await waitFor(() => {
                const group = document.querySelector('.animal-notification-position-bottom');
                expect(group).not.toBeNull();
                const card = group!.querySelector('.animal-notification') as HTMLElement;
                expect(card.className).toContain('animal-notification-placement-bottom');
            });
        });
    });

    describe('关闭行为', () => {
        it('点击关闭按钮触发退场后从 DOM 移除', async () => {
            const user = userEvent.setup();
            act(() => {
                Notification.info({ message: 'close me' });
            });
            await waitForContainer();
            const closeBtn = await screen.findByLabelText('close');
            await user.click(closeBtn);
            await waitForGone('close me');
        });

        it('duration 较短时自动关闭并触发 onClose', async () => {
            const onClose = vi.fn();
            act(() => {
                Notification.info({ message: 'auto', duration: 0.5, onClose });
            });
            await waitForContainer();
            await waitFor(() => {
                expect(screen.getByText('auto')).toBeInTheDocument();
            });
            await waitForGone('auto');
            expect(onClose).toHaveBeenCalled();
        }, 3000);

        it('destroy() 关闭全部', async () => {
            act(() => {
                Notification.info('a');
                Notification.success('b');
            });
            await waitForContainer();
            await waitFor(() => {
                expect(screen.getByText('a')).toBeInTheDocument();
                expect(screen.getByText('b')).toBeInTheDocument();
            });
            act(() => {
                notificationDestroy();
            });
            await waitForGone('a');
            await waitForGone('b');
        });

        it('destroy(key) 只关闭指定 key', async () => {
            act(() => {
                Notification.info({ message: 'keep', key: 'k1' });
                Notification.info({ message: 'remove', key: 'k2' });
            });
            await waitForContainer();
            await waitFor(() => {
                expect(screen.getByText('keep')).toBeInTheDocument();
                expect(screen.getByText('remove')).toBeInTheDocument();
            });
            act(() => {
                notificationDestroy('k2');
            });
            await waitForGone('remove');
            expect(screen.getByText('keep')).toBeInTheDocument();
        });

        it('destroy() 同步触发被移除项的 onClose', async () => {
            const onCloseA = vi.fn();
            const onCloseB = vi.fn();
            act(() => {
                Notification.info({ message: 'a', onClose: onCloseA });
                Notification.success({ message: 'b', onClose: onCloseB });
            });
            await waitForContainer();
            await waitFor(() => {
                expect(screen.getByText('a')).toBeInTheDocument();
                expect(screen.getByText('b')).toBeInTheDocument();
            });
            act(() => {
                notificationDestroy();
            });
            expect(onCloseA).toHaveBeenCalledTimes(1);
            expect(onCloseB).toHaveBeenCalledTimes(1);
        });

        it('destroy(key) 同步触发该项的 onClose,其它 key 不触发', async () => {
            const onCloseK1 = vi.fn();
            const onCloseK2 = vi.fn();
            act(() => {
                Notification.info({ message: 'k1 msg', key: 'k1', onClose: onCloseK1 });
                Notification.info({ message: 'k2 msg', key: 'k2', onClose: onCloseK2 });
            });
            await waitForContainer();
            act(() => {
                notificationDestroy('k2');
            });
            expect(onCloseK2).toHaveBeenCalledTimes(1);
            expect(onCloseK1).not.toHaveBeenCalled();
        });

        it('upload 场景:destroy 后同 key 后续 open 也不再创建', async () => {
            const uploadKey = 'upload-destroy';
            let dismissed = false;
            const onCloseMock = vi.fn(() => {
                dismissed = true;
            });
            const open = (msg: string) => {
                if (dismissed) return;
                Notification.info({
                    message: msg,
                    key: uploadKey,
                    duration: 0,
                    onClose: onCloseMock,
                });
            };

            act(() => {
                open('上传中 0%');
            });
            await waitForContainer();
            await waitFor(() => {
                expect(screen.getByText('上传中 0%')).toBeInTheDocument();
            });

            act(() => {
                notificationDestroy();
            });
            expect(onCloseMock).toHaveBeenCalledTimes(1);
            expect(dismissed).toBe(true);
            await waitForGone('上传中 0%');

            act(() => {
                open('上传中 50%');
                open('上传完成 100%');
            });
            await wait(400);
            expect(screen.queryByText('上传中 50%')).not.toBeInTheDocument();
            expect(screen.queryByText('上传完成 100%')).not.toBeInTheDocument();
        });
    });

    describe('onClick 与可点击态', () => {
        it('配置 onClick 后,通知本体可点击触发回调', async () => {
            const user = userEvent.setup();
            const onClick = vi.fn();
            act(() => {
                Notification.info({ message: 'click me', onClick });
            });
            await waitForContainer();
            const card = await screen.findByText('click me');
            await user.click(card);
            expect(onClick).toHaveBeenCalled();
        });

        it('onClick 设置后获得 role=button 与 tabIndex=0', async () => {
            act(() => {
                Notification.info({ message: 'kb', onClick: () => {} });
            });
            await waitForContainer();
            const card = (await screen.findByText('kb')).closest('.animal-notification') as HTMLElement;
            expect(card).toHaveAttribute('role', 'button');
            expect(card).toHaveAttribute('tabindex', '0');
        });

        it('键盘 Enter 触发 onClick', async () => {
            const user = userEvent.setup();
            const onClick = vi.fn();
            act(() => {
                Notification.info({ message: 'kb', onClick });
            });
            await waitForContainer();
            const card = (await screen.findByText('kb')).closest('.animal-notification') as HTMLElement;
            card.focus();
            await user.keyboard('{Enter}');
            expect(onClick).toHaveBeenCalled();
        });
    });

    describe('key 更新', () => {
        it('同 key 二次 open 走更新分支(仍只 1 条)', async () => {
            act(() => {
                Notification.info({ message: 'first', key: 'same' });
            });
            await waitForContainer();
            await waitFor(() => {
                expect(screen.getByText('first')).toBeInTheDocument();
            });
            act(() => {
                Notification.info({ message: 'second', key: 'same' });
            });
            await waitFor(() => {
                const root = getContainer()!;
                const items = root.querySelectorAll('.animal-notification');
                expect(items.length).toBe(1);
                expect(screen.getByText('second')).toBeInTheDocument();
                expect(screen.queryByText('first')).not.toBeInTheDocument();
            });
        });

        it('race: closeIcon onClick 立即置 dismissed', async () => {
            const user = userEvent.setup();
            const uploadKey = 'upload-race';
            let dismissed = false;
            const markDismissed = () => {
                dismissed = true;
            };
            const open = (msg: string) => {
                if (dismissed) return;
                Notification.info({
                    message: msg,
                    key: uploadKey,
                    duration: 0,
                    closeIcon: <span onClick={markDismissed}>×</span>,
                    onClose: () => {
                        dismissed = true;
                    },
                });
            };

            act(() => {
                open('race-0');
            });
            await waitForContainer();
            await waitFor(() => {
                expect(screen.getByText('race-0')).toBeInTheDocument();
            });

            const closeBtn = screen.getByLabelText('close');
            const closeIcon = within(closeBtn).getByText('×');
            await user.click(closeIcon);

            act(() => {
                open('race-50');
                open('race-100');
            });
            expect(screen.queryByText('race-50')).not.toBeInTheDocument();
            expect(screen.queryByText('race-100')).not.toBeInTheDocument();
            await waitForGone('race-0');
            expect(screen.queryByText('race-50')).not.toBeInTheDocument();
            expect(screen.queryByText('race-100')).not.toBeInTheDocument();
        });
    });

    describe('btn slot', () => {
        it('配置 btn 后渲染自定义操作按钮', async () => {
            act(() => {
                Notification.info({
                    message: 'with action',
                    btn: <button data-testid="custom-btn">Action</button>,
                });
            });
            await waitForContainer();
            await waitFor(() => {
                expect(screen.getByTestId('custom-btn')).toBeInTheDocument();
            });
        });
    });
});
