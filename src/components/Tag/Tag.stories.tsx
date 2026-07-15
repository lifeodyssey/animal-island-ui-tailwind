import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tag } from './Tag';

const meta = {
    component: Tag,
    tags: ['ai-generated'],
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { children: '默认标签' } };

export const Solid: Story = { args: { children: '实心', variant: 'solid', color: 'app-pink' } };

export const Outlined: Story = { args: { children: '描边', variant: 'outlined', color: 'app-teal' } };

export const Dashed: Story = { args: { children: '虚线', variant: 'dashed', color: 'purple' } };

export const Sizes: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <Tag size="small" color="app-blue">Small</Tag>
            <Tag size="medium" color="app-blue">Medium</Tag>
            <Tag size="large" color="app-blue">Large</Tag>
        </div>
    ),
};

export const Closable: Story = {
    args: { children: '可关闭', closable: true, onClose: () => {} },
};

export const Clickable: Story = {
    args: { children: '可点击', onClick: () => {} },
};
