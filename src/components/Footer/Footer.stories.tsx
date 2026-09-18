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
        text: 'All Rights Reserved.',
    },
};

export const CustomYear: Story = {
    args: {
        text: 'Animal Island Co., Ltd.',
        year: 2025,
    },
};

export const MinimalText: Story = {
    args: {
        text: '动物岛工作室',
    },
};
