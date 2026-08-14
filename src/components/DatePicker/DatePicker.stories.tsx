import type { Meta, StoryObj } from '@storybook/react-vite';
import { DatePicker } from './DatePicker';

const meta = {
    component: DatePicker,
    tags: ['autodocs'],
    argTypes: {
        size: {
            control: 'select',
            options: ['small', 'middle', 'large'],
            description: '尺寸',
            table: { defaultValue: { summary: 'middle' } },
        },
        status: {
            control: 'select',
            options: [undefined, 'error', 'warning'],
            description: '校验状态',
        },
        range: { control: 'boolean', description: '范围选择模式' },
        disabled: { control: 'boolean', description: '是否禁用' },
        allowClear: { control: 'boolean', description: '允许清空' },
        showToday: { control: 'boolean', description: '显示今天按钮' },
        placeholder: { control: 'text' },
        format: { control: 'text' },
    },
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 默认日期选择器 */
export const Default: Story = {};

/** 小尺寸 */
export const Small: Story = { args: { size: 'small' } };

/** 大尺寸 */
export const Large: Story = { args: { size: 'large' } };

/** 允许清空 */
export const AllowClear: Story = {
    args: { allowClear: true, defaultValue: '2026-08-14' },
};

/** 禁用状态 */
export const Disabled: Story = { args: { disabled: true } };

/** 错误状态 */
export const ErrorStatus: Story = { args: { status: 'error' } };

/** 警告状态 */
export const WarningStatus: Story = { args: { status: 'warning' } };

/** 范围选择模式 */
export const Range: Story = { args: { range: true } };

/** 带默认值 */
export const WithDefaultValue: Story = {
    args: { defaultValue: '2026-08-14', allowClear: true },
};
