import { describe, it, expect, vi, afterEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { within, act, waitFor, screen } from '@testing-library/react';
import { Notification, notificationDestroy } from './NotificationPortal';

/**
 * Notification unit tests. Source of truth: upstream guokaigdg/animal-island-ui
 * Notification.test.tsx. Behavior ported verbatim; the only fork adaptation is
 * stable `animal-*` class names (upstream keyed off CSS-module hashes).
 *
 * The component renders via a module-level ReactDOM portal, so assertions use
 * document.querySelector directly rather than screen.* (which only sees within
 * the RTL render container).
 *
 * jsdom + RTL — runs under the `unit` vitest project.
 */

// Suppress `within` / `screen` / `userEvent` unused-import warnings; they are
// part of the declared upstream import surface and used in several tests below.
void within;
void screen;
void userEvent;

afterEach(async () => {
    await act(async () => {
        notificationDestroy();
    });
    vi.useRealTimers();
});

describe('Notification', () => {
    // ─── 静态方法挂载与渲染 ────────────────────────────────────────────────────

    describe('静态方法挂载与渲染', () => {
        it('Notification.open 将 animal-notification-root 挂载到 body', async () => {
            await act(async () => {
                Notification.open({ message: '测试', type: 'info', duration: 0 });
            });
            await waitFor(() => {
                expect(document.querySelector('.animal-notification-root')).not.toBeNull();
            });
        });

        it('渲染出 animal-notification 元素', async () => {
            await act(async () => {
                Notification.open({ message: '测试', type: 'info', duration: 0 });
            });
            await waitFor(() => {
                expect(document.querySelectorAll('.animal-notification').length).toBeGreaterThan(0);
            });
        });

        it('type=success 附加 animal-notification-success 类', async () => {
            await act(async () => {
                Notification.open({ message: '成功', type: 'success', duration: 0 });
            });
            await waitFor(() => {
                expect(document.querySelector('.animal-notification-success')).not.toBeNull();
            });
        });

        it('type=error 附加 animal-notification-error 类', async () => {
            await act(async () => {
                Notification.open({ message: '错误', type: 'error', duration: 0 });
            });
            await waitFor(() => {
                expect(document.querySelector('.animal-notification-error')).not.toBeNull();
            });
        });

        it('type=warning 附加 animal-notification-warning 类', async () => {
            await act(async () => {
                Notification.open({ message: '警告', type: 'warning', duration: 0 });
            });
            await waitFor(() => {
                expect(document.querySelector('.animal-notification-warning')).not.toBeNull();
            });
        });

        it('type=info 附加 animal-notification-info 类', async () => {
            await act(async () => {
                Notification.open({ message: '信息', type: 'info', duration: 0 });
            });
            await waitFor(() => {
                expect(document.querySelector('.animal-notification-info')).not.toBeNull();
            });
        });

        it('message 内容渲染到 animal-notification-title', async () => {
            await act(async () => {
                Notification.open({ message: '这是消息内容', type: 'info', duration: 0 });
            });
            await waitFor(() => {
                const title = document.querySelector('.animal-notification-title');
                expect(title?.textContent).toBe('这是消息内容');
            });
        });

        it('description 内容渲染到 animal-notification-desc', async () => {
            await act(async () => {
                Notification.open({
                    message: '标题',
                    description: '描述文字',
                    type: 'info',
                    duration: 0,
                });
            });
            await waitFor(() => {
                expect(document.querySelector('.animal-notification-desc')?.textContent).toBe('描述文字');
            });
        });

        it('无 description 时不渲染 animal-notification-desc', async () => {
            await act(async () => {
                Notification.open({ message: '无描述', type: 'info', duration: 0 });
            });
            await waitFor(() => {
                expect(document.querySelector('.animal-notification')).not.toBeNull();
            });
            expect(document.querySelector('.animal-notification-desc')).toBeNull();
        });
    });

    // ─── 位置分组 ─────────────────────────────────────────────────────────────

    describe('位置分组', () => {
        it('默认 position=topRight 渲染 animal-notification-position-topRight 容器', async () => {
            await act(async () => {
                Notification.open({ message: '消息', duration: 0 });
            });
            await waitFor(() => {
                expect(document.querySelector('.animal-notification-position-topRight')).not.toBeNull();
            });
        });

        it('position=top 渲染 animal-notification-position-top 容器', async () => {
            await act(async () => {
                Notification.open({ message: '消息', position: 'top', duration: 0 });
            });
            await waitFor(() => {
                expect(document.querySelector('.animal-notification-position-top')).not.toBeNull();
            });
        });

        it('position=topRight 渲染 animal-notification-position-topRight 容器', async () => {
            await act(async () => {
                Notification.open({ message: '消息', position: 'topRight', duration: 0 });
            });
            await waitFor(() => {
                expect(document.querySelector('.animal-notification-position-topRight')).not.toBeNull();
            });
        });

        it('position=bottom 渲染 animal-notification-position-bottom 容器', async () => {
            await act(async () => {
                Notification.open({ message: '消息', position: 'bottom', duration: 0 });
            });
            await waitFor(() => {
                expect(document.querySelector('.animal-notification-position-bottom')).not.toBeNull();
            });
        });

        it('top 系列 position 通知附加 animal-notification-placement-top 类', async () => {
            await act(async () => {
                Notification.open({ message: '消息', position: 'topRight', duration: 0 });
            });
            await waitFor(() => {
                expect(document.querySelector('.animal-notification-placement-top')).not.toBeNull();
            });
        });

        it('bottom 系列 position 通知附加 animal-notification-placement-bottom 类', async () => {
            await act(async () => {
                Notification.open({ message: '消息', position: 'bottom', duration: 0 });
            });
            await waitFor(() => {
                expect(document.querySelector('.animal-notification-placement-bottom')).not.toBeNull();
            });
        });

        it('不同位置的通知分组到各自容器', async () => {
            await act(async () => {
                Notification.open({ message: '右上', position: 'topRight', duration: 0, key: 'pos-a' });
                Notification.open({ message: '左下', position: 'bottomLeft', duration: 0, key: 'pos-b' });
            });
            await waitFor(() => {
                expect(document.querySelector('.animal-notification-position-topRight')).not.toBeNull();
                expect(document.querySelector('.animal-notification-position-bottomLeft')).not.toBeNull();
            });
        });
    });

    // ─── 关闭行为 ─────────────────────────────────────────────────────────────

    describe('关闭行为', () => {
        it('点击关闭按钮触发 onClose 回调', async () => {
            // onClose is called after LEAVE_MS (300ms); use waitFor with generous timeout
            const onClose = vi.fn();
            await act(async () => {
                Notification.open({ message: '消息', type: 'info', duration: 0, onClose });
            });
            await waitFor(() => {
                expect(document.querySelector('.animal-notification-close')).not.toBeNull();
            });
            await act(async () => {
                (document.querySelector('.animal-notification-close') as HTMLElement).click();
            });
            await waitFor(() => {
                expect(onClose).toHaveBeenCalledTimes(1);
            }, { timeout: 1000 });
        });

        it('duration=0 时不自动触发 leaving', async () => {
            await act(async () => {
                Notification.open({ message: '持久通知', type: 'info', duration: 0 });
            });
            await waitFor(() => {
                expect(document.querySelector('.animal-notification')).not.toBeNull();
            });
            // No timer should fire — leaving class must be absent immediately
            expect(document.querySelector('.animal-notification-leaving')).toBeNull();
        });

        it('duration 到期后添加 animal-notification-leaving 类', async () => {
            // Use a very short duration so the test doesn't need fake timers
            await act(async () => {
                Notification.open({ message: '自动关闭', type: 'info', duration: 50 });
            });
            await waitFor(() => {
                expect(document.querySelector('.animal-notification')).not.toBeNull();
            });
            await waitFor(() => {
                expect(document.querySelector('.animal-notification-leaving')).not.toBeNull();
            }, { timeout: 500 });
        });

        it('点击关闭按钮后同步添加 animal-notification-leaving 类', async () => {
            // setLeaving(true) is called synchronously in startLeave(); act() flushes it
            await act(async () => {
                Notification.open({ message: '消息', type: 'info', duration: 0 });
            });
            await waitFor(() => {
                expect(document.querySelector('.animal-notification-close')).not.toBeNull();
            });
            act(() => {
                (document.querySelector('.animal-notification-close') as HTMLElement).click();
            });
            expect(document.querySelector('.animal-notification-leaving')).not.toBeNull();
        });

        it('notificationDestroy() 销毁所有通知', async () => {
            await act(async () => {
                Notification.open({ message: '1', type: 'info', duration: 0, key: 'del-k1' });
                Notification.open({ message: '2', type: 'success', duration: 0, key: 'del-k2' });
            });
            await waitFor(() => {
                expect(document.querySelectorAll('.animal-notification').length).toBe(2);
            });
            await act(async () => {
                notificationDestroy();
            });
            await waitFor(() => {
                expect(document.querySelectorAll('.animal-notification').length).toBe(0);
            });
        });

        it('notificationDestroy(key) 按 key 销毁指定通知', async () => {
            await act(async () => {
                Notification.open({ message: '保留', type: 'info', duration: 0, key: 'keep' });
                Notification.open({ message: '删除', type: 'error', duration: 0, key: 'remove' });
            });
            await waitFor(() => {
                expect(document.querySelectorAll('.animal-notification').length).toBe(2);
            });
            await act(async () => {
                notificationDestroy('remove');
            });
            await waitFor(() => {
                expect(document.querySelectorAll('.animal-notification').length).toBe(1);
                expect(document.querySelector('.animal-notification-error')).toBeNull();
            });
        });
    });

    // ─── onClick与可点击态 ────────────────────────────────────────────────────

    describe('onClick与可点击态', () => {
        it('有 onClick 时附加 animal-notification-clickable 类', async () => {
            await act(async () => {
                Notification.open({
                    message: '可点击',
                    type: 'info',
                    duration: 0,
                    onClick: vi.fn(),
                });
            });
            await waitFor(() => {
                expect(document.querySelector('.animal-notification-clickable')).not.toBeNull();
            });
        });

        it('无 onClick 时不附加 animal-notification-clickable 类', async () => {
            await act(async () => {
                Notification.open({ message: '不可点击', type: 'info', duration: 0 });
            });
            await waitFor(() => {
                expect(document.querySelector('.animal-notification')).not.toBeNull();
            });
            expect(document.querySelector('.animal-notification-clickable')).toBeNull();
        });

        it('点击通知区域触发 onClick', async () => {
            const onClick = vi.fn();
            await act(async () => {
                Notification.open({ message: '点击我', type: 'info', duration: 0, onClick });
            });
            await waitFor(() => {
                expect(document.querySelector('.animal-notification')).not.toBeNull();
            });
            await act(async () => {
                (document.querySelector('.animal-notification') as HTMLElement).click();
            });
            expect(onClick).toHaveBeenCalledTimes(1);
        });

        it('点击关闭按钮不触发 onClick（stopPropagation）', async () => {
            const onClick = vi.fn();
            await act(async () => {
                Notification.open({ message: '可点击', type: 'info', duration: 0, onClick });
            });
            await waitFor(() => {
                expect(document.querySelector('.animal-notification-close')).not.toBeNull();
            });
            await act(async () => {
                (document.querySelector('.animal-notification-close') as HTMLElement).click();
            });
            expect(onClick).not.toHaveBeenCalled();
        });
    });

    // ─── key更新 ──────────────────────────────────────────────────────────────

    describe('key更新', () => {
        it('相同 key 打开时更新而非新增', async () => {
            await act(async () => {
                Notification.open({ message: '原始消息', type: 'info', duration: 0, key: 'shared-key' });
            });
            await waitFor(() => {
                expect(document.querySelectorAll('.animal-notification').length).toBe(1);
            });
            await act(async () => {
                Notification.open({ message: '更新消息', type: 'success', duration: 0, key: 'shared-key' });
            });
            await waitFor(() => {
                expect(document.querySelectorAll('.animal-notification').length).toBe(1);
                expect(document.querySelector('.animal-notification-success')).not.toBeNull();
            });
        });

        it('相同 key 更新后 title 显示新内容', async () => {
            await act(async () => {
                Notification.open({ message: '旧标题', type: 'info', duration: 0, key: 'upd-key' });
            });
            await waitFor(() => {
                expect(document.querySelector('.animal-notification-title')?.textContent).toBe('旧标题');
            });
            await act(async () => {
                Notification.open({ message: '新标题', type: 'info', duration: 0, key: 'upd-key' });
            });
            await waitFor(() => {
                expect(document.querySelector('.animal-notification-title')?.textContent).toBe('新标题');
            });
        });

        it('不同 key 各自渲染独立通知', async () => {
            await act(async () => {
                Notification.open({ message: '消息A', type: 'info', duration: 0, key: 'kA' });
                Notification.open({ message: '消息B', type: 'success', duration: 0, key: 'kB' });
            });
            await waitFor(() => {
                expect(document.querySelectorAll('.animal-notification').length).toBe(2);
            });
        });
    });

    // ─── btn slot ─────────────────────────────────────────────────────────────

    describe('btn slot', () => {
        it('有 btn 时渲染 animal-notification-btn 容器', async () => {
            await act(async () => {
                Notification.open({
                    message: '有按钮',
                    type: 'info',
                    duration: 0,
                    btn: <button type="button">确定</button>,
                });
            });
            await waitFor(() => {
                expect(document.querySelector('.animal-notification-btn')).not.toBeNull();
            });
        });

        it('btn 内子元素可被找到', async () => {
            await act(async () => {
                Notification.open({
                    message: '有按钮',
                    type: 'info',
                    duration: 0,
                    btn: <button type="button">去处理</button>,
                });
            });
            await waitFor(() => {
                const slot = document.querySelector('.animal-notification-btn');
                expect(slot).not.toBeNull();
                expect(slot?.querySelector('button')?.textContent).toBe('去处理');
            });
        });

        it('无 btn 时不渲染 animal-notification-btn', async () => {
            await act(async () => {
                Notification.open({ message: '无按钮', type: 'info', duration: 0 });
            });
            await waitFor(() => {
                expect(document.querySelector('.animal-notification')).not.toBeNull();
            });
            expect(document.querySelector('.animal-notification-btn')).toBeNull();
        });

        it('btn 内容可与关闭按钮共存', async () => {
            await act(async () => {
                Notification.open({
                    message: '共存',
                    type: 'warning',
                    duration: 0,
                    btn: <button type="button">操作</button>,
                });
            });
            await waitFor(() => {
                expect(document.querySelector('.animal-notification-btn')).not.toBeNull();
                expect(document.querySelector('.animal-notification-close')).not.toBeNull();
            });
        });
    });
});
