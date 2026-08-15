import type { Meta, StoryObj } from '@storybook/react-vite';
import { TimePicker } from './TimePicker';

const meta = {
    component: TimePicker,
    tags: ['ui'],
    argTypes: {
        size: {
            control: 'select',
            options: ['small', 'middle', 'large'],
            description: '输入框尺寸',
            table: { defaultValue: { summary: 'middle' } },
        },
        status: {
            control: 'select',
            options: [undefined, 'error', 'warning'],
            description: '校验状态',
        },
        disabled: { control: 'boolean' },
        allowClear: { control: 'boolean' },
        placeholder: { control: 'text' },
        format: { control: 'text' },
        hourStep: { control: 'number' },
        minuteStep: { control: 'number' },
        secondStep: { control: 'number' },
    },
} satisfies Meta<typeof TimePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 基础时间选择器。 */
export const Default: Story = {};

/** 带默认值。 */
export const WithDefaultValue: Story = {
    args: { defaultValue: '09:30:00' },
};

/** 允许清空。 */
export const AllowClear: Story = {
    args: { defaultValue: '09:30:00', allowClear: true },
};

/** 大尺寸。 */
export const Large: Story = {
    args: { size: 'large' },
};

/** 仅时分（不显示秒列）。 */
export const HoursMinutes: Story = {
    args: { format: 'HH:mm', defaultValue: '09:30:00' },
};

/** 禁用状态。 */
export const Disabled: Story = {
    args: { disabled: true, defaultValue: '09:30:00' },
};

/** 错误状态。 */
export const Error: Story = {
    args: { status: 'error' },
};
