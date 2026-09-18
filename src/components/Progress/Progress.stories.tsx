import type { Meta, StoryObj } from '@storybook/react-vite';
import { Progress } from './Progress';
import type { ProgressVariant } from './types';

const meta = {
    component: Progress,
    tags: ['ai-generated'],
    args: { percent: 60, duration: 0 },
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

const columnStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
    padding: '24px',
    width: 420,
};

const labelStyle: React.CSSProperties = {
    marginBottom: 8,
    fontSize: 12,
    color: '#7a6652',
    fontFamily: 'monospace',
};

export const Default: Story = {};

export const Sizes: Story = {
    render: () => (
        <div style={columnStyle}>
            {(['small', 'middle', 'large'] as const).map((size) => (
                <div key={size}>
                    <p style={labelStyle}>{size}</p>
                    <Progress percent={60} size={size} duration={0} aria-label={`${size} progress`} />
                </div>
            ))}
        </div>
    ),
};

export const InfoPositions: Story = {
    render: () => (
        <div style={columnStyle}>
            {(['inside', 'right', 'top'] as const).map((infoPosition) => (
                <div key={infoPosition}>
                    <p style={labelStyle}>{infoPosition}</p>
                    <Progress
                        percent={75}
                        infoPosition={infoPosition}
                        duration={0}
                        aria-label={`info ${infoPosition}`}
                    />
                </div>
            ))}
        </div>
    ),
};

const ALL_VARIANTS: ProgressVariant[] = ['sweet-corner', 'forest-grove', 'starry-camp', 'coffee-break'];

/** 场景插画填充变体：fill 用场景图从左到右揭示，百分比固定在右侧。 */
export const SceneVariants: Story = {
    render: () => (
        <div style={columnStyle}>
            {ALL_VARIANTS.map((variant) => (
                <div key={variant}>
                    <p style={labelStyle}>{variant}</p>
                    <Progress percent={60} variant={variant} duration={0} aria-label={variant} />
                </div>
            ))}
        </div>
    ),
};

export const NoInfo: Story = {
    args: { showInfo: false, percent: 45 },
};

export const Complete: Story = {
    args: { percent: 100 },
};
