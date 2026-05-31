import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Tooltip, type TooltipPlacement } from './Tooltip';
import { Button } from '../Button';

const meta = {
    component: Tooltip,
    tags: ['ai-generated'],
    args: {
        title: '提示',
        children: <Button>hover me</Button>,
    },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const HoverDefault: Story = {
    args: { title: '默认提示', children: <Button>hover me</Button> },
};

export const ClickTrigger: Story = {
    args: { title: '点击提示', trigger: 'click', children: <Button>click me</Button> },
};

export const IslandVariant: Story = {
    args: {
        title: 'island 风格提示',
        variant: 'island',
        children: <Button size="small">island</Button>,
    },
};

export const RendersInPortal: Story = {
    args: { title: '默认提示', children: <Button>show tooltip</Button> },
    play: async ({ canvas, canvasElement, userEvent }) => {
        const trigger = canvas.getByRole('button', { name: /show tooltip/i });
        await userEvent.hover(trigger);
        const docBody = within(canvasElement.ownerDocument.body);
        const tooltip = await docBody.findByRole('tooltip', {}, { timeout: 3000 });
        await expect(tooltip).toHaveTextContent('默认提示');
    },
};

// ── All 12 placements ──────────────────────────────────────────────────────

const ALL_PLACEMENTS: TooltipPlacement[] = [
    'top',
    'top-start',
    'top-end',
    'bottom',
    'bottom-start',
    'bottom-end',
    'left',
    'left-start',
    'left-end',
    'right',
    'right-start',
    'right-end',
];

export const AllPlacements: Story = {
    render: () => (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, auto)',
                gap: '2rem',
                padding: '4rem',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            {ALL_PLACEMENTS.map((placement) => (
                <Tooltip key={placement} title={`${placement} 方向`} placement={placement}>
                    <Button size="small">{placement}</Button>
                </Tooltip>
            ))}
        </div>
    ),
};

// ── Trigger variants ───────────────────────────────────────────────────────

export const FocusTrigger: Story = {
    args: {
        title: '焦点触发提示 — 用 Tab 聚焦按钮',
        trigger: 'focus',
        children: <Button>focus me (Tab)</Button>,
    },
};

export const AllTriggers: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: '2rem', padding: '3rem', justifyContent: 'center' }}>
            <Tooltip title="悬停触发 — 岛民你好！" trigger="hover">
                <Button>hover 触发</Button>
            </Tooltip>
            <Tooltip title="焦点触发 — 集合啦！" trigger="focus">
                <Button>focus 触发</Button>
            </Tooltip>
            <Tooltip title="点击触发 — 喵喵！" trigger="click">
                <Button>click 触发</Button>
            </Tooltip>
        </div>
    ),
};

// ── Variant: default vs island ─────────────────────────────────────────────

export const BothVariants: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: '3rem', padding: '3rem', justifyContent: 'center' }}>
            <Tooltip title="默认风格 — 岛民公告" variant="default">
                <Button>default 风格</Button>
            </Tooltip>
            <Tooltip title="岛屿风格 — 动森感满满" variant="island">
                <Button size="small">island 风格</Button>
            </Tooltip>
        </div>
    ),
};

// ── Bordered true / false ──────────────────────────────────────────────────

export const BorderedTrue: Story = {
    args: {
        title: '有边框的提示 — 集合啦！',
        bordered: true,
        children: <Button>bordered</Button>,
    },
};

export const BorderedFalse: Story = {
    args: {
        title: '无边框的提示 — 岛上生活',
        bordered: false,
        children: <Button>borderless</Button>,
    },
};

export const BorderedComparison: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: '3rem', padding: '3rem', justifyContent: 'center' }}>
            <Tooltip title="有边框 — 喵喵集合" bordered={true}>
                <Button>有边框</Button>
            </Tooltip>
            <Tooltip title="无边框 — 喵喵集合" bordered={false}>
                <Button>无边框</Button>
            </Tooltip>
            <Tooltip title="island + 有边框" variant="island" bordered={true}>
                <Button size="small">island 有边框</Button>
            </Tooltip>
            <Tooltip title="island + 无边框" variant="island" bordered={false}>
                <Button size="small">island 无边框</Button>
            </Tooltip>
        </div>
    ),
};

// ── Multi-line title ───────────────────────────────────────────────────────

export const MultiLineTitle: Story = {
    args: {
        title: (
            <>
                集合啦！动物森友会
                <br />
                岛民们正在等你
                <br />
                喵喵村长欢迎你 🌴
            </>
        ),
        placement: 'bottom',
        children: <Button>多行提示内容</Button>,
    },
};

export const MultiLineTitleIsland: Story = {
    args: {
        title: (
            <>
                岛屿公告
                <br />
                今天天气晴朗，适合捕鱼
                <br />
                喵喵村长签名
            </>
        ),
        placement: 'bottom',
        variant: 'island',
        children: <Button size="small">island 多行提示</Button>,
    },
};
