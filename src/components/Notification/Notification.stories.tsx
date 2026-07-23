import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Button } from '../Button';
import { Notification } from './NotificationPortal';

const meta = {
    title: 'Components/Notification',
    tags: ['autodocs'],
    parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = {
    render: () => (
        <Button
            onClick={() =>
                Notification.success({ message: '保存成功', description: '已写入云端' })
            }
        >
            显示成功通知
        </Button>
    ),
};

export const Info: Story = {
    render: () => (
        <Button onClick={() => Notification.info({ message: '信息提示' })}>
            显示信息通知
        </Button>
    ),
};

export const Warning: Story = {
    render: () => (
        <Button onClick={() => Notification.warning({ message: '警告提示' })}>
            显示警告通知
        </Button>
    ),
};

export const Error: Story = {
    render: () => (
        <Button onClick={() => Notification.error({ message: '发生错误', description: '请重试' })}>
            显示错误通知
        </Button>
    ),
};
