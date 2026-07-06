import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';
import { Button } from '../Button';
import { Notification, notificationDestroy } from './NotificationPortal';

const meta = {
    title: 'Notification',
    tags: ['ai-generated'],
    render: () => <div />,
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {
    render: () => (
        <div style={{ padding: 40 }}>
            <Button type="primary" onClick={() => Notification.info('岛民你好！动物森友会通知')}>
                信息通知
            </Button>
        </div>
    ),
};

export const Success: Story = {
    render: () => (
        <div style={{ padding: 40 }}>
            <Button type="primary" onClick={() => Notification.success('成功！集合啦')}>
                成功通知
            </Button>
        </div>
    ),
};

export const Warning: Story = {
    render: () => (
        <div style={{ padding: 40 }}>
            <Button onClick={() => Notification.warning('注意！')}>
                警告通知
            </Button>
        </div>
    ),
};

export const ErrorType: Story = {
    render: () => (
        <div style={{ padding: 40 }}>
            <Button danger onClick={() => Notification.error('出错了！')}>
                错误通知
            </Button>
        </div>
    ),
};

export const AllTypes: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: 8, padding: 40 }}>
            <Button onClick={() => Notification.success('success')}>success</Button>
            <Button onClick={() => Notification.info('info')}>info</Button>
            <Button onClick={() => Notification.warning('warning')}>warning</Button>
            <Button danger onClick={() => Notification.error('error')}>error</Button>
        </div>
    ),
};

export const WithDescription: Story = {
    render: () => (
        <div style={{ padding: 40 }}>
            <Button
                type="primary"
                onClick={() =>
                    Notification.info({
                        message: '集合啦！动物森友会',
                        description: '今天钓鱼大赛开始了，快来参加吧！',
                    })
                }
            >
                带描述通知
            </Button>
        </div>
    ),
};

export const BottomPosition: Story = {
    render: () => (
        <div style={{ padding: 40 }}>
            <Button
                onClick={() =>
                    Notification.info({
                        message: '底部通知',
                        position: 'bottom',
                    })
                }
            >
                底部通知
            </Button>
        </div>
    ),
};

export const AutoClose: Story = {
    render: () => (
        <div style={{ padding: 40 }}>
            <Button
                onClick={() =>
                    Notification.info({
                        message: '1秒后自动关闭',
                        duration: 1,
                    })
                }
            >
                快速自动关闭
            </Button>
        </div>
    ),
};

export const ClassCheck: Story = {
    render: () => (
        <div style={{ padding: 40 }}>
            <Button
                type="primary"
                data-testid="trigger"
                onClick={() =>
                    Notification.success({
                        message: 'class check',
                        duration: 10,
                    })
                }
            >
                触发类名检查
            </Button>
        </div>
    ),
    play: async ({ canvasElement }) => {
        const doc = canvasElement.ownerDocument;
        const trigger = canvasElement.querySelector('[data-testid="trigger"]') as HTMLElement;
        await userEvent.click(trigger);
        await waitFor(() => {
            const root = doc.querySelector('[data-animal-notification-root]');
            expect(root).toBeTruthy();
        });
        await waitFor(() => {
            const card = doc.querySelector('.animal-notification') as HTMLElement;
            expect(card).toBeTruthy();
            expect(card.className).toContain('animal-notification-type-success');
        });
        notificationDestroy();
    },
};
