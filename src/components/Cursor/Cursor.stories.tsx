import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Cursor } from './Cursor';

const meta = {
    component: Cursor,
    tags: ['ai-generated'],
} satisfies Meta<typeof Cursor>;

export default meta;
type Story = StoryObj<typeof meta>;

/** forceAll=true（默认）：所有后代统一使用自定义光标，悬停整个区域可看到效果。 */
export const ForceAllTrue: Story = {
    args: { forceAll: true },
    render: (args) => (
        <Cursor {...args} style={{ padding: '2rem', border: '2px dashed #b5a28a', borderRadius: '12px', display: 'inline-block' }}>
            <p style={{ color: '#6b4f3a', marginBottom: '0.75rem', fontWeight: 600 }}>🌿 集合啦！动物森友会</p>
            <button style={{ marginRight: '0.5rem', padding: '0.4rem 1rem', borderRadius: '9999px', border: '1px solid #6b4f3a', background: '#fffbe8', color: '#6b4f3a', cursor: 'inherit' }}>
                与岛民聊天
            </button>
            <a href="#" style={{ color: '#3dbda7' }}>前往集市 →</a>
        </Cursor>
    ),
};

/** forceAll=false（scoped）：仅容器使用自定义光标，按钮和链接等交互元素保留语义光标（pointer）。 */
export const ForceAllFalse: Story = {
    args: { forceAll: false },
    render: (args) => (
        <Cursor {...args} style={{ padding: '2rem', border: '2px dashed #3dbda7', borderRadius: '12px', display: 'inline-block' }}>
            <p style={{ color: '#6b4f3a', marginBottom: '0.75rem', fontWeight: 600 }}>🐱 喵喵岛の集市</p>
            <button style={{ marginRight: '0.5rem', padding: '0.4rem 1rem', borderRadius: '9999px', border: '1px solid #3dbda7', background: '#eafaf7', color: '#3dbda7' }}>
                购买家具
            </button>
            <a href="#" style={{ color: '#b5a28a' }}>查看岛民名单 →</a>
            <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#9e8c7a' }}>
                （悬停按钮 / 链接时光标恢复为 pointer）
            </p>
        </Cursor>
    ),
};
