import type { Meta, StoryObj } from '@storybook/react-vite';
import { Background, type BackgroundType } from './Background';

const meta = {
    component: Background,
    tags: ['ai-generated'],
} satisfies Meta<typeof Background>;

export default meta;
type Story = StoryObj<typeof meta>;

const boxStyle: React.CSSProperties = { height: 200, width: '100%' };

const labelStyle: React.CSSProperties = {
    marginBottom: 8,
    fontSize: 12,
    color: '#7a6652',
    fontFamily: 'monospace',
};

export const Default: Story = {
    render: () => <Background style={boxStyle} />,
};

export const Grid: Story = {
    render: () => <Background type="grid" style={boxStyle} />,
};

export const DotsDarkGreen: Story = {
    render: () => <Background type="dots-dark-green" style={boxStyle} />,
};

export const Sprinkles: Story = {
    render: () => <Background type="sprinkles" style={boxStyle} />,
};

export const SweetCorner: Story = {
    render: () => <Background type="sweet-corner" style={boxStyle} />,
};

export const CoffeeBreak: Story = {
    render: () => <Background type="coffee-break" style={boxStyle} />,
};

const DOTS_COLORS: BackgroundType[] = [
    'dots-pink',
    'dots-purple',
    'dots-blue',
    'dots-yellow',
    'dots-orange',
    'dots-teal',
    'dots-green',
    'dots-red',
    'dots-lime-green',
    'dots-yellow-green',
    'dots-brown',
    'dots-warm-peach-pink',
];

/** 12 种 dots-* 彩色波点，底色与 Card pattern-* 系列一致。 */
export const AllDotsColors: Story = {
    render: () => (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 16,
                padding: 24,
            }}
        >
            {DOTS_COLORS.map((type) => (
                <div key={type}>
                    <p style={labelStyle}>{type}</p>
                    <Background type={type} style={{ height: 120 }} />
                </div>
            ))}
        </div>
    ),
};
