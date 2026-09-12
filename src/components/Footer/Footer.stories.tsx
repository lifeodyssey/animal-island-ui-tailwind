import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Footer } from './Footer';

const meta = {
    component: Footer,
    tags: ['ai-generated'],
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const LargeIcons: Story = {
    args: {
        size: 36,
    },
};

export const SingleIcon: Story = {
    args: {
        name: 'Heart',
        size: 28,
    },
};

export const OnCream: Story = {
    render: () => (
        <div style={{ background: '#fff9ed', paddingTop: 24, paddingBottom: 8 }}>
            <Footer size={24} />
        </div>
    ),
};
