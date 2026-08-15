import type { Meta, StoryObj } from '@storybook/react-vite';
import { DatePicker } from './DatePicker';

const meta = {
    component: DatePicker,
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
        picker: {
            control: 'select',
            options: ['date', 'month'],
            description: '选择粒度',
            table: { defaultValue: { summary: 'date' } },
        },
        disabled: { control: 'boolean' },
        allowClear: { control: 'boolean' },
        showToday: { control: 'boolean' },
        range: { control: 'boolean' },
        placeholder: { control: 'text' },
    },
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 基础日期选择器。 */
export const Default: Story = {};

/** 带默认值的日期选择器。 */
export const WithDefaultValue: Story = {
    args: { defaultValue: '2026-08-15' },
};

/** 允许清空。 */
export const AllowClear: Story = {
    args: { defaultValue: '2026-08-15', allowClear: true },
};

/** 大尺寸。 */
export const Large: Story = {
    args: { size: 'large', defaultValue: '2026-08-15' },
};

/** 小尺寸。 */
export const Small: Story = {
    args: { size: 'small', defaultValue: '2026-08-15' },
};

/** 错误状态。 */
export const Error: Story = {
    args: { status: 'error' },
};

/** 禁用状态。 */
export const Disabled: Story = {
    args: { disabled: true, defaultValue: '2026-08-15' },
};

/** 月份选择模式。 */
export const MonthPicker: Story = {
    args: { picker: 'month' },
};

/** 范围选择模式（双面板）。 */
export const RangePicker: Story = {
    args: { range: true },
};
