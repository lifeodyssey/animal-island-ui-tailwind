import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within, expect } from 'storybook/test';
import React from 'react';
import { Notification } from './NotificationPortal';
import { Button } from '../Button';

const meta = {
    title: 'Notification',
    tags: ['ui'],
    render: () => <div style={{ padding: 16 }} />,
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = {
    play: async () => {
        const body = within(document.body);
        Notification.success({ message: '操作成功', description: '数据已保存', duration: 0 });
        await expect(await body.findByText('操作成功')).toBeInTheDocument();
        Notification.destroy();
    },
};

export const Info: Story = {
    play: async () => {
        const body = within(document.body);
        Notification.info({ message: '提示信息', duration: 0 });
        await expect(await body.findByText('提示信息')).toBeInTheDocument();
        Notification.destroy();
    },
};

export const Warning: Story = {
    play: async () => {
        const body = within(document.body);
        Notification.warning({ message: '警告', description: '请注意', duration: 0 });
        await expect(await body.findByText('警告')).toBeInTheDocument();
        Notification.destroy();
    },
};

export const Error: Story = {
    play: async () => {
        const body = within(document.body);
        Notification.error({ message: '操作失败', duration: 0 });
        await expect(await body.findByText('操作失败')).toBeInTheDocument();
        Notification.destroy();
    },
};

export const WithCloseButton: Story = {
    render: () => (
        <Button
            onClick={() => {
                Notification.info({ message: '点击关闭按钮', duration: 0 });
            }}
        >
            Show Notification
        </Button>
    ),
};
