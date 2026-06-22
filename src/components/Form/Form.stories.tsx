import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within, userEvent, waitFor } from 'storybook/test';
import { Form } from './Form';
import { useForm } from './useForm';
import type { FormInstance } from './types';
import { Input } from '../Input';
import { Select } from '../Select';
import { Radio } from '../Radio';
import { Checkbox } from '../Checkbox';

const meta = {
    title: 'Components/Form',
    component: Form,
    tags: ['ai-generated'],
} satisfies Meta<typeof Form>;

export default meta;
type Story = StoryObj<typeof meta>;

const fruitOptions = [
    { key: 'apple', label: '🍎 苹果' },
    { key: 'peach', label: '🍑 桃子' },
    { key: 'orange', label: '🍊 橘子' },
];

const hobbyOptions = [
    { label: '🎣 钓鱼', value: 'fishing' },
    { label: '🐛 捉虫', value: 'bug' },
    { label: '💐 种花', value: 'flower' },
];

const islandOptions = [
    { label: '🏝️ 无人岛', value: 'deserted' },
    { label: '🏘️ 主岛', value: 'main' },
];

// ============================================
// Layouts
// ============================================

export const Horizontal: Story = {
    render: () => (
        <Form layout="horizontal" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} style={{ maxWidth: 420 }}>
            <Form.Item label="岛民昵称" name="name">
                <Input placeholder="请输入昵称" />
            </Form.Item>
            <Form.Item label="喜欢的水果" name="fruit">
                <Select options={fruitOptions} placeholder="请选择" />
            </Form.Item>
        </Form>
    ),
};

export const Vertical: Story = {
    render: () => (
        <Form layout="vertical" style={{ maxWidth: 360 }}>
            <Form.Item label="岛民昵称" name="name">
                <Input placeholder="请输入昵称" />
            </Form.Item>
            <Form.Item label="爱好" name="hobby">
                <Checkbox options={hobbyOptions} />
            </Form.Item>
        </Form>
    ),
};

export const Inline: Story = {
    render: () => (
        <Form layout="inline">
            <Form.Item label="昵称" name="name">
                <Input placeholder="昵称" />
            </Form.Item>
            <Form.Item label="水果" name="fruit">
                <Select options={fruitOptions} placeholder="水果" />
            </Form.Item>
            <button type="submit">搜索</button>
        </Form>
    ),
};

// ============================================
// Label / required / colon
// ============================================

export const LabelOptions: Story = {
    render: () => (
        <Form requiredMark labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} style={{ maxWidth: 420 }}>
            <Form.Item label="必填项" name="a" required>
                <Input placeholder="带星号" />
            </Form.Item>
            <Form.Item label="无冒号项" name="b" colon={false}>
                <Input placeholder="无冒号" />
            </Form.Item>
        </Form>
    ),
};

// ============================================
// Validation
// ============================================

export const Validation: Story = {
    render: () => {
        const [result, setResult] = useState('');
        return (
            <Form
                layout="vertical"
                style={{ maxWidth: 360 }}
                onFinish={(values) => setResult('通过: ' + JSON.stringify(values))}
                onFinishFailed={() => setResult('校验失败')}
            >
                <Form.Item
                    label="昵称"
                    name="name"
                    rules={[{ required: true, message: '昵称必填' }]}
                >
                    <Input placeholder="必填" />
                </Form.Item>
                <Form.Item label="邮箱" name="email" rules={[{ type: 'email', message: '邮箱格式不对' }]}>
                    <Input placeholder="type=email" />
                </Form.Item>
                <Form.Item
                    label="年龄"
                    name="age"
                    rules={[{ type: 'integer', min: 0, max: 150, message: '0-150 整数' }]}
                >
                    <Input placeholder="min/max/integer" />
                </Form.Item>
                <Form.Item
                    label="邀请码"
                    name="code"
                    rules={[
                        { len: 6, message: '必须 6 位' },
                        {
                            validator: async (_r, value) => {
                                await new Promise((r) => setTimeout(r, 50));
                                if (value === '000000') throw new Error('该邀请码已失效');
                            },
                        },
                    ]}
                >
                    <Input placeholder="len + async custom" />
                </Form.Item>
                <button type="submit">提交</button>
                <div data-testid="validation-result">{result}</div>
            </Form>
        );
    },
};

// ============================================
// hasFeedback + help
// ============================================

export const FeedbackAndHelp: Story = {
    render: () => (
        <Form layout="vertical" style={{ maxWidth: 360 }}>
            <Form.Item
                label="带反馈图标"
                name="a"
                hasFeedback
                rules={[{ required: true, message: '必填，提交后显示 ✕' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item label="帮助文本" name="b" help="这是一段帮助说明">
                <Input />
            </Form.Item>
            <button type="submit">提交</button>
        </Form>
    ),
};

// ============================================
// Controlled instance + reset + onValuesChange
// ============================================

export const ControlledInstance: Story = {
    render: () => {
        const [form] = useForm<{ name: string; island: string }>();
        const [live, setLive] = useState<Record<string, unknown>>({});
        const [submitted, setSubmitted] = useState('');
        return (
            <div style={{ maxWidth: 360 }}>
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={{ name: '狸克', island: 'deserted' }}
                    onValuesChange={(_changed, all) => setLive(all)}
                    onFinish={(values) => setSubmitted(JSON.stringify(values))}
                >
                    <Form.Item label="昵称" name="name">
                        <Input />
                    </Form.Item>
                    <Form.Item label="岛屿类型" name="island">
                        <Radio options={islandOptions} />
                    </Form.Item>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <button type="submit">提交</button>
                        <button type="button" onClick={() => form.setFieldsValue({ name: '西施惠' })}>
                            实例改名
                        </button>
                        <button type="reset">重置</button>
                    </div>
                </Form>
                <pre data-testid="live-values" style={{ fontSize: 12 }}>
                    {JSON.stringify(live)}
                </pre>
                <pre data-testid="submitted" style={{ fontSize: 12 }}>
                    {submitted}
                </pre>
            </div>
        );
    },
};

// ============================================
// noStyle / hidden / disabled
// ============================================

export const StructuralOptions: Story = {
    render: () => (
        <Form layout="vertical" disabled style={{ maxWidth: 360 }}>
            <Form.Item label="禁用整表单" name="a">
                <Input defaultValue="不可编辑" />
            </Form.Item>
            <Form.Item name="hiddenField" hidden>
                <Input />
            </Form.Item>
            <Form.Item name="bare" noStyle>
                <Input placeholder="noStyle: 无 label/wrapper" />
            </Form.Item>
        </Form>
    ),
};

// ============================================
// Playwright parity (no play) — stable region for behavior spec
// ============================================

export const PlaywrightParity: Story = {
    render: () => {
        const [form] = useForm<{ name: string; email: string; fruit: string }>();
        const [submitted, setSubmitted] = useState('');
        const [failed, setFailed] = useState(false);
        return (
            <div data-testid="form-parity-region" style={{ maxWidth: 420 }}>
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={{ name: '' }}
                    onFinish={(values) => {
                        setFailed(false);
                        setSubmitted(JSON.stringify(values));
                    }}
                    onFinishFailed={() => setFailed(true)}
                >
                    <Form.Item
                        label="昵称"
                        name="name"
                        rules={[{ required: true, message: '昵称必填' }]}
                    >
                        <Input placeholder="昵称" />
                    </Form.Item>
                    <Form.Item label="邮箱" name="email" rules={[{ type: 'email', message: '邮箱格式不对' }]}>
                        <Input placeholder="邮箱" />
                    </Form.Item>
                    <Form.Item label="水果" name="fruit">
                        <Select options={fruitOptions} placeholder="请选择" />
                    </Form.Item>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <button type="submit">提交</button>
                        <button type="reset">重置</button>
                    </div>
                </Form>
                <div data-testid="parity-failed">{failed ? 'failed' : ''}</div>
                <div data-testid="parity-submitted">{submitted}</div>
            </div>
        );
    },
};

// ============================================
// Interaction test (play) — submit + validation + reset
// ============================================

export const SubmitFlow: Story = {
    render: () => {
        const [submitted, setSubmitted] = useState('');
        const [failed, setFailed] = useState(false);
        return (
            <Form
                layout="vertical"
                style={{ maxWidth: 360 }}
                onFinish={(values) => {
                    setFailed(false);
                    setSubmitted(JSON.stringify(values));
                }}
                onFinishFailed={() => setFailed(true)}
            >
                <Form.Item label="昵称" name="name" rules={[{ required: true, message: '昵称必填' }]}>
                    <Input placeholder="昵称" />
                </Form.Item>
                <button type="submit">提交</button>
                <div data-testid="play-failed">{failed ? 'failed' : ''}</div>
                <div data-testid="play-submitted">{submitted}</div>
            </Form>
        );
    },
    play: async ({ canvas }) => {
        const c = canvas as ReturnType<typeof within>;
        const user = userEvent.setup();

        // Submit empty → required error + onFinishFailed
        await user.click(c.getByText('提交'));
        await waitFor(() => expect(c.getByText('昵称必填')).toBeInTheDocument());
        await expect(c.getByTestId('play-failed')).toHaveTextContent('failed');

        // Fill and submit → onFinish with value
        const input = c.getByPlaceholderText('昵称') as HTMLInputElement;
        await user.type(input, '狸克');
        await user.click(c.getByText('提交'));
        await waitFor(() =>
            expect(c.getByTestId('play-submitted')).toHaveTextContent('{"name":"狸克"}')
        );
    },
};

export const InstanceApi: Story = {
    render: () => {
        const [form] = useForm();
        const [snapshot, setSnapshot] = useState('');
        const capture = (f: FormInstance) => setSnapshot(JSON.stringify(f.getFieldsValue(true)));
        return (
            <div style={{ maxWidth: 360 }}>
                <Form form={form} layout="vertical" initialValues={{ name: 'init' }}>
                    <Form.Item label="昵称" name="name">
                        <Input />
                    </Form.Item>
                </Form>
                <div style={{ display: 'flex', gap: 8 }}>
                    <button type="button" onClick={() => form.setFieldValue('name', 'set')}>
                        setFieldValue
                    </button>
                    <button type="button" onClick={() => form.resetFields()}>
                        resetFields
                    </button>
                    <button type="button" onClick={() => capture(form)}>
                        snapshot
                    </button>
                </div>
                <pre data-testid="api-snapshot" style={{ fontSize: 12 }}>
                    {snapshot}
                </pre>
            </div>
        );
    },
    play: async ({ canvas }) => {
        const c = canvas as ReturnType<typeof within>;
        const user = userEvent.setup();
        await user.click(c.getByText('setFieldValue'));
        await user.click(c.getByText('snapshot'));
        await waitFor(() => expect(c.getByTestId('api-snapshot')).toHaveTextContent('"name":"set"'));
        await user.click(c.getByText('resetFields'));
        await user.click(c.getByText('snapshot'));
        await waitFor(() => expect(c.getByTestId('api-snapshot')).toHaveTextContent('"name":"init"'));
    },
};
