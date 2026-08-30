import type { Meta, StoryObj } from '@storybook/react-vite';
import { Countdown } from './Countdown';

const meta = {
    component: Countdown,
    tags: ['autodocs'],
    argTypes: {
        value: { control: false, description: '结束时间（时间戳或 Date）' },
        format: { control: 'text', description: '格式模板，支持 DD/HH/mm/ss', defaultValue: { summary: 'HH:mm:ss' } },
        size: { control: 'select', options: ['small', 'middle', 'large'], description: '尺寸' },
        variant: { control: 'select', options: ['default', 'island'], description: '风格变体' },
        bordered: { control: 'boolean', description: '数字块带边框' },
        prefix: { control: 'text', description: '前缀内容' },
    },
} satisfies Meta<typeof Countdown>;

export default meta;
type Story = StoryObj<typeof meta>;

const oneHourFromNow = () => Date.now() + 3_600_000;

export const Default: Story = {
    args: { value: oneHourFromNow(), format: 'HH:mm:ss' },
    name: '默认（HH:mm:ss）',
};

export const WithDays: Story = {
    args: { value: oneHourFromNow() + 86_400_000, format: 'DD 天 HH:mm:ss', prefix: '活动结束还有' },
    name: '带天数和前缀',
};

export const Island: Story = {
    args: { value: oneHourFromNow(), variant: 'island', bordered: true, format: 'HH:mm:ss' },
    name: 'Island 风格（带边框）',
};

export const Small: Story = {
    args: { value: oneHourFromNow(), size: 'small' },
    name: '小尺寸',
};

export const Large: Story = {
    args: { value: oneHourFromNow(), size: 'large' },
    name: '大尺寸',
};

export const Finished: Story = {
    args: { value: Date.now() - 1_000, format: 'HH:mm:ss' },
    name: '已结束（归零）',
};
