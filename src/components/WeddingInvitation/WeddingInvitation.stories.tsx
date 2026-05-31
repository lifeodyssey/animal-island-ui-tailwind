import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { WeddingInvitation } from './WeddingInvitation';

const meta = {
    component: WeddingInvitation,
    tags: ['ai-generated'],
} satisfies Meta<typeof WeddingInvitation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };

export const NoLottery: Story = { args: { showLotteryNumber: false } };

export const CustomNames: Story = {
    args: { groomName: '小蓝', brideName: '小红', date: '2026.10.10' },
    play: async ({ canvas }) => {
        await expect(canvas.getByText('小蓝')).toBeVisible();
        await expect(canvas.getByText('小红')).toBeVisible();
        await expect(canvas.getByText('2026.10.10')).toBeVisible();
    },
};
