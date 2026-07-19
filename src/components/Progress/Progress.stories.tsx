import type { Meta, StoryObj } from '@storybook/react-vite';
import { Progress } from './Progress';

const meta = {
    component: Progress,
    tags: ['ui'],
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { percent: 60, 'aria-label': 'Task progress' },
};

export const Small: Story = {
    args: { percent: 40, size: 'small', 'aria-label': 'Small progress' },
};

export const Large: Story = {
    args: { percent: 80, size: 'large', 'aria-label': 'Large progress' },
};

export const InfoRight: Story = {
    args: { percent: 55, infoPosition: 'right', 'aria-label': 'Right info' },
};

export const InfoTop: Story = {
    args: { percent: 70, infoPosition: 'top', 'aria-label': 'Top info' },
};

export const NoInfo: Story = {
    args: { percent: 30, showInfo: false, 'aria-label': 'No info' },
};

export const CustomFormat: Story = {
    args: {
        percent: 7,
        infoFormat: (p) => `${Math.round(p)}/10`,
        'aria-label': 'Custom format',
    },
};

export const Zero: Story = {
    args: { percent: 0, 'aria-label': 'Zero' },
};

export const Full: Story = {
    args: { percent: 100, 'aria-label': 'Complete' },
};
