import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { expect, within } from 'storybook/test';
import { Tag } from './Tag';

const meta = {
    title: 'Components/Tag',
    component: Tag,
    tags: ['autodocs'],
    parameters: { layout: 'padded' },
    argTypes: {
        size: { control: 'select', options: ['small', 'medium', 'large'] },
        variant: { control: 'select', options: ['solid', 'outlined', 'dashed', 'soft'] },
        color: {
            control: 'select',
            options: ['default', 'app-pink', 'purple', 'app-blue', 'app-yellow', 'app-orange', 'app-teal', 'app-green', 'app-red', 'lime-green', 'yellow-green', 'brown', 'warm-peach-pink'],
        },
        closable: { control: 'boolean' },
        disabled: { control: 'boolean' },
    },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { children: '标签' },
};

export const SoftVariant: Story = {
    name: 'Soft (default)',
    render: () => (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Tag>默认</Tag>
            <Tag color="app-pink">粉色</Tag>
            <Tag color="purple">紫色</Tag>
            <Tag color="app-blue">蓝色</Tag>
            <Tag color="app-teal">青色</Tag>
            <Tag color="app-green">绿色</Tag>
            <Tag color="app-red">红色</Tag>
        </div>
    ),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const tags = canvas.getAllByText(/色/);
        expect(tags.length).toBeGreaterThan(0);
        expect(tags[0].closest('.animal-tag')).not.toBeNull();
    },
};

export const SolidVariant: Story = {
    name: 'Solid',
    render: () => (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Tag variant="solid">默认</Tag>
            <Tag variant="solid" color="app-pink">粉色</Tag>
            <Tag variant="solid" color="purple">紫色</Tag>
            <Tag variant="solid" color="app-teal">青色</Tag>
        </div>
    ),
};

export const Sizes: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <Tag size="small">小</Tag>
            <Tag size="medium">中</Tag>
            <Tag size="large">大</Tag>
        </div>
    ),
};

export const Closable: Story = {
    render: () => <Tag closable>可关闭</Tag>,
};
