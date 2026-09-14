import type { Meta, StoryObj } from '@storybook/react-vite';
import { Divider, type DividerType } from './Divider';

const meta = {
    component: Divider,
    tags: ['ai-generated'],
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { type: 'dashed-brown' },
};

export const Thin: Story = {
    args: { type: 'thin' },
};

export const Hairline: Story = {
    args: { type: 'hairline' },
};

export const WaveYellow: Story = {
    args: { type: 'wave-yellow' },
};

export const Squiggle: Story = {
    args: { type: 'squiggle' },
};

export const IconConnected: Story = {
    args: { icon: 'Fish' },
};

const ALL_TYPES: DividerType[] = [
    'dashed-brown',
    'thin',
    'hairline',
    'wave-yellow',
    'squiggle',
];

export const AllTypes: Story = {
    render: () => (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 24,
                padding: '24px',
                background: '#f5f0e8',
            }}
        >
            {ALL_TYPES.map((type) => (
                <div key={type}>
                    <p
                        style={{
                            marginBottom: 8,
                            fontSize: 12,
                            color: '#7a6652',
                            fontFamily: 'monospace',
                        }}
                    >
                        {type}
                    </p>
                    <Divider type={type} />
                </div>
            ))}
            <div>
                <p style={{ marginBottom: 8, fontSize: 12, color: '#7a6652', fontFamily: 'monospace' }}>
                    icon="Fish"
                </p>
                <Divider icon="Fish" iconSize={20} />
            </div>
        </div>
    ),
};
