import type { Meta, StoryObj } from '@storybook/react-vite';
import { DatePicker } from './DatePicker';

const meta = {
    component: DatePicker,
    tags: ['autodocs'],
    argTypes: {
        range: { control: 'boolean', description: '范围选择模式' },
        picker: { control: 'radio', options: ['date', 'month'], description: '选择粒度' },
        size: { control: 'radio', options: ['small', 'middle', 'large'], description: '尺寸' },
        status: { control: 'radio', options: [undefined, 'error', 'warning'], description: '校验状态' },
        disabled: { control: 'boolean', description: '禁用' },
        allowClear: { control: 'boolean', description: '允许清空' },
        showToday: { control: 'boolean', description: '显示今天按钮' },
    },
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    name: '默认（日期选择）',
};

export const WithValue: Story = {
    args: { value: '2026-08-10' },
    name: '受控值',
};

export const Range: Story = {
    args: { range: true, defaultValue: ['2026-08-10', '2026-08-20'] },
    name: '范围选择',
};

export const MonthPicker: Story = {
    args: { picker: 'month' },
    name: '月份选择',
};

export const Large: Story = {
    args: { size: 'large' },
    name: '大尺寸',
};

export const Error: Story = {
    args: { status: 'error', value: '2026-08-10' },
    name: '错误状态',
};

export const Disabled: Story = {
    args: { disabled: true, value: '2026-08-10' },
    name: '禁用',
};

export const AllowClear: Story = {
    args: { allowClear: true, defaultValue: '2026-08-10' },
    name: '允许清空',
};
