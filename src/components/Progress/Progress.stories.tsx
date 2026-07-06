import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Progress, type ProgressSize, type ProgressInfoPosition } from './Progress';

const meta = {
    component: Progress,
    tags: ['ai-generated'],
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { percent: 42 } };

export const Zero: Story = { args: { percent: 0 } };

export const Full: Story = { args: { percent: 100 } };

export const Sizes: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 400 }}>
            {(['small', 'middle', 'large'] as ProgressSize[]).map((s) => (
                <Progress key={s} percent={60} size={s} />
            ))}
        </div>
    ),
};

export const InfoPositions: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 400 }}>
            {(['inside', 'right', 'top'] as ProgressInfoPosition[]).map((pos) => (
                <div key={pos}>
                    <div style={{ marginBottom: 4, fontSize: 12, opacity: 0.6 }}>infoPosition={pos}</div>
                    <Progress percent={60} infoPosition={pos} />
                </div>
            ))}
        </div>
    ),
};

export const LowPercent: Story = {
    args: { percent: 10, infoPosition: 'inside' },
    play: async ({ canvasElement }) => {
        const info = canvasElement.querySelector('.animal-progress-info-inside') as HTMLElement;
        await expect(info).toBeInTheDocument();
        await expect(info).toHaveTextContent('10%');
    },
};

export const NoInfo: Story = { args: { percent: 70, showInfo: false } };

export const CustomFormat: Story = {
    args: { percent: 7, infoFormat: (p) => `${Math.round(p)}/10` },
};

export const ClassCheck: Story = {
    args: { percent: 55 },
    play: async ({ canvasElement }) => {
        const bar = canvasElement.querySelector('[role="progressbar"]') as HTMLElement;
        await expect(bar).toHaveAttribute('aria-valuenow', '55');
        await expect(bar).toHaveAttribute('aria-valuemin', '0');
        await expect(bar).toHaveAttribute('aria-valuemax', '100');
        const track = canvasElement.querySelector('.animal-progress-track') as HTMLElement;
        await expect(track).toBeInTheDocument();
        const fill = canvasElement.querySelector('.animal-progress-fill') as HTMLElement;
        await expect(fill).toBeInTheDocument();
    },
};
