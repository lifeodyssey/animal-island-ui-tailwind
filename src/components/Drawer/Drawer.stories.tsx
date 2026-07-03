import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Drawer, type DrawerPlacement } from './Drawer';
import { Button } from '../Button';

const meta = {
    component: Drawer,
    tags: ['ai-generated'],
    args: { open: false },
    argTypes: {
        placement: { control: 'select', options: ['right', 'left', 'top', 'bottom'] as DrawerPlacement[] },
        maskClosable: { control: 'boolean' },
        pushBackground: { control: 'boolean' },
    },
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 基础用法：右侧抽屉（默认位置） */
export const Basic: Story = {
    render: () => {
        const [open, setOpen] = useState(false);
        return (
            <>
                <Button type="primary" onClick={() => setOpen(true)}>
                    打开抽屉
                </Button>
                <Drawer open={open} title="居民服务处" onClose={() => setOpen(false)}>
                    <p>欢迎来到动物森友会！今天的每日任务已更新，快去看看吧。</p>
                </Drawer>
            </>
        );
    },
};

/** 关闭状态（不渲染内容） */
export const Closed: Story = {
    render: () => (
        <>
            <p style={{ fontFamily: 'sans-serif', color: '#888' }}>抽屉已关闭（open=false）</p>
            <Drawer open={false} title="居民服务处" onClose={() => {}}>
                这段内容不可见。
            </Drawer>
        </>
    ),
};

/** 左侧抽屉 */
export const LeftPlacement: Story = {
    render: () => {
        const [open, setOpen] = useState(false);
        return (
            <>
                <Button onClick={() => setOpen(true)}>左侧打开</Button>
                <Drawer open={open} title="动物地图" placement="left" onClose={() => setOpen(false)}>
                    <p>小镇地图在此展示。</p>
                </Drawer>
            </>
        );
    },
};

/** 顶部抽屉 */
export const TopPlacement: Story = {
    render: () => {
        const [open, setOpen] = useState(false);
        return (
            <>
                <Button onClick={() => setOpen(true)}>顶部打开</Button>
                <Drawer open={open} title="通知栏" placement="top" onClose={() => setOpen(false)}>
                    <p>您有新的岛屿通知。</p>
                </Drawer>
            </>
        );
    },
};

/** 底部抽屉 */
export const BottomPlacement: Story = {
    render: () => {
        const [open, setOpen] = useState(false);
        return (
            <>
                <Button onClick={() => setOpen(true)}>底部打开</Button>
                <Drawer
                    open={open}
                    title="操作菜单"
                    placement="bottom"
                    height={240}
                    onClose={() => setOpen(false)}
                >
                    <p>选择您的操作：种树 / 钓鱼 / 摘果子</p>
                </Drawer>
            </>
        );
    },
};

/** 带 footer 的抽屉 */
export const WithFooter: Story = {
    render: () => {
        const [open, setOpen] = useState(false);
        return (
            <>
                <Button onClick={() => setOpen(true)}>带操作按钮</Button>
                <Drawer
                    open={open}
                    title="确认事项"
                    onClose={() => setOpen(false)}
                    footer={
                        <>
                            <Button onClick={() => setOpen(false)}>取消</Button>
                            <Button type="primary" onClick={() => setOpen(false)}>
                                确认
                            </Button>
                        </>
                    }
                >
                    <p>您确定要出售这件家具吗？</p>
                </Drawer>
            </>
        );
    },
};

/** 禁止点击遮罩关闭 */
export const NoMaskClose: Story = {
    render: () => {
        const [open, setOpen] = useState(false);
        return (
            <>
                <Button onClick={() => setOpen(true)}>点遮罩不关闭</Button>
                <Drawer
                    open={open}
                    title="重要确认"
                    maskClosable={false}
                    onClose={() => setOpen(false)}
                >
                    <p>请使用关闭按钮或按 Esc 键关闭此抽屉。</p>
                </Drawer>
            </>
        );
    },
};
