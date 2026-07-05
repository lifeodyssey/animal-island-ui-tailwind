import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Drawer, type DrawerPlacement } from './Drawer';
import { Button } from '../Button';

const meta = {
    component: Drawer,
    tags: ['ai-generated'],
    parameters: { layout: 'fullscreen' },
    args: { open: false },
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

const DrawerDemo = ({ placement = 'right' }: { placement?: DrawerPlacement }) => {
    const [open, setOpen] = useState(false);
    return (
        <>
            <div style={{ padding: 24 }}>
                <Button type="primary" onClick={() => setOpen(true)}>打开抽屉</Button>
            </div>
            <Drawer
                open={open}
                onClose={() => setOpen(false)}
                title="动物岛屿"
                placement={placement}
            >
                <p>欢迎来到动物岛！</p>
            </Drawer>
        </>
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

export const WithFooter: Story = {
    render: () => {
        const [open, setOpen] = useState(false);
        return (
            <>
                <div style={{ padding: 24 }}>
                    <Button type="primary" onClick={() => setOpen(true)}>带页脚的抽屉</Button>
                </div>
                <Drawer
                    open={open}
                    onClose={() => setOpen(false)}
                    title="动物岛屿"
                    footer={
                        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                            <Button onClick={() => setOpen(false)}>取消</Button>
                            <Button type="primary" onClick={() => setOpen(false)}>确认</Button>
                        </div>
                    }
                >
                    <p>抽屉内容</p>
                </Drawer>
            </>
        );
    },
};

export const OpenByDefault: Story = {
    render: () => {
        const [open, setOpen] = useState(true);
        return (
            <>
                <div style={{ padding: 24 }}>
                    <Button type="primary" onClick={() => setOpen(true)}>打开</Button>
                </div>
                <Drawer open={open} onClose={() => setOpen(false)} title="动物岛屿">
                    <p>抽屉内容</p>
                </Drawer>
            </>
        );
    },
    play: async () => {
        const dialog = within(document.body).getByRole('dialog');
        await expect(dialog).toBeInTheDocument();
        await expect(dialog).toHaveAttribute('aria-modal', 'true');
    },
};
