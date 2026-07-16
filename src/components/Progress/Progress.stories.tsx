import type { Meta, StoryObj } from '@storybook/react-vite';
import { Progress } from './Progress';
import type { ProgressSize } from './types';

const meta = {
    component: Progress,
    tags: ['ai-generated'],
    args: { percent: 60 },
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { percent: 60 },
};

export const Zero: Story = {
    args: { percent: 0 },
};

export const Complete: Story = {
    args: { percent: 100 },
};

export const InfoRight: Story = {
    args: { percent: 75, infoPosition: 'right' },
};

export const InfoTop: Story = {
    args: { percent: 42, infoPosition: 'top' },
};

export const InfoNone: Story = {
    args: { percent: 50, showInfo: false },
};

export const CustomFormat: Story = {
    args: { percent: 7, infoFormat: (p) => `${Math.round(p)}/10` },
};

const ALL_SIZES: ProgressSize[] = ['small', 'middle', 'large'];

export const AllSizes: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 320 }}>
            {ALL_SIZES.map((size) => (
                <Progress key={size} percent={60} size={size} />
            ))}
        </div>
    ),
};

export const LowPercentFallback: Story = {
    args: { percent: 5, infoPosition: 'inside' },
};

export const NoTransition: Story = {
    args: { percent: 80, duration: 0 },
};
