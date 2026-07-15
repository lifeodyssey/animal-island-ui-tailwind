import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Progress } from './Progress';

const meta = {
    component: Progress,
    tags: ['ai-generated'],
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { percent: 60 } };

export const Small: Story = { args: { percent: 40, size: 'small' } };

export const Large: Story = { args: { percent: 80, size: 'large' } };

export const InfoInside: Story = { args: { percent: 70, size: 'large', infoPosition: 'inside' } };

export const InfoTop: Story = { args: { percent: 55, infoPosition: 'top' } };

export const NoInfo: Story = { args: { percent: 50, showInfo: false } };

export const CustomColor: Story = { args: { percent: 65, strokeColor: '#b77dee' } };

export const Sizes: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 400 }}>
            <Progress percent={30} size="small" />
            <Progress percent={60} size="middle" />
            <Progress percent={90} size="large" />
        </div>
    ),
};
