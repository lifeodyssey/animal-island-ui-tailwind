import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within, userEvent } from 'storybook/test';
import { Button } from '../Button';
import { Notification, notificationDestroy } from './NotificationPortal';

const meta = {
    title: 'Notification',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component:
                    '命令式通知组件。使用 `Notification.success/info/warning/error(config)` 触发。',
            },
        },
    },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = {
    render: () => (
        <Button
            onClick={() => Notification.success({ message: '操作成功', description: '已保存到本地' })}
        >
            显示成功通知
        </Button>
    ),
};

export const Info: Story = {
    render: () => (
        <Button onClick={() => Notification.info('这是一条信息通知')}>显示信息通知</Button>
    ),
};

export const Warning: Story = {
    render: () => (
        <Button onClick={() => Notification.warning({ message: '注意', description: '操作不可撤销' })}>
            显示警告通知
        </Button>
    ),
};

export const Error: Story = {
    render: () => (
        <Button onClick={() => Notification.error({ message: '发生错误', description: '请稍后重试' })}>
            显示错误通知
        </Button>
    ),
};

export const AllTypes: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Button onClick={() => Notification.success('成功')}>成功</Button>
            <Button onClick={() => Notification.info('信息')}>信息</Button>
            <Button onClick={() => Notification.warning('警告')}>警告</Button>
            <Button onClick={() => Notification.error('错误')}>错误</Button>
        </div>
    ),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const btn = canvas.getByRole('button', { name: '成功' });
        await userEvent.click(btn);
        await expect(document.querySelector('[data-animal-notification-root]')).toBeTruthy();
        notificationDestroy();
    },
};

export const WithDestroy: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: 8 }}>
            <Button onClick={() => Notification.info({ message: '持久通知', duration: 0, key: 'persist' })}>
                显示持久通知
            </Button>
            <Button type="dashed" onClick={() => notificationDestroy()}>
                关闭全部
            </Button>
        </div>
    ),
};
