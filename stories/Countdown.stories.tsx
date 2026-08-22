import type { Meta, StoryObj } from '@storybook/react';
import { Countdown } from '../src';

const meta = {
    title: 'Components/Countdown',
    component: Countdown,
    parameters: { layout: 'centered' },
    tags: ['autodocs'],
} satisfies Meta<typeof Countdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        value: Date.now() + 60_000,
    },
};

export const Island: Story = {
    args: {
        value: Date.now() + 3600_000,
        variant: 'island',
        prefix: '活动结束还有',
        format: 'HH:mm:ss',
    },
};

export const WithDays: Story = {
    args: {
        value: Date.now() + 90_000_000,
        format: 'DD 天 HH:mm:ss',
        size: 'large',
        prefix: '距离出发',
    },
};

export const Small: Story = {
    args: {
        value: Date.now() + 120_000,
        size: 'small',
    },
};

export const Large: Story = {
    args: {
        value: Date.now() + 120_000,
        size: 'large',
    },
};
