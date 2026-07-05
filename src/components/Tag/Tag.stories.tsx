import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Tag, type TagColor, type TagVariant, type TagSize } from './Tag';

const meta = {
    component: Tag,
    tags: ['ai-generated'],
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { children: '标签' } };

export const Sizes: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {(['small', 'medium', 'large'] as TagSize[]).map((size) => (
                <Tag key={size} size={size}>{size}</Tag>
            ))}
        </div>
    ),
};

export const Variants: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: 8 }}>
            {(['solid', 'outlined', 'dashed'] as TagVariant[]).map((variant) => (
                <Tag key={variant} variant={variant}>{variant}</Tag>
            ))}
        </div>
    ),
};

export const Colors: Story = {
    render: () => {
        const colors: TagColor[] = [
            'default', 'app-pink', 'purple', 'app-blue', 'app-yellow',
            'app-orange', 'app-teal', 'app-green', 'app-red',
            'lime-green', 'yellow-green', 'brown', 'warm-peach-pink',
        ];
        return (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {colors.map((c) => <Tag key={c} color={c}>{c}</Tag>)}
            </div>
        );
    },
};

export const Closable: Story = {
    render: () => {
        const [visible, setVisible] = useState(true);
        return visible ? (
            <Tag closable onClose={() => setVisible(false)}>可关闭标签</Tag>
        ) : (
            <span style={{ color: '#999' }}>已关闭</span>
        );
    },
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
        await userEvent.click(tag);
    },
};

export const Disabled: Story = {
    args: { children: '禁用', disabled: true, closable: true },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const root = canvasElement.querySelector('.animal-tag') as HTMLElement;
        await expect(root).toHaveClass('animal-tag-disabled');
    },
};
