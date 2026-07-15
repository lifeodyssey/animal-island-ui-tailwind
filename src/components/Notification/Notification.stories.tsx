import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Notification } from './NotificationPortal';

const meta = {
    title: 'Notification',
    tags: ['ai-generated'],
    parameters: { layout: 'centered' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {
    render: () => (
        <button onClick={() => Notification.info('这是一条信息通知')}>
            显示 Info
        </button>
    ),
};

export const Success: Story = {
    render: () => (
        <button onClick={() => Notification.success('操作成功！')}>
            显示 Success
        </button>
    ),
};

export const Warning: Story = {
    render: () => (
        <button onClick={() => Notification.warning('请注意此操作')}>
            显示 Warning
        </button>
    ),
};

export const Error: Story = {
    render: () => (
        <button onClick={() => Notification.error('操作失败，请重试')}>
            显示 Error
        </button>
    ),
};

export const WithDescription: Story = {
    render: () => (
        <button
            onClick={() =>
                Notification.info({
                    message: '标题消息',
                    description: '这是更详细的描述内容，补充说明通知的具体信息。',
                })
            }
        >
            带描述的通知
        </button>
    ),
};

export const TopRight: Story = {
    render: () => (
        <button
            onClick={() =>
                Notification.info({ message: '右上角', position: 'topRight' })
            }
        >
            topRight 位置
        </button>
    ),
};
