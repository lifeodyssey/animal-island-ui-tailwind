import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Select } from './Select';
import type { SelectOption } from './Select';

const fruits: SelectOption[] = [
    { label: '🍎 苹果', key: 'apple' },
    { label: '🍊 橙子', key: 'orange' },
    { label: '🍐 梨子', key: 'pear' },
];

/** 岛民物品选项，包含空字符串 key 的「全部」选项 */
const islandItems: SelectOption[] = [
    { label: '（全部）', key: '' },
    { label: '🎣 钓鱼竿', key: 'rod' },
    { label: '🪲 捕虫网', key: 'net' },
    { label: '🌻 向日葵种子', key: 'seed' },
];

const meta = {
    component: Select,
    tags: ['ai-generated'],
    args: {
        options: fruits,
    },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── existing stories (kept as-is) ──────────────────────────────────────────

export const Placeholder: Story = { args: { options: fruits, placeholder: '选择水果' } };
export const Preselected: Story = { args: { options: fruits, defaultValue: 'orange' } };
export const Disabled: Story = {
    args: { options: fruits, defaultValue: 'apple', disabled: true },
};

export const OpensPortal: Story = {
    args: { options: fruits, placeholder: '选择水果' },
    play: async ({ canvas, canvasElement, userEvent }) => {
        const trigger = canvas.getByRole('combobox');
        await userEvent.click(trigger);
        const docBody = within(canvasElement.ownerDocument.body);
        const option = await docBody.findByRole('option', { name: /苹果/ });
        await expect(option).toHaveTextContent('苹果');
    },
};

// ── new stories ─────────────────────────────────────────────────────────────

/** 默认占位符：不传 placeholder，显示内置的「请选择」 */
export const DefaultPlaceholder: Story = {
    args: { options: fruits },
};

/** 非受控模式：只传 defaultValue，内部自行管理选中状态 */
export const Uncontrolled: Story = {
    args: { options: fruits, defaultValue: 'pear' },
};

/** 受控模式：父组件持有 value，通过 onChange 同步 */
export const Controlled: Story = {
    render: () => {
        const [val, setVal] = React.useState('orange');
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
                <Select options={fruits} value={val} onChange={setVal} />
                <span style={{ fontSize: 13, color: '#6b7280' }}>
                    当前选中：{val || '（无）'}
                </span>
            </div>
        );
    },
};

/** 空字符串 key：选项 key 为 "" 时应能正常选中并回调 */
export const EmptyStringKey: Story = {
    args: {
        options: islandItems,
        placeholder: '集合啦！选个物品',
    },
};

/** 空字符串 key 受控演示：选中「全部」后 onChange 收到 "" */
export const EmptyStringKeyControlled: Story = {
    render: () => {
        const [val, setVal] = React.useState<string>('');
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
                <Select
                    options={islandItems}
                    value={val}
                    onChange={setVal}
                    placeholder="集合啦！选个物品"
                />
                <span style={{ fontSize: 13, color: '#6b7280' }}>
                    onChange 收到的 key：<code>{JSON.stringify(val)}</code>
                </span>
            </div>
        );
    },
};

/** 下拉方向：内部固定使用 side="bottom"，此故事在页面底部渲染以展示 avoidCollisions 效果 */
export const DropdownPlacement: Story = {
    render: () => (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', minHeight: 200, paddingBottom: 8 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: 12, color: '#6b7280' }}>顶部（下拉向下）</span>
                <Select options={fruits} placeholder="喵喵，请选择～" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: 12, color: '#6b7280' }}>底部（avoidCollisions 上弹）</span>
                <Select options={fruits} placeholder="汪汪，请选择～" />
            </div>
        </div>
    ),
};
