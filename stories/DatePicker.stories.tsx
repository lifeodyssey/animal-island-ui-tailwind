import type { Meta, StoryObj } from '@storybook/react-vite';
import { DatePicker } from '../src/components/DatePicker';

const meta = {
    component: DatePicker,
    tags: ['autodocs'],
    argTypes: {
        size: {
            control: 'select',
            options: ['small', 'middle', 'large'],
            description: '触发区尺寸',
            table: { defaultValue: { summary: 'middle' } },
        },
        status: {
            control: 'select',
            options: [undefined, 'error', 'warning'],
            description: '校验状态',
        },
        range: {
            control: 'boolean',
            description: '是否为范围选择模式',
            table: { defaultValue: { summary: 'false' } },
        },
        disabled: {
            control: 'boolean',
            description: '是否禁用',
            table: { defaultValue: { summary: 'false' } },
        },
        allowClear: {
            control: 'boolean',
            description: '是否允许清除',
            table: { defaultValue: { summary: 'false' } },
        },
        showToday: {
            control: 'boolean',
            description: '是否显示「今天」快捷按钮',
            table: { defaultValue: { summary: 'true' } },
        },
        format: {
            control: 'text',
            description: '展示格式，支持 YYYY / MM / DD / M / D 占位符',
            table: { defaultValue: { summary: 'YYYY-MM-DD' } },
        },
        placeholder: {
            control: 'text',
            description: '占位文本',
        },
    },
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 默认单日期选择器 */
export const Default: Story = {};

/** 预设初始值 */
export const WithValue: Story = {
    args: { defaultValue: '2026-08-10' },
};

/** 允许清除 */
export const AllowClear: Story = {
    args: { defaultValue: '2026-08-10', allowClear: true },
};

/** 错误状态 */
export const StatusError: Story = {
    args: { status: 'error' },
};

/** 警告状态 */
export const StatusWarning: Story = {
    args: { status: 'warning' },
};

/** 小尺寸 */
export const SizeSmall: Story = {
    args: { size: 'small', defaultValue: '2026-08-10' },
};

/** 大尺寸 */
export const SizeLarge: Story = {
    args: { size: 'large', defaultValue: '2026-08-10' },
};

/** 禁用状态 */
export const Disabled: Story = {
    args: { disabled: true, defaultValue: '2026-08-10' },
};

/** 自定义格式 */
export const CustomFormat: Story = {
    args: { defaultValue: '2026-08-10', format: 'YYYY年MM月DD日' },
};

/** 范围选择模式 */
export const Range: Story = {
    args: { range: true, defaultValue: ['2026-08-10', '2026-08-20'] },
};

/** 范围模式允许清除 */
export const RangeAllowClear: Story = {
    args: { range: true, defaultValue: ['2026-08-10', '2026-08-20'], allowClear: true },
};
