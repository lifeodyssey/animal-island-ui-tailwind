import type { Meta, StoryObj } from '@storybook/react-vite';
import { TimePicker } from './TimePicker';

const meta = {
    component: TimePicker,
    tags: ['autodocs'],
    argTypes: {
        size: { control: 'radio', options: ['small', 'middle', 'large'], description: '尺寸' },
        status: { control: 'radio', options: [undefined, 'error', 'warning'], description: '校验状态' },
        disabled: { control: 'boolean', description: '禁用' },
        allowClear: { control: 'boolean', description: '允许清空' },
        format: { control: 'text', description: '展示格式' },
        hourStep: { control: 'number', description: '小时步进' },
        minuteStep: { control: 'number', description: '分钟步进' },
        secondStep: { control: 'number', description: '秒步进' },
    },
} satisfies Meta<typeof TimePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    name: '默认（时分秒）',
};

export const WithValue: Story = {
    args: { value: '09:30:00' },
    name: '受控值',
};

export const NoSeconds: Story = {
    args: { format: 'HH:mm' },
    name: '仅时分',
};

export const Large: Story = {
    args: { size: 'large' },
    name: '大尺寸',
};

export const Error: Story = {
    args: { status: 'error', value: '09:30:00' },
    name: '错误状态',
};

export const Disabled: Story = {
    args: { disabled: true, value: '09:30:00' },
    name: '禁用',
};

export const WithStep: Story = {
    args: { minuteStep: 15, secondStep: 30 },
    name: '步进',
};

export const AllowClear: Story = {
    args: { allowClear: true, defaultValue: '09:30:00' },
    name: '允许清空',
};
