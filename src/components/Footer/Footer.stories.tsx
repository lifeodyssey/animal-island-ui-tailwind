import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Footer } from './Footer';

const meta = {
    component: Footer,
    tags: ['ai-generated'],
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Sea: Story = {
    args: {
        type: 'sea',
        children: '🌊 欢迎来到动物岛 · 海边脚注',
    },
};

export const Tree: Story = {
    args: {
        type: 'tree',
        children: '🌳 集合啦！动物森友会 · 树林脚注',
    },
};

export const AllTypes: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {(['sea', 'tree'] as const).map((type) => (
                <Footer key={type} type={type}>
                    {type === 'sea'
                        ? '🌊 海边的岛民们在此休憩'
                        : '🌳 树林里的喵喵向你问好'}
                </Footer>
            ))}
        </div>
    ),
};
