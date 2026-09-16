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
    args: {
        text: 'Animal Island. All Rights Reserved.',
    },
};

export const CustomYear: Story = {
    args: {
        year: 2020,
        text: 'Animal Island UI',
    },
};

export const CustomText: Story = {
    args: {
        text: '动物岛 · 版权所有',
    },
};

export const AllVariants: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, background: '#fff9ed', padding: 24 }}>
            <Footer text="Animal Island. All Rights Reserved." />
            <Footer year={2020} text="Animal Island UI" />
            <Footer text="动物岛 · 版权所有" />
        </div>
    ),
};
