import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Tabs } from './Tabs';
import type { TabItem } from './Tabs';

const items: TabItem[] = [
    { key: 'fish', label: '鱼类', children: <p>鲈鱼、鲷鱼…</p> },
    { key: 'bugs', label: '昆虫', children: <p>蝴蝶、瓢虫…</p> },
    { key: 'sea', label: '海洋生物', children: <p>海星、珊瑚…</p> },
];

const meta = {
    component: Tabs,
    tags: ['ai-generated'],
    args: { items },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { items, defaultActiveKey: 'fish' } };
export const NoShadow: Story = { args: { items, defaultActiveKey: 'fish', shadow: false } };
export const NoLeafAnimation: Story = {
    args: { items, defaultActiveKey: 'fish', leafAnimation: false },
};

export const TabChange: Story = {
    args: { items, defaultActiveKey: 'fish' },
    play: async ({ canvas, userEvent }) => {
        const bugsTab = canvas.getByRole('tab', { name: /昆虫/ });
        await expect(bugsTab).toHaveAttribute('aria-selected', 'false');
        await userEvent.click(bugsTab);
        await expect(bugsTab).toHaveAttribute('aria-selected', 'true');
    },
};

// ── shadow explicit variants ──────────────────────────────────────────────────

export const ShadowEnabled: Story = {
    args: { items, defaultActiveKey: 'fish', shadow: true },
};

// ── leafAnimation explicit variant ────────────────────────────────────────────

export const LeafAnimationEnabled: Story = {
    args: { items, defaultActiveKey: 'fish', leafAnimation: true },
};

// ── Uncontrolled with defaultActiveKey ────────────────────────────────────────

export const UncontrolledDefaultKey: Story = {
    args: { items, defaultActiveKey: 'sea' },
};

// ── Controlled (activeKey + onChange) ─────────────────────────────────────────

export const Controlled: Story = {
    render: () => {
        const [activeKey, setActiveKey] = useState('fish');
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <Tabs
                    items={items}
                    activeKey={activeKey}
                    onChange={setActiveKey}
                    aria-label="受控标签页"
                />
                <p style={{ fontSize: '12px', color: '#6b7280' }}>
                    当前选中：{activeKey}
                </p>
            </div>
        );
    },
};

// ── ReactNode label (emoji span) ──────────────────────────────────────────────

const emojiItems: TabItem[] = [
    {
        key: 'tomato',
        label: <span>🍅 番茄</span>,
        children: <p>集合啦！岛上的新鲜番茄刚刚收获。</p>,
    },
    {
        key: 'fish',
        label: <span>🐟 鱼类</span>,
        children: <p>喵喵～今天钓到了一条大鲷鱼！</p>,
    },
    {
        key: 'leaf',
        label: <span>🍃 树叶</span>,
        children: <p>岛民们在树荫下悠闲地聊天。</p>,
    },
];

export const ReactNodeLabel: Story = {
    args: { items: emojiItems, defaultActiveKey: 'tomato' },
};
