import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Drawer } from './Drawer';

const meta = {
    component: Drawer,
    tags: ['ai-generated'],
    parameters: { layout: 'centered' },
    args: { open: false },
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

const DrawerDemo = ({
    placement = 'right' as const,
    title = '抽屉标题',
}: {
    placement?: 'left' | 'right' | 'top' | 'bottom';
    title?: string;
}) => {
    const [open, setOpen] = useState(false);
    return (
        <>
            <button onClick={() => setOpen(true)}>打开抽屉</button>
            <Drawer
                open={open}
                title={title}
                placement={placement}
                onClose={() => setOpen(false)}
                footer={<button onClick={() => setOpen(false)}>确认</button>}
            >
                <p>抽屉内容区域</p>
                <p>可以放置任意内容。</p>
            </Drawer>
        </>
    );
};

export const Right: Story = {
    render: () => <DrawerDemo placement="right" title="右侧抽屉" />,
};

export const Left: Story = {
    render: () => <DrawerDemo placement="left" title="左侧抽屉" />,
};

export const Top: Story = {
    render: () => <DrawerDemo placement="top" title="顶部抽屉" />,
};

export const Bottom: Story = {
    render: () => <DrawerDemo placement="bottom" title="底部抽屉" />,
};

export const NoTitle: Story = {
    render: () => {
        const [open, setOpen] = useState(false);
        return (
            <>
                <button onClick={() => setOpen(true)}>无标题抽屉</button>
                <Drawer open={open} onClose={() => setOpen(false)}>
                    <p>无标题区域，直接显示内容。</p>
                </Drawer>
            </>
        );
    },
};
