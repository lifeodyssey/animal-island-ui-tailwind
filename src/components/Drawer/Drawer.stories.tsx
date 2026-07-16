import type { Meta, StoryObj } from '@storybook/react-vite';
import { vi } from 'vitest';
import { useState } from 'react';
import { Drawer } from './Drawer';
import type { DrawerPlacement } from './Drawer';

const meta = {
    component: Drawer,
    tags: ['ai-generated'],
    args: {
        open: false,
        onClose: vi.fn(),
    },
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

const DrawerHost = ({ placement = 'right' as DrawerPlacement, title = '抽屉标题', ...rest }) => {
    const [open, setOpen] = useState(false);
    return (
        <>
            <button onClick={() => setOpen(true)} style={{ padding: '8px 24px' }}>
                打开抽屉
            </button>
            <Drawer
                open={open}
                title={title}
                placement={placement}
                onClose={() => setOpen(false)}
                {...rest}
            >
                <p>这是抽屉内容，动物岛风格下沉景深。</p>
            </Drawer>
        </>
    );
};

export const Default: Story = {
    render: () => <DrawerHost />,
};

export const Left: Story = {
    render: () => <DrawerHost placement="left" />,
};

export const Top: Story = {
    render: () => <DrawerHost placement="top" />,
};

export const Bottom: Story = {
    render: () => <DrawerHost placement="bottom" />,
};

export const WithFooter: Story = {
    render: () => {
        const [open, setOpen] = useState(false);
        return (
            <>
                <button onClick={() => setOpen(true)} style={{ padding: '8px 24px' }}>
                    打开带 Footer 的抽屉
                </button>
                <Drawer
                    open={open}
                    title="带 Footer"
                    onClose={() => setOpen(false)}
                    footer={
                        <div style={{ display: 'flex', gap: 12 }}>
                            <button onClick={() => setOpen(false)}>取消</button>
                            <button onClick={() => setOpen(false)}>确认</button>
                        </div>
                    }
                >
                    <p>抽屉内容区域</p>
                </Drawer>
            </>
        );
    },
};

export const NoMaskClose: Story = {
    render: () => <DrawerHost maskClosable={false} title="点击遮罩不关闭" />,
};

export const NoPushBackground: Story = {
    render: () => <DrawerHost pushBackground={false} title="无景深效果" />,
};
