import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Drawer, type DrawerPlacement } from './Drawer';
import { Button } from '../Button';

const meta = {
    component: Drawer,
    tags: ['ai-generated'],
    args: {
        open: false,
        title: '动物森友会',
    },
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Opens from the right (default placement) */
export const Right: Story = {
    render: () => {
        const [open, setOpen] = useState(false);
        return (
            <>
                <Button type="primary" onClick={() => setOpen(true)}>
                    打开右侧抽屉
                </Button>
                <Drawer
                    open={open}
                    title="岛民商店"
                    placement="right"
                    onClose={() => setOpen(false)}
                    footer={
                        <Button type="primary" onClick={() => setOpen(false)}>
                            关闭
                        </Button>
                    }
                >
                    <p>欢迎来到狸克镇长的商店！今日特卖：竹子家具套装、钓鱼竿、虫网各一份。</p>
                </Drawer>
            </>
        );
    },
};

/** Opens from the left */
export const Left: Story = {
    render: () => {
        const [open, setOpen] = useState(false);
        return (
            <>
                <Button type="primary" onClick={() => setOpen(true)}>
                    打开左侧抽屉
                </Button>
                <Drawer
                    open={open}
                    title="导航菜单"
                    placement="left"
                    onClose={() => setOpen(false)}
                >
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <li>🏠 我的岛屿</li>
                        <li>🐟 钓鱼</li>
                        <li>🦋 捉虫</li>
                        <li>🎨 设计工坊</li>
                        <li>🌸 花圃</li>
                    </ul>
                </Drawer>
            </>
        );
    },
};

/** Opens from the top */
export const Top: Story = {
    render: () => {
        const [open, setOpen] = useState(false);
        return (
            <>
                <Button type="primary" onClick={() => setOpen(true)}>
                    打开顶部抽屉
                </Button>
                <Drawer
                    open={open}
                    title="公告栏"
                    placement="top"
                    height={220}
                    onClose={() => setOpen(false)}
                >
                    <p>今日天气晴朗，适合出海钓鱼！流星雨预报：本周五晚 8 点。狸克镇长公告：广场改建工程已完工。</p>
                </Drawer>
            </>
        );
    },
};

/** Opens from the bottom */
export const Bottom: Story = {
    render: () => {
        const [open, setOpen] = useState(false);
        return (
            <>
                <Button type="primary" onClick={() => setOpen(true)}>
                    打开底部抽屉
                </Button>
                <Drawer
                    open={open}
                    title="快速操作"
                    placement="bottom"
                    height={280}
                    onClose={() => setOpen(false)}
                    footer={
                        <div style={{ display: 'flex', gap: 8 }}>
                            <Button type="primary" onClick={() => setOpen(false)}>确定</Button>
                            <Button type="default" onClick={() => setOpen(false)}>取消</Button>
                        </div>
                    }
                >
                    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                        {['钓鱼 🐟', '捉虫 🦋', '挖化石 🦕', '摘果子 🍎', '浇花 🌸'].map((action) => (
                            <Button key={action} type="default" onClick={() => setOpen(false)}>
                                {action}
                            </Button>
                        ))}
                    </div>
                </Drawer>
            </>
        );
    },
};

/** All four placements toggled from one control */
export const AllPlacements: Story = {
    render: () => {
        const [placement, setPlacement] = useState<DrawerPlacement | null>(null);
        const placements: DrawerPlacement[] = ['left', 'right', 'top', 'bottom'];
        return (
            <>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {placements.map((p) => (
                        <Button key={p} type="primary" onClick={() => setPlacement(p)}>
                            {p}
                        </Button>
                    ))}
                </div>
                {placements.map((p) => (
                    <Drawer
                        key={p}
                        open={placement === p}
                        title={`抽屉（${p}）`}
                        placement={p}
                        onClose={() => setPlacement(null)}
                    >
                        来自 {p} 方向的抽屉内容。
                    </Drawer>
                ))}
            </>
        );
    },
};

/** maskClosable=false — must use close button */
export const MaskNotClosable: Story = {
    render: () => {
        const [open, setOpen] = useState(false);
        return (
            <>
                <Button type="primary" onClick={() => setOpen(true)}>
                    点击遮罩不关闭
                </Button>
                <Drawer
                    open={open}
                    title="重要提示"
                    maskClosable={false}
                    onClose={() => setOpen(false)}
                    footer={
                        <Button type="primary" onClick={() => setOpen(false)}>
                            我知道了
                        </Button>
                    }
                >
                    喵喵说：「这个抽屉需要点按钮才能关闭，点遮罩是没用的哦！」
                </Drawer>
            </>
        );
    },
};
