import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { notificationOpen, NOTIFICATION_DEFAULT_DURATION } from './NotificationPortal';
import { Button } from '../Button';
import type { NotificationType, NotificationPosition } from './types';

// Notification is a static API that auto-mounts a portal to document.body.
// Stories just render trigger buttons.

const meta = {
    title: 'Notification',
    tags: ['ai-generated'],
    render: () => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: 24 }}>
            <Button
                type="primary"
                onClick={() =>
                    notificationOpen({
                        type: 'success',
                        message: '操作成功',
                        description: '动物已加入你的岛屿！',
                        position: 'topRight',
                        duration: NOTIFICATION_DEFAULT_DURATION,
                    }, 'success')
                }
            >
                成功
            </Button>
            <Button
                onClick={() =>
                    notificationOpen({
                        type: 'info',
                        message: '提示信息',
                        position: 'topRight',
                        duration: NOTIFICATION_DEFAULT_DURATION,
                    }, 'info')
                }
            >
                信息
            </Button>
            <Button
                danger
                onClick={() =>
                    notificationOpen({
                        type: 'warning',
                        message: '注意',
                        description: '天气将要变化',
                        position: 'topRight',
                        duration: NOTIFICATION_DEFAULT_DURATION,
                    }, 'warning')
                }
            >
                警告
            </Button>
            <Button
                type="dashed"
                danger
                onClick={() =>
                    notificationOpen({
                        type: 'error',
                        message: '出错了',
                        description: '网络连接失败，请重试',
                        position: 'topRight',
                        duration: NOTIFICATION_DEFAULT_DURATION,
                    }, 'error')
                }
            >
                错误
            </Button>
        </div>
    ),
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AllTypes: Story = {
    render: () => {
        const types: NotificationType[] = ['success', 'info', 'warning', 'error'];
        return (
            <div style={{ display: 'flex', gap: 8, padding: 24 }}>
                {types.map((type) => (
                    <Button
                        key={type}
                        onClick={() =>
                            notificationOpen({
                                message: `${type} 通知`,
                                position: 'topRight',
                                duration: 3,
                            }, type)
                        }
                    >
                        {type}
                    </Button>
                ))}
            </div>
        );
    },
};

export const AllPositions: Story = {
    render: () => {
        const positions: NotificationPosition[] = [
            'top', 'topLeft', 'topRight', 'bottom', 'bottomLeft', 'bottomRight',
        ];
        return (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: 24 }}>
                {positions.map((position) => (
                    <Button
                        key={position}
                        onClick={() =>
                            notificationOpen({
                                message: position,
                                position,
                                duration: 2,
                            }, 'info')
                        }
                    >
                        {position}
                    </Button>
                ))}
            </div>
        );
    },
};
