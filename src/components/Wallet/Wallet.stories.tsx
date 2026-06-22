import type { Meta, StoryObj } from '@storybook/react-vite';
import { Wallet, type WalletSize } from './Wallet';

const meta = {
    component: Wallet,
    tags: ['ai-generated'],
    args: { value: 12800 },
} satisfies Meta<typeof Wallet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { value: 12800 },
};

const ALL_SIZES: WalletSize[] = ['small', 'medium', 'large'];

export const Sizes: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: 32, alignItems: 'flex-end' }}>
            {ALL_SIZES.map((size, i) => (
                <div key={size} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                    <Wallet size={size} value={[1280, 12800, 128000][i]} />
                    <span style={{ fontSize: 12 }}>{size}</span>
                </div>
            ))}
        </div>
    ),
};

export const Placeholder: Story = {
    args: { value: undefined },
};

export const NoSeparator: Story = {
    args: { value: 1234567, thousandSeparator: '' },
};

export const StringValue: Story = {
    args: { value: '∞' },
};

export const CustomIcon: Story = {
    args: { value: 9999, icon: <span style={{ fontSize: 32 }}>💰</span> },
};
