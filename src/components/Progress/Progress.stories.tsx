import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { expect, within } from 'storybook/test';
import { Progress } from './Progress';

const meta = {
    title: 'Components/Progress',
    component: Progress,
    tags: ['autodocs'],
    parameters: { layout: 'padded' },
    argTypes: {
        percent: { control: { type: 'range', min: 0, max: 100 } },
        size: { control: 'select', options: ['small', 'middle', 'large'] },
        infoPosition: { control: 'select', options: ['inside', 'right', 'top'] },
        showInfo: { control: 'boolean' },
    },
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { percent: 42, 'aria-label': '任务进度' },
};

export const Sizes: Story = {
    name: 'Sizes',
    args: { percent: 65 },
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 400 }}>
            <Progress percent={65} size="small" aria-label="小尺寸" />
            <Progress percent={65} size="middle" aria-label="中尺寸" />
            <Progress percent={65} size="large" aria-label="大尺寸" />
        </div>
    ),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const bars = canvas.getAllByRole('progressbar');
        expect(bars).toHaveLength(3);
        expect(bars[0]).toHaveAttribute('aria-valuenow', '65');
    },
};

export const InfoPositions: Story = {
    name: 'Info Positions',
    args: { percent: 42 },
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 400 }}>
            <Progress percent={42} infoPosition="inside" aria-label="inside" />
            <Progress percent={42} infoPosition="right" aria-label="right" />
            <Progress percent={42} infoPosition="top" aria-label="top" />
        </div>
    ),
};

export const NoInfo: Story = {
    args: { percent: 70, showInfo: false, 'aria-label': '无文字进度' },
};
