import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Switch } from './Switch';

const meta = {
    component: Switch,
    tags: ['ai-generated'],
    // A switch with no visible text label needs an accessible name; demonstrate
    // the correct usage so the stories themselves pass axe button-name.
    args: { 'aria-label': '示例开关' },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Off: Story = { args: {} };
export const On: Story = { args: { defaultChecked: true } };
export const WithLabels: Story = {
    args: { defaultChecked: true, checkedChildren: '开', unCheckedChildren: '关' },
};

export const Toggle: Story = {
    args: {},
    play: async ({ canvas, userEvent }) => {
        const sw = canvas.getByRole('switch');
        await expect(sw).toHaveAttribute('aria-checked', 'false');
        await userEvent.click(sw);
        await expect(sw).toHaveAttribute('aria-checked', 'true');
    },
};

// ── Size variants ──────────────────────────────────────────────────────────────

export const Sizes: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <Switch size="small" defaultChecked aria-label="小尺寸开关" />
            <Switch size="default" defaultChecked aria-label="默认尺寸开关" />
        </div>
    ),
};

export const SizeSmall: Story = {
    args: { size: 'small', defaultChecked: true, 'aria-label': '小尺寸开关' },
};

export const SizeDefault: Story = {
    args: { size: 'default', defaultChecked: true, 'aria-label': '默认尺寸开关' },
};

// ── Disabled ──────────────────────────────────────────────────────────────────

export const Disabled: Story = {
    args: { disabled: true, 'aria-label': '禁用开关' },
};

export const DisabledChecked: Story = {
    args: { disabled: true, defaultChecked: true, 'aria-label': '禁用且已开' },
};

// ── Loading ───────────────────────────────────────────────────────────────────

export const Loading: Story = {
    args: { loading: true, 'aria-label': '加载中开关' },
};

export const LoadingChecked: Story = {
    args: { loading: true, defaultChecked: true, 'aria-label': '加载中且已开' },
};

// ── Checked / Unchecked (controlled) ─────────────────────────────────────────

export const Checked: Story = {
    args: { checked: true, 'aria-label': '受控已开' },
};

export const Unchecked: Story = {
    args: { checked: false, 'aria-label': '受控已关' },
};

// ── DefaultChecked (uncontrolled initial state) ───────────────────────────────

export const DefaultChecked: Story = {
    args: { defaultChecked: true, 'aria-label': '默认已开' },
};

export const DefaultUnchecked: Story = {
    args: { defaultChecked: false, 'aria-label': '默认已关' },
};

// ── CheckedChildren / UnCheckedChildren labels ────────────────────────────────

export const IslandLabels: Story = {
    args: {
        defaultChecked: true,
        checkedChildren: '岛民',
        unCheckedChildren: '离岛',
        'aria-label': '岛民状态开关',
    },
};

export const AllLabelsShowcase: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
            <Switch
                defaultChecked
                checkedChildren="集合啦"
                unCheckedChildren="散了吧"
                aria-label="集合啦开关"
            />
            <Switch
                defaultChecked={false}
                checkedChildren="喵喵"
                unCheckedChildren="汪汪"
                aria-label="动物开关"
            />
            <Switch
                size="small"
                defaultChecked
                checkedChildren="开"
                unCheckedChildren="关"
                aria-label="小尺寸标签开关"
            />
        </div>
    ),
};

// ── Controlled with React state ───────────────────────────────────────────────

export const ControlledToggle: Story = {
    render: () => {
        const [checked, setChecked] = useState(false);
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-start' }}>
                <Switch
                    checked={checked}
                    onChange={setChecked}
                    checkedChildren="岛上有你"
                    unCheckedChildren="离开了"
                    aria-label="受控状态开关"
                />
                <span style={{ fontSize: '12px', color: '#6b7280' }}>
                    当前状态：{checked ? '已开' : '已关'}
                </span>
            </div>
        );
    },
};
