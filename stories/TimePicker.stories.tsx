import type { Meta, StoryObj } from '@storybook/react';
import { TimePicker } from '../src';

const meta = {
    title: 'Components/TimePicker',
    component: TimePicker,
    parameters: { layout: 'centered' },
    tags: ['autodocs'],
} satisfies Meta<typeof TimePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {},
};

export const WithValue: Story = {
    args: {
        value: '09:30:00',
    },
};

export const Large: Story = {
    args: {
        size: 'large',
        placeholder: '选择大尺寸时间',
    },
};

export const Small: Story = {
    args: {
        size: 'small',
        placeholder: '选择小尺寸时间',
    },
};

export const ErrorStatus: Story = {
    args: {
        status: 'error',
        placeholder: '校验错误状态',
    },
};

export const NoSeconds: Story = {
    args: {
        format: 'HH:mm',
        placeholder: '选择时分',
    },
};

export const WithStep: Story = {
    args: {
        minuteStep: 15,
        secondStep: 30,
        placeholder: '步进选择',
    },
};

export const AllowClear: Story = {
    args: {
        defaultValue: '08:00:00',
        allowClear: true,
    },
};

export const Disabled: Story = {
    args: {
        disabled: true,
        value: '09:00:00',
    },
};
