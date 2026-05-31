import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Input } from './Input';

const meta = {
    component: Input,
    tags: ['ai-generated'],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = { args: { placeholder: 'Basic input' } };
export const WithPrefixSuffix: Story = {
    args: { placeholder: 'Search', prefix: '🔍', suffix: '⏎' },
};
export const ErrorStatus: Story = {
    args: { placeholder: 'Error', status: 'error', defaultValue: 'bad value' },
};

export const Typed: Story = {
    args: { placeholder: 'Type here' },
    play: async ({ canvas, userEvent }) => {
        const input = canvas.getByPlaceholderText('Type here') as HTMLInputElement;
        await userEvent.type(input, 'hello');
        await expect(input).toHaveValue('hello');
    },
};

// --- Sizes ---
export const Sizes: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {(['small', 'middle', 'large'] as const).map((size) => (
                <Input key={size} size={size} placeholder={`尺寸 ${size} — 集合啦动物森友会`} />
            ))}
        </div>
    ),
};

// --- Warning status ---
export const WarningStatus: Story = {
    args: { placeholder: '警告：岛民扰乱了南瓜节', status: 'warning', defaultValue: '喵喵!' },
};

// --- Disabled ---
export const Disabled: Story = {
    args: { placeholder: '禁止进岛', disabled: true, defaultValue: '无法编辑' },
};

// --- Shadow on / off ---
export const ShadowVariants: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Input shadow={true} placeholder="有阴影 — 岛民广场" />
            <Input placeholder="无阴影 — 沙滩集市" shadow={false} />
        </div>
    ),
};

// --- allowClear with value vs empty ---
export const AllowClearWithValue: Story = {
    args: { placeholder: '点 × 清除', allowClear: true, defaultValue: '可以清除这段话' },
};

export const AllowClearEmpty: Story = {
    args: { placeholder: '空值时不显示清除按钮', allowClear: true },
};

// --- Prefix and suffix ---
export const PrefixAndSuffix: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Input prefix="🌿" placeholder="搜索岛上植物" />
            <Input suffix="🐟" placeholder="搜索鱼类图鉴" />
            <Input prefix="🏝️" suffix="✉️" placeholder="发送邀请函给岛民" />
        </div>
    ),
};

// --- Controlled ---
export const Controlled: Story = {
    render: () => {
        const [value, setValue] = useState('集合啦！');
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <Input
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="受控输入框"
                    allowClear
                    onClear={() => setValue('')}
                />
                <span style={{ fontSize: 12, color: '#888' }}>
                    当前值：{value || '（空）'}
                </span>
            </div>
        );
    },
};

// --- Uncontrolled ---
export const Uncontrolled: Story = {
    args: { placeholder: '非受控输入框 — 岛民自由填写', defaultValue: '摇钱树' },
};
