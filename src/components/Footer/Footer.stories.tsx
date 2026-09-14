import type { Meta, StoryObj } from '@storybook/react-vite';
import { Footer } from './Footer';

const meta = {
    component: Footer,
    tags: ['ai-generated'],
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {},
};

export const CustomSize: Story = {
    args: {
        size: 28,
    },
};

export const Filled: Story = {
    render: () => (
        <div style={{ background: '#f5f0e8', padding: '24px 0 0' }}>
            <Footer />
        </div>
    ),
};
