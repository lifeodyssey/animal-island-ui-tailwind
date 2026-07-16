import type { Meta, StoryObj } from '@storybook/react-vite';
import { vi } from 'vitest';
import { Notification, notificationDestroy } from './NotificationPortal';

const meta = {
    title: 'Components/Notification',
    tags: ['ai-generated'],
    render: () => <div />,
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {
    play: async () => {
        Notification.info({ message: '提示', description: '这是一条 info 通知' });
    },
};

export const Success: Story = {
    play: async () => {
        Notification.success({ message: '成功', description: '操作已完成' });
    },
};

export const Warning: Story = {
    play: async () => {
        Notification.warning({ message: '警告', description: '请注意此操作' });
    },
};

export const Error: Story = {
    play: async () => {
        Notification.error({ message: '错误', description: '操作失败，请重试' });
    },
};

export const AllTypes: Story = {
    play: async () => {
        Notification.info({ message: 'Info', description: '这是 info 消息' });
        Notification.success({ message: 'Success', description: '这是 success 消息' });
        Notification.warning({ message: 'Warning', description: '这是 warning 消息' });
        Notification.error({ message: 'Error', description: '这是 error 消息' });
    },
};

export const WithOnClose: Story = {
    play: async () => {
        Notification.info({
            message: '带关闭回调',
            duration: 2,
            onClose: vi.fn(),
        });
    },
};

export const TopRight: Story = {
    play: async () => {
        Notification.info({ message: '右上角', position: 'topRight' });
    },
};

export const Bottom: Story = {
    play: async () => {
        Notification.info({ message: '底部', position: 'bottom' });
    },
};

export const NoAutoDismiss: Story = {
    play: async () => {
        Notification.info({ message: '不自动关闭', duration: 0 });
    },
};
