import type { Meta, StoryObj } from '@storybook/react-vite';
import { within, expect } from 'storybook/test';
import React, { useState } from 'react';
import { Drawer, type DrawerPlacement } from './Drawer';
import { Button } from '../Button';

const meta = {
    title: 'Drawer',
    tags: ['ui'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const DrawerDemo = ({ placement = 'right' as DrawerPlacement, title = '设置' }) => {
    const [open, setOpen] = useState(false);
    return (
        <div>
            <Button onClick={() => setOpen(true)}>Open Drawer</Button>
            <Drawer
                open={open}
                title={title}
                placement={placement}
                onClose={() => setOpen(false)}
                footer={<Button onClick={() => setOpen(false)}>关闭</Button>}
            >
                <p>这里是 Drawer 内容区域。</p>
            </Drawer>
        </div>
    );
};

export const Default: Story = {
    render: () => <DrawerDemo />,
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

export const OpenState: Story = {
    render: () => (
        <Drawer open title="已打开的抽屉" onClose={() => {}}>
            <p>这是一个默认打开的抽屉。</p>
        </Drawer>
    ),
    play: async () => {
        const canvas = within(document.body);
        await expect(await canvas.findByRole('dialog')).toBeInTheDocument();
    },
};
