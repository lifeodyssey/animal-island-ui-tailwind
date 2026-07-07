import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Progress } from './Progress';

const meta = {
    component: Progress,
    tags: ['autodocs'],
    args: { percent: 0 },
    argTypes: {
        percent: { control: { type: 'range', min: 0, max: 100, step: 1 } },
        size: { control: 'select', options: ['small', 'middle', 'large'] },
        infoPosition: { control: 'select', options: ['inside', 'right', 'top'] },
        showInfo: { control: 'boolean' },
    },
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { percent: 60 },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const bar = canvas.getByRole('progressbar');
        await expect(bar).toHaveAttribute('aria-valuenow', '60');
        await expect(canvas.getByText('60%')).toBeInTheDocument();
    },
};

export const Sizes: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 320 }}>
            <Progress percent={70} size="small" />
            <Progress percent={70} size="middle" />
            <Progress percent={70} size="large" />
        </div>
    ),
};

export const InfoPositions: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 320 }}>
            <Progress percent={50} infoPosition="inside" />
            <Progress percent={50} infoPosition="right" />
            <Progress percent={50} infoPosition="top" />
        </div>
    ),
};

export const LowPercent: Story = {
    args: { percent: 10, infoPosition: 'inside' },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await expect(canvas.getByText('10%')).toBeInTheDocument();
    },
};

export const NoInfo: Story = {
    args: { percent: 80, showInfo: false },
};

export const CustomFormat: Story = {
    args: { percent: 42, infoFormat: (p) => `${Math.round(p)}/100` },
};
