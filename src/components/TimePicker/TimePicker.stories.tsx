import type { Meta, StoryObj } from '@storybook/react-vite';
import { TimePicker } from './TimePicker';

const meta = {
    component: TimePicker,
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
        format: {
            control: 'select',
            options: ['HH:mm:ss', 'HH:mm'],
            description: '展示格式（包含 ss 时显示秒列）',
            table: { defaultValue: { summary: 'HH:mm:ss' } },
        },
        disabled: { control: 'boolean', description: '是否禁用' },
        allowClear: { control: 'boolean', description: '允许清空' },
        placeholder: { control: 'text' },
    },
} satisfies Meta<typeof TimePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 默认时间选择器 */
export const Default: Story = {};

/** 小尺寸 */
export const Small: Story = { args: { size: 'small' } };

/** 大尺寸 */
export const Large: Story = { args: { size: 'large' } };

/** 仅时分（不含秒列） */
export const HourMinute: Story = { args: { format: 'HH:mm' } };

/** 允许清空 */
export const AllowClear: Story = {
    args: { allowClear: true, defaultValue: '09:30:00' },
};

/** 禁用状态 */
export const Disabled: Story = { args: { disabled: true } };

/** 错误状态 */
export const ErrorStatus: Story = { args: { status: 'error' } };

/** 带默认值 */
export const WithDefaultValue: Story = {
    args: { defaultValue: '09:30:00', allowClear: true },
};
