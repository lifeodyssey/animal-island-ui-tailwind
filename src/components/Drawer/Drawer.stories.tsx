import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within, userEvent, waitFor } from 'storybook/test';
import { Drawer } from './Drawer';
import { Button } from '../Button';

const meta = {
    component: Drawer,
    tags: ['autodocs'],
    args: { open: false },
    argTypes: {
        placement: { control: 'select', options: ['left', 'right', 'top', 'bottom'] },
        maskClosable: { control: 'boolean' },
        pushBackground: { control: 'boolean' },
    },
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

const DrawerDemo = (props: Partial<React.ComponentProps<typeof Drawer>>) => {
    const [open, setOpen] = useState(false);
    return (
        <>
            <Button onClick={() => setOpen(true)}>打开抽屉</Button>
            <Drawer open={open} onClose={() => setOpen(false)} title="抽屉标题" {...props}>
                <p>这是抽屉内容。</p>
                <p>可以放任意内容。</p>
            </Drawer>
        </>
    );
};

export const Default: Story = {
    render: () => <DrawerDemo />,
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const trigger = canvas.getByRole('button', { name: '打开抽屉' });
        await userEvent.click(trigger);
        await waitFor(() => {
            expect(canvas.getByRole('dialog')).toBeInTheDocument();
        });
        await expect(canvas.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
        const closeBtn = canvas.getByLabelText('关闭');
        await userEvent.click(closeBtn);
    },
};

export const LeftPlacement: Story = {
    render: () => <DrawerDemo placement="left" />,
};

export const TopPlacement: Story = {
    render: () => <DrawerDemo placement="top" />,
};

export const BottomPlacement: Story = {
    render: () => <DrawerDemo placement="bottom" />,
};

export const WithFooter: Story = {
    render: () => (
        <DrawerDemo
            footer={
                <>
                    <Button>取消</Button>
                    <Button type="primary">确定</Button>
                </>
            }
        />
    ),
};
