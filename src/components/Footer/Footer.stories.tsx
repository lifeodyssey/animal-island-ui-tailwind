import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Footer } from './Footer';

const meta = {
    component: Footer,
    tags: ['ai-generated'],
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { size: 24 },
};

export const SingleIcon: Story = {
    args: { name: 'Heart', size: 28 },
};

export const LargeIcons: Story = {
    args: { size: 36 },
};

export const SmallIcons: Story = {
    args: { size: 18 },
};

export const AllSurfaces: Story = {
    render: () => (
        <div style={{ display: 'grid', gap: 24 }}>
            {['#ffffff', '#fff9ed', '#e8f0e9'].map((background) => (
                <div key={background} style={{ background, paddingTop: 24 }}>
                    <Footer size={24} aria-hidden="true" />
                </div>
            ))}
        </div>
    ),
};
