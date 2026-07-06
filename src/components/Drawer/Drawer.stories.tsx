import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Drawer, type DrawerPlacement } from './Drawer';
import { Button } from '../Button';

const meta = {
    component: Drawer,
    tags: ['ai-generated'],
    parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

const DrawerDemo = ({ placement = 'right' }: { placement?: DrawerPlacement }) => {
    const [open, setOpen] = useState(false);
    return (
        <div style={{ padding: 40 }}>
            <Button type="primary" onClick={() => setOpen(true)}>打开抽屉</Button>
            <Drawer
                open={open}
                title="抽屉标题"
                placement={placement}
                onClose={() => setOpen(false)}
                footer={<Button onClick={() => setOpen(false)}>关闭</Button>}
            >
                <p>集合啦！动物森友会抽屉内容</p>
                <p>可以放置任意内容</p>
            </Drawer>
        </div>
    );
};

export const Right: Story = {
    render: () => <DrawerDemo placement="right" />,
};

export const Left: Story = {
    render: () => <DrawerDemo placement="left" />,
};

export const Top: Story = {
    render: () => <DrawerDemo placement="top" />,
};

export const Bottom: Story = {
    render: () => <DrawerDemo placement="bottom" />,
};

export const OpenByDefault: Story = {
    render: () => {
        const [open, setOpen] = useState(true);
        return (
            <div style={{ padding: 40 }}>
                <Button type="primary" onClick={() => setOpen(true)}>打开</Button>
                <Drawer open={open} title="默认打开" onClose={() => setOpen(false)}>
                    <p>这是抽屉内容</p>
                </Drawer>
            </div>
        );
    },
    play: async ({ canvasElement }) => {
        const dialog = canvasElement.ownerDocument.querySelector('[role="dialog"]') as HTMLElement;
        await expect(dialog).toBeInTheDocument();
        await expect(dialog).toHaveAttribute('aria-modal', 'true');
        await expect(dialog).toHaveClass('animal-drawer-panel');
    },
};

export const ClassCheck: Story = {
    render: () => {
        const [open, setOpen] = useState(true);
        return (
            <div style={{ padding: 40 }}>
                <Drawer open={open} placement="left" title="类名检查" onClose={() => setOpen(false)}>
                    <p>内容</p>
                </Drawer>
            </div>
        );
    },
    play: async ({ canvasElement }) => {
        const dialog = canvasElement.ownerDocument.querySelector('[role="dialog"]') as HTMLElement;
        await expect(dialog).toHaveClass('animal-drawer-panel-left');
        await expect(dialog).toHaveClass('animal-drawer-panel-open');
    },
};
