import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { Button } from '../Button';
import { Drawer } from './Drawer';

const meta = {
    title: 'Components/Drawer',
    component: Drawer,
    tags: ['autodocs'],
    parameters: { layout: 'padded' },
    argTypes: {
        placement: { control: 'select', options: ['left', 'right', 'top', 'bottom'] },
        open: { control: 'boolean' },
        maskClosable: { control: 'boolean' },
        pushBackground: { control: 'boolean' },
    },
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: (args) => {
        const [open, setOpen] = useState(false);
        return (
            <>
                <Button onClick={() => setOpen(true)}>打开抽屉</Button>
                <Drawer {...args} open={open} onClose={() => setOpen(false)} title="侧边栏">
                    <p>这是抽屉内容</p>
                </Drawer>
            </>
        );
    },
};

export const OpenStable: Story = {
    name: 'Open (no-play, for Playwright)',
    render: () => (
        <Drawer open title="测试抽屉" onClose={() => {}}>
            <p>抽屉内容</p>
        </Drawer>
    ),
    tags: ['!dev', '!autodocs'],
    parameters: { layout: 'fullscreen' },
};
