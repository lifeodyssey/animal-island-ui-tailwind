import type { Meta, StoryObj } from '@storybook/react';
import { DatePicker } from '../src';

const meta = {
    title: 'Components/DatePicker',
    component: DatePicker,
    parameters: { layout: 'centered' },
    tags: ['autodocs'],
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {},
};

export const WithValue: Story = {
    args: {
        value: '2026-08-22',
    },
};

export const Large: Story = {
    args: {
        size: 'large',
        placeholder: '选择大尺寸日期',
    },
};

export const Small: Story = {
    args: {
        size: 'small',
        placeholder: '选择小尺寸日期',
    },
};

export const ErrorStatus: Story = {
    args: {
        status: 'error',
        placeholder: '校验错误状态',
    },
};

export const AllowClear: Story = {
    args: {
        defaultValue: '2026-08-10',
        allowClear: true,
    },
};

export const MonthPicker: Story = {
    args: {
        picker: 'month',
        placeholder: '选择月份',
    },
};

export const Range: Story = {
    args: {
        range: true,
        placeholder: '选择日期范围',
    },
};

export const Disabled: Story = {
    args: {
        disabled: true,
        defaultValue: '2026-08-10',
    },
};
