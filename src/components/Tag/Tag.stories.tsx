import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Tag } from './Tag';

const meta = {
    component: Tag,
    tags: ['autodocs'],
    argTypes: {
        size: { control: 'select', options: ['small', 'medium', 'large'] },
        variant: { control: 'select', options: ['solid', 'outlined', 'dashed'] },
        color: {
            control: 'select',
            options: [
                'default', 'app-pink', 'purple', 'app-blue', 'app-yellow',
                'app-orange', 'app-teal', 'app-green', 'app-red',
                'lime-green', 'yellow-green', 'brown', 'warm-peach-pink',
            ],
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

export const Sizes: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <Tag size="small">小型</Tag>
            <Tag size="medium">中型</Tag>
            <Tag size="large">大型</Tag>
        </div>
    ),
};

export const Variants: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <Tag variant="solid">填充</Tag>
            <Tag variant="outlined">描边</Tag>
            <Tag variant="dashed">虚线</Tag>
        </div>
    ),
};

export const Colors: Story = {
    render: () => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {(['app-pink', 'purple', 'app-blue', 'app-yellow', 'app-orange', 'app-teal',
                'app-green', 'app-red', 'lime-green', 'yellow-green', 'brown', 'warm-peach-pink'] as const).map(
                (c) => (
                    <Tag key={c} color={c}>{c}</Tag>
                )
            )}
        </div>
    ),
};

export const Closable: Story = {
    args: { children: '可关闭', closable: true },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const closeBtn = canvas.getByRole('button', { name: 'close' });
        await expect(closeBtn).toBeInTheDocument();
    },
};

export const Clickable: Story = {
    args: { children: '可点击', onClick: () => {} },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const tag = canvas.getByRole('button');
        await expect(tag).toHaveClass('animal-tag-clickable');
    },
};

export const Disabled: Story = {
    args: { children: '禁用', disabled: true },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const tag = canvas.getByText('禁用').closest('.animal-tag') as HTMLElement;
        await expect(tag).toHaveClass('animal-tag-disabled');
    },
};
