import type { Meta, StoryObj } from '@storybook/react-vite';
import ComponentPage from '../demo/ComponentPage';

const meta = {
    title: 'Demo/基础组件',
    parameters: {
        layout: 'padded',
    },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

const renderDemoPage = (activeKey: string) => () => <ComponentPage activeKey={activeKey} />;

export const Button: Story = {
    name: 'Button 按钮',
    render: renderDemoPage('button'),
};

export const Input: Story = {
    name: 'Input 输入框',
    render: renderDemoPage('input'),
};

export const Switch: Story = {
    name: 'Switch 开关',
    render: renderDemoPage('switch'),
};

export const Card: Story = {
    name: 'Card 卡片',
    render: renderDemoPage('card'),
};

export const Collapse: Story = {
    name: 'Collapse 折叠面板',
    render: renderDemoPage('collapse'),
};

export const Cursor: Story = {
    name: 'Cursor 光标',
    render: renderDemoPage('cursor'),
};

export const Modal: Story = {
    name: 'Modal 弹窗',
    render: renderDemoPage('modal'),
};

export const Typewriter: Story = {
    name: 'Typewriter 打字机',
    render: renderDemoPage('typewriter'),
};

export const Divider: Story = {
    name: 'Divider 分割线',
    render: renderDemoPage('divider-comp'),
};

export const Icon: Story = {
    name: 'Icon 图标',
    render: renderDemoPage('icon'),
};

export const Select: Story = {
    name: 'Select 选择器',
    render: renderDemoPage('select'),
};

export const Checkbox: Story = {
    name: 'Checkbox 多选框',
    render: renderDemoPage('checkbox'),
};

export const Tabs: Story = {
    name: 'Tabs 标签页',
    render: renderDemoPage('tabs'),
};

export const Footer: Story = {
    name: 'Footer 页脚',
    render: renderDemoPage('footer'),
};

export const CodeBlock: Story = {
    name: 'CodeBlock 代码高亮',
    render: renderDemoPage('codeblock'),
};

export const Loading: Story = {
    name: 'Loading 加载',
    render: renderDemoPage('loading'),
};

export const Table: Story = {
    name: 'Table 表格',
    render: renderDemoPage('table'),
};
