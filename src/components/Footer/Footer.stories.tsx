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
    args: {},
};

export const SingleIcon: Story = {
    args: {
        name: 'Fish',
        size: 28,
    },
};

export const LargeIcons: Story = {
    args: {
        size: 36,
    },
};

export const AllTypes: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
                <p style={{ color: '#725d42', fontSize: 13, fontWeight: 700, marginBottom: 8 }}>All icons (default)</p>
                <Footer />
            </div>
            <div>
                <p style={{ color: '#725d42', fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Single icon repeat</p>
                <Footer name="Heart" size={28} />
            </div>
        </div>
    ),
};
