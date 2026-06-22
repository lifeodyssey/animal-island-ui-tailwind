import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, act, cleanup } from '@testing-library/react';
import { useEffect } from 'react';
import { Form, type FormInstance } from './index';
import type { RuleObject } from './types';
import { Input } from '../Input';

/**
 * Form unit tests. Source of truth: upstream guokaigdg/animal-island-ui
 * Form.test.tsx. Behavior is ported verbatim; the only fork adaptation is the
 * stable `animal-form*` class names (upstream keyed off CSS-module hashes).
 *
 * jsdom + RTL — runs under the `unit` vitest project (*.test.tsx is matched by
 * an explicit include glob added for Form, see note in the PR description).
 */
describe('Form', () => {
    // The unit vitest project has no global setup that auto-cleans the DOM
    // between tests, so unmount each render explicitly to avoid duplicate roles.
    afterEach(() => {
        cleanup();
    });

    describe('基础渲染', () => {
        it('渲染为 <form> 元素', () => {
            const { container } = render(
                <Form>
                    <Form.Item label="姓名" name="name">
                        <Input />
                    </Form.Item>
                </Form>
            );
            expect(container.querySelector('form')).toBeTruthy();
        });

        it('Form.Item 无 name 时也支持（展示用）', () => {
            render(
                <Form>
                    <Form.Item label="展示项">纯文本</Form.Item>
                </Form>
            );
            expect(screen.getByText('展示项')).toBeTruthy();
        });

        it('hidden 的 Form.Item 不渲染 DOM', () => {
            const { container } = render(
                <Form>
                    <Form.Item name="hidden" hidden>
                        <Input />
                    </Form.Item>
                </Form>
            );
            expect(container.querySelector('[data-field-name="hidden"]')).toBeNull();
        });
    });

    describe('布局', () => {
        it('layout=vertical 应用 animal-form-vertical 类', () => {
            const { container } = render(
                <Form layout="vertical">
                    <Form.Item label="v" name="v">
                        <Input />
                    </Form.Item>
                </Form>
            );
            expect(container.querySelector('.animal-form-vertical')).toBeTruthy();
        });

        it('layout=horizontal 应用 animal-form-horizontal 类', () => {
            const { container } = render(
                <Form layout="horizontal">
                    <Form.Item label="h" name="h">
                        <Input />
                    </Form.Item>
                </Form>
            );
            expect(container.querySelector('.animal-form-horizontal')).toBeTruthy();
        });

        it('layout=inline 应用 animal-form-inline 类', () => {
            const { container } = render(
                <Form layout="inline">
                    <Form.Item label="i" name="i">
                        <Input />
                    </Form.Item>
                </Form>
            );
            expect(container.querySelector('.animal-form-inline')).toBeTruthy();
        });

        it('size=small 应用 animal-form-small 类', () => {
            const { container } = render(
                <Form size="small">
                    <Form.Item name="s">
                        <Input />
                    </Form.Item>
                </Form>
            );
            expect(container.querySelector('.animal-form-small')).toBeTruthy();
        });
    });

    describe('字段 store / 命令式 API', () => {
        it('回归: setFieldsValue 嵌套对象应展开为 dot-path', () => {
            let formRef: FormInstance | null = null;
            function Bind() {
                const [form] = Form.useForm();
                formRef = form;
                return null;
            }
            render(<Bind />);
            formRef!.setFieldsValue({ user: { name: 'tom', age: 18 } });
            expect(formRef!.getFieldValue(['user', 'name'])).toBe('tom');
            expect(formRef!.getFieldValue(['user', 'age'])).toBe(18);
        });

        it('回归: setFieldsValue 数组值当 leaf，不递归', () => {
            let formRef: FormInstance | null = null;
            function Bind() {
                const [form] = Form.useForm();
                formRef = form;
                return null;
            }
            render(<Bind />);
            formRef!.setFieldsValue({ tags: ['a', 'b'] } as never);
            expect(formRef!.getFieldValue('tags')).toEqual(['a', 'b']);
        });

        it('回归: FormItem name=["user","name"] + 嵌套 initialValues 渲染出值', () => {
            const { container } = render(
                <Form initialValues={{ user: { name: 'tom' } }}>
                    <Form.Item name={['user', 'name']}>
                        <Input />
                    </Form.Item>
                </Form>
            );
            expect((container.querySelector('input') as HTMLInputElement).value).toBe('tom');
        });

        it('受控 form 实例 + setFieldsValue 同步到 Input', () => {
            function Host() {
                const [form] = Form.useForm();
                return (
                    <>
                        <button type="button" onClick={() => form.setFieldsValue({ a: '1' })}>
                            set
                        </button>
                        <Form form={form}>
                            <Form.Item name="a">
                                <Input />
                            </Form.Item>
                        </Form>
                    </>
                );
            }
            render(<Host />);
            const input = screen.getByRole('textbox') as HTMLInputElement;
            expect(input.value).toBe('');
            act(() => {
                fireEvent.click(screen.getByText('set'));
            });
            expect(input.value).toBe('1');
        });

        it('resetFields 把值还原到 initialValues', async () => {
            function Host() {
                const [form] = Form.useForm();
                return (
                    <>
                        <button type="button" onClick={() => form.resetFields()}>
                            reset
                        </button>
                        <button type="button" onClick={() => form.setFieldsValue({ a: 'dirty' })}>
                            dirty
                        </button>
                        <Form form={form} initialValues={{ a: 'init' }}>
                            <Form.Item name="a">
                                <Input />
                            </Form.Item>
                        </Form>
                    </>
                );
            }
            render(<Host />);
            const input = screen.getByRole('textbox') as HTMLInputElement;
            await act(async () => {
                fireEvent.click(screen.getByText('dirty'));
            });
            expect(input.value).toBe('dirty');
            await act(async () => {
                fireEvent.click(screen.getByText('reset'));
            });
            expect(input.value).toBe('init');
        });

        it('isFieldTouched / setFieldValue 标记 touched', () => {
            let formRef: FormInstance | null = null;
            function Bind() {
                const [form] = Form.useForm();
                formRef = form;
                return null;
            }
            render(<Bind />);
            expect(formRef!.isFieldTouched('a')).toBe(false);
            formRef!.setFieldValue('a', 'x');
            expect(formRef!.isFieldTouched('a')).toBe(true);
        });

        it('getFieldsValue(true) 包含未注册字段', () => {
            let formRef: FormInstance | null = null;
            function Bind() {
                const [form] = Form.useForm();
                formRef = form;
                return null;
            }
            render(<Bind />);
            formRef!.setFieldsValue({ registered: 1, unregistered: 2 });
            expect(formRef!.getFieldsValue(true)).toEqual({ registered: 1, unregistered: 2 });
        });

        it('getFieldsValue(nameList) 只取指定字段', () => {
            let formRef: FormInstance | null = null;
            function Bind() {
                const [form] = Form.useForm();
                formRef = form;
                return null;
            }
            render(<Bind />);
            formRef!.setFieldsValue({ a: 1, b: 2, c: 3 });
            expect(formRef!.getFieldsValue(['a', 'c'])).toEqual({ a: 1, c: 3 });
        });

        it('setFields 设置错误信息显示并标记 touched', async () => {
            function Host() {
                const [form] = Form.useForm();
                return (
                    <>
                        <button
                            type="button"
                            onClick={() => form.setFields([{ name: 'a', errors: ['服务器报错'], touched: true }])}
                        >
                            setErr
                        </button>
                        <Form form={form}>
                            <Form.Item name="a">
                                <Input />
                            </Form.Item>
                        </Form>
                    </>
                );
            }
            render(<Host />);
            await act(async () => {
                fireEvent.click(screen.getByText('setErr'));
            });
            expect(screen.getByText('服务器报错')).toBeTruthy();
        });

        it('getFieldError 返回字段错误', async () => {
            let formRef: FormInstance | null = null;
            function Host() {
                const [form] = Form.useForm();
                formRef = form;
                return (
                    <Form form={form}>
                        <Form.Item name="a" rules={[{ required: true, message: 'a!' }]}>
                            <Input />
                        </Form.Item>
                    </Form>
                );
            }
            render(<Host />);
            await act(async () => {
                await formRef!.validateFields().catch(() => undefined);
            });
            expect(formRef!.getFieldError('a')).toEqual(['a!']);
        });

        it('isFieldValidating 在异步校验期间为 true', async () => {
            let formRef: FormInstance | null = null;
            let wasValidating = false;
            function Host() {
                const [form] = Form.useForm();
                formRef = form;
                return (
                    <Form form={form} initialValues={{ a: 'x' }}>
                        <Form.Item
                            name="a"
                            rules={[
                                {
                                    // Non-empty value so the validator actually runs
                                    // (runRule short-circuits on empty values).
                                    validator: async () => {
                                        wasValidating = formRef!.isFieldValidating('a');
                                        await new Promise((r) => setTimeout(r, 5));
                                    },
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Form>
                );
            }
            render(<Host />);
            await act(async () => {
                await formRef!.validateFields();
            });
            expect(wasValidating).toBe(true);
            expect(formRef!.isFieldValidating('a')).toBe(false);
        });

        it('validateFields 通过返回 values', async () => {
            let resolved: Record<string, unknown> | null = null;
            function Host() {
                const [form] = Form.useForm();
                return (
                    <>
                        <button
                            type="button"
                            onClick={() => {
                                form.validateFields().then((values) => {
                                    resolved = values;
                                });
                            }}
                        >
                            validate
                        </button>
                        <Form form={form} initialValues={{ a: 'x' }}>
                            <Form.Item name="a">
                                <Input />
                            </Form.Item>
                        </Form>
                    </>
                );
            }
            render(<Host />);
            await act(async () => {
                fireEvent.click(screen.getByText('validate'));
            });
            expect(resolved).toEqual({ a: 'x' });
        });

        it('validateFields 失败抛带 errorFields 的 Error', async () => {
            let captured: unknown = null;
            function Host() {
                const [form] = Form.useForm();
                return (
                    <>
                        <button
                            type="button"
                            onClick={() => {
                                form.validateFields().catch((err: unknown) => {
                                    captured = err;
                                });
                            }}
                        >
                            validate
                        </button>
                        <Form form={form}>
                            <Form.Item name="a" rules={[{ required: true, message: 'a!' }]}>
                                <Input />
                            </Form.Item>
                        </Form>
                    </>
                );
            }
            render(<Host />);
            await act(async () => {
                fireEvent.click(screen.getByText('validate'));
            });
            const err = captured as { errorFields: Array<{ name: string; errors: string[] }> };
            expect(err.errorFields[0].name).toBe('a');
            expect(err.errorFields[0].errors[0]).toBe('a!');
        });
    });

    describe('校验规则', () => {
        it('required: 空触发错误，有值通过', async () => {
            const onFinish = vi.fn();
            const onFinishFailed = vi.fn();
            const { container } = render(
                <Form onFinish={onFinish} onFinishFailed={onFinishFailed}>
                    <Form.Item name="username" rules={[{ required: true, message: '必填' }]}>
                        <Input />
                    </Form.Item>
                    <button type="submit">提交</button>
                </Form>
            );
            const form = container.querySelector('form') as HTMLFormElement;
            await act(async () => {
                fireEvent.submit(form);
            });
            expect(onFinishFailed).toHaveBeenCalledTimes(1);
            expect(onFinish).not.toHaveBeenCalled();
            expect(screen.getByText('必填')).toBeTruthy();

            const input = screen.getByRole('textbox') as HTMLInputElement;
            await act(async () => {
                fireEvent.change(input, { target: { value: 'tom' } });
            });
            await act(async () => {
                fireEvent.submit(form);
            });
            expect(onFinish).toHaveBeenCalledWith({ username: 'tom' });
        });

        it('len: 字符串长度校验', async () => {
            const onFinish = vi.fn();
            const { container } = render(
                <Form onFinish={onFinish}>
                    <Form.Item name="code" rules={[{ len: 3, message: '必须 3 个字符' }]}>
                        <Input />
                    </Form.Item>
                </Form>
            );
            const form = container.querySelector('form') as HTMLFormElement;
            const input = screen.getByRole('textbox') as HTMLInputElement;
            await act(async () => {
                fireEvent.change(input, { target: { value: 'ab' } });
                fireEvent.submit(form);
            });
            expect(onFinish).not.toHaveBeenCalled();
            expect(screen.getByText('必须 3 个字符')).toBeTruthy();
            await act(async () => {
                fireEvent.change(input, { target: { value: 'abc' } });
                fireEvent.submit(form);
            });
            expect(onFinish).toHaveBeenCalledWith({ code: 'abc' });
        });

        it('type=integer: 字符串数字按整数校验', async () => {
            const onFinish = vi.fn();
            const { container } = render(
                <Form onFinish={onFinish}>
                    <Form.Item name="age" rules={[{ type: 'integer', message: '请输入整数' }]}>
                        <Input />
                    </Form.Item>
                </Form>
            );
            const form = container.querySelector('form') as HTMLFormElement;
            const input = screen.getByRole('textbox') as HTMLInputElement;
            await act(async () => {
                fireEvent.change(input, { target: { value: 'abc' } });
                fireEvent.submit(form);
            });
            expect(onFinish).not.toHaveBeenCalled();
            expect(container.querySelector('.animal-form-item-explain-error')).toBeTruthy();
            await act(async () => {
                fireEvent.change(input, { target: { value: '25' } });
                fireEvent.submit(form);
            });
            expect(onFinish).toHaveBeenCalledWith({ age: '25' });
            await act(async () => {
                fireEvent.change(input, { target: { value: '3.14' } });
                fireEvent.submit(form);
            });
            expect(container.querySelector('.animal-form-item-explain-error')).toBeTruthy();
        });

        it('min/max: number/integer 类型按数值比较', async () => {
            const onFinish = vi.fn();
            const { container } = render(
                <Form onFinish={onFinish}>
                    <Form.Item name="age" rules={[{ type: 'integer', min: 0, max: 150, message: '0-150' }]}>
                        <Input />
                    </Form.Item>
                </Form>
            );
            const form = container.querySelector('form') as HTMLFormElement;
            const input = screen.getByRole('textbox') as HTMLInputElement;
            await act(async () => {
                fireEvent.change(input, { target: { value: '5' } });
                fireEvent.submit(form);
            });
            expect(onFinish).toHaveBeenCalledWith({ age: '5' });
            await act(async () => {
                fireEvent.change(input, { target: { value: '999' } });
                fireEvent.submit(form);
            });
            expect(onFinish).toHaveBeenCalledTimes(1);
            expect(container.querySelector('.animal-form-item-explain-error')).toBeTruthy();
        });

        it('pattern: 正则校验', async () => {
            const onFinish = vi.fn();
            const { container } = render(
                <Form onFinish={onFinish}>
                    <Form.Item name="email" rules={[{ pattern: /^[a-z]+@/i, message: '邮箱格式不对' }]}>
                        <Input />
                    </Form.Item>
                </Form>
            );
            const form = container.querySelector('form') as HTMLFormElement;
            const input = screen.getByRole('textbox') as HTMLInputElement;
            await act(async () => {
                fireEvent.change(input, { target: { value: 'not-an-email' } });
                fireEvent.submit(form);
            });
            expect(onFinish).not.toHaveBeenCalled();
            expect(screen.getByText('邮箱格式不对')).toBeTruthy();
            await act(async () => {
                fireEvent.change(input, { target: { value: 'tom@x.com' } });
                fireEvent.submit(form);
            });
            expect(onFinish).toHaveBeenCalledWith({ email: 'tom@x.com' });
        });

        it('type=email: 邮箱格式', async () => {
            const onFinish = vi.fn();
            const { container } = render(
                <Form onFinish={onFinish}>
                    <Form.Item name="email" rules={[{ type: 'email' }]}>
                        <Input />
                    </Form.Item>
                </Form>
            );
            const form = container.querySelector('form') as HTMLFormElement;
            const input = screen.getByRole('textbox') as HTMLInputElement;
            await act(async () => {
                fireEvent.change(input, { target: { value: 'tom@x.com' } });
                fireEvent.submit(form);
            });
            expect(onFinish).toHaveBeenCalledWith({ email: 'tom@x.com' });
            await act(async () => {
                fireEvent.change(input, { target: { value: 'not-an-email' } });
                fireEvent.submit(form);
            });
            expect(container.querySelector('.animal-form-item-explain-error')).toBeTruthy();
        });

        it('required + whitespace: 纯空格算空', async () => {
            const onFinish = vi.fn();
            const { container } = render(
                <Form onFinish={onFinish}>
                    <Form.Item name="name" rules={[{ required: true, whitespace: true, message: '不能为空或空白' }]}>
                        <Input />
                    </Form.Item>
                </Form>
            );
            const form = container.querySelector('form') as HTMLFormElement;
            const input = screen.getByRole('textbox') as HTMLInputElement;
            await act(async () => {
                fireEvent.change(input, { target: { value: '   ' } });
                fireEvent.submit(form);
            });
            expect(onFinish).not.toHaveBeenCalled();
            expect(screen.getByText('不能为空或空白')).toBeTruthy();
            await act(async () => {
                fireEvent.change(input, { target: { value: 'tom' } });
                fireEvent.submit(form);
            });
            expect(onFinish).toHaveBeenCalledWith({ name: 'tom' });
        });

        it('validator: async 自定义校验', async () => {
            const onFinish = vi.fn();
            const { container } = render(
                <Form onFinish={onFinish}>
                    <Form.Item
                        name="name"
                        rules={[
                            {
                                validator: async (_rule: RuleObject, value: unknown) => {
                                    await new Promise((r) => setTimeout(r, 10));
                                    if (value === 'forbidden') throw new Error('禁用此值');
                                },
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            );
            const form = container.querySelector('form') as HTMLFormElement;
            const input = screen.getByRole('textbox') as HTMLInputElement;
            await act(async () => {
                fireEvent.change(input, { target: { value: 'forbidden' } });
                fireEvent.submit(form);
                await new Promise((r) => setTimeout(r, 30));
            });
            expect(onFinish).not.toHaveBeenCalled();
            expect(screen.getByText('禁用此值')).toBeTruthy();
        });

        it('validator 返回 string 也算错误', async () => {
            const onFinish = vi.fn();
            const { container } = render(
                <Form onFinish={onFinish}>
                    <Form.Item name="name" rules={[{ validator: () => '返回的错误' }]}>
                        <Input />
                    </Form.Item>
                </Form>
            );
            const form = container.querySelector('form') as HTMLFormElement;
            const input = screen.getByRole('textbox') as HTMLInputElement;
            await act(async () => {
                fireEvent.change(input, { target: { value: 'any' } });
                fireEvent.submit(form);
            });
            expect(onFinish).not.toHaveBeenCalled();
            expect(screen.getByText('返回的错误')).toBeTruthy();
        });
    });

    describe('提交', () => {
        it('空表单（无 required）触发 onFinish', async () => {
            const onFinish = vi.fn();
            const { container } = render(
                <Form onFinish={onFinish}>
                    <Form.Item name="a">
                        <Input />
                    </Form.Item>
                    <button type="submit">go</button>
                </Form>
            );
            const form = container.querySelector('form') as HTMLFormElement;
            await act(async () => {
                fireEvent.submit(form);
            });
            expect(onFinish).toHaveBeenCalledWith({});
        });

        it('onFinishFailed 收到 values + errorFields', async () => {
            const onFinishFailed = vi.fn();
            const { container } = render(
                <Form onFinishFailed={onFinishFailed}>
                    <Form.Item name="a" rules={[{ required: true, message: 'a!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="b" rules={[{ required: true, message: 'b!' }]}>
                        <Input />
                    </Form.Item>
                </Form>
            );
            const form = container.querySelector('form') as HTMLFormElement;
            const inputA = screen.getAllByRole('textbox')[0] as HTMLInputElement;
            await act(async () => {
                fireEvent.change(inputA, { target: { value: 'x' } });
                fireEvent.submit(form);
            });
            expect(onFinishFailed).toHaveBeenCalledTimes(1);
            const arg = onFinishFailed.mock.calls[0][0] as {
                errorFields: Array<{ name: string; errors: string[] }>;
                values: Record<string, unknown>;
            };
            expect(arg.errorFields).toHaveLength(1);
            expect(arg.errorFields[0].name).toBe('b');
            expect(arg.values).toEqual({ a: 'x' });
        });
    });

    describe('label / colon / requiredMark / Col', () => {
        it('labelAlign=right 时 label 文本对齐', () => {
            const { container } = render(
                <Form layout="horizontal" labelAlign="right">
                    <Form.Item label="姓名" name="n">
                        <Input />
                    </Form.Item>
                </Form>
            );
            expect((container.querySelector('label') as HTMLLabelElement).style.textAlign).toBe('right');
        });

        it('colon=false 时不显示冒号', () => {
            const { container } = render(
                <Form colon={false}>
                    <Form.Item label="姓名" name="n">
                        <Input />
                    </Form.Item>
                </Form>
            );
            expect(container.querySelector('.animal-form-item-label-colon')).toBeNull();
        });

        it('colon 默认显示冒号', () => {
            const { container } = render(
                <Form>
                    <Form.Item label="姓名" name="n">
                        <Input />
                    </Form.Item>
                </Form>
            );
            expect(container.querySelector('.animal-form-item-label-colon')).toBeTruthy();
        });

        it('requiredMark=false 时不显示星号', () => {
            const { container } = render(
                <Form requiredMark={false}>
                    <Form.Item label="姓名" name="n" required>
                        <Input />
                    </Form.Item>
                </Form>
            );
            expect(container.querySelector('.animal-form-item-label-required')).toBeNull();
        });

        it('requiredMark=true 时显示星号', () => {
            const { container } = render(
                <Form requiredMark>
                    <Form.Item label="姓名" name="n" required>
                        <Input />
                    </Form.Item>
                </Form>
            );
            expect(container.querySelector('.animal-form-item-label-required')).toBeTruthy();
        });

        it('labelCol/wrapperCol 应用 grid-column 内联样式', () => {
            const { container } = render(
                <Form layout="horizontal" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                    <Form.Item label="姓名" name="n">
                        <Input />
                    </Form.Item>
                </Form>
            );
            const label = container.querySelector('label') as HTMLLabelElement;
            const control = label.nextElementSibling as HTMLElement;
            expect(label.style.gridColumn).toBe('1 / span 6');
            expect(control.style.gridColumn).toBe('7 / span 18');
        });

        it('labelCol.offset 时 label 起始列后移', () => {
            const { container } = render(
                <Form layout="horizontal" labelCol={{ span: 6, offset: 2 }}>
                    <Form.Item label="姓名" name="n">
                        <Input />
                    </Form.Item>
                </Form>
            );
            expect((container.querySelector('label') as HTMLLabelElement).style.gridColumn).toBe('3 / span 6');
        });
    });

    describe('高级功能', () => {
        it('noStyle 时不渲染外层 label/wrapper 容器', () => {
            const { container } = render(
                <Form>
                    <Form.Item name="a" noStyle>
                        <Input />
                    </Form.Item>
                </Form>
            );
            expect(container.querySelector('.animal-form-item-label')).toBeNull();
            expect(container.querySelector('.animal-form-item-control')).toBeNull();
            expect(screen.getByRole('textbox')).toBeTruthy();
        });

        it('hasFeedback 时错误状态下显示 ✕ 图标', async () => {
            const { container } = render(
                <Form>
                    <Form.Item name="a" hasFeedback rules={[{ required: true, message: '必填' }]}>
                        <Input />
                    </Form.Item>
                </Form>
            );
            const form = container.querySelector('form') as HTMLFormElement;
            await act(async () => {
                fireEvent.submit(form);
            });
            const feedback = container.querySelector('.animal-form-item-feedback-icon');
            expect(feedback).toBeTruthy();
            expect(feedback?.textContent).toContain('✕');
        });

        it('validateStatus=success 手动指定覆盖自动推断', () => {
            const { container } = render(
                <Form>
                    <Form.Item name="a" validateStatus="success">
                        <Input />
                    </Form.Item>
                </Form>
            );
            expect(container.querySelector('.animal-form-item-has-success')).toBeTruthy();
        });

        it('help 文本无错误时显示，有错误时被覆盖', async () => {
            const { container } = render(
                <Form>
                    <Form.Item name="a" help="帮助说明" rules={[{ required: true, message: '错误文案' }]}>
                        <Input />
                    </Form.Item>
                </Form>
            );
            expect(screen.getByText('帮助说明')).toBeTruthy();
            const form = container.querySelector('form') as HTMLFormElement;
            await act(async () => {
                fireEvent.submit(form);
            });
            expect(screen.getByText('错误文案')).toBeTruthy();
            expect(screen.queryByText('帮助说明')).toBeNull();
        });

        it('disabled 透传到子组件', () => {
            render(
                <Form disabled>
                    <Form.Item name="a">
                        <Input />
                    </Form.Item>
                </Form>
            );
            expect((screen.getByRole('textbox') as HTMLInputElement).disabled).toBe(true);
        });

        it('getValueFromEvent 自定义取值', async () => {
            const onFinish = vi.fn();
            function CustomInput({ value, onChange }: { value?: string; onChange?: (v: string) => void }) {
                return (
                    <input
                        value={value ?? ''}
                        onChange={(e) => onChange?.((e.target as HTMLInputElement).dataset.v ?? '')}
                        data-v="from-custom"
                    />
                );
            }
            render(
                <Form onFinish={onFinish}>
                    <Form.Item name="custom" getValueFromEvent={(v: unknown) => v} trigger="onChange">
                        <CustomInput />
                    </Form.Item>
                </Form>
            );
            const form = document.querySelector('form') as HTMLFormElement;
            const input = screen.getByRole('textbox') as HTMLInputElement;
            await act(async () => {
                fireEvent.change(input, { target: { value: 'typed' } });
                fireEvent.submit(form);
            });
            expect(onFinish).toHaveBeenCalledWith({ custom: 'from-custom' });
        });

        it('normalize 在 setFieldValue 前标准化', async () => {
            const onFinish = vi.fn();
            const trim = (v: unknown) => (typeof v === 'string' ? v.trim() : v);
            render(
                <Form onFinish={onFinish}>
                    <Form.Item name="name" normalize={trim}>
                        <Input />
                    </Form.Item>
                </Form>
            );
            const form = document.querySelector('form') as HTMLFormElement;
            const input = screen.getByRole('textbox') as HTMLInputElement;
            await act(async () => {
                fireEvent.change(input, { target: { value: '  hello  ' } });
                fireEvent.submit(form);
            });
            expect(onFinish).toHaveBeenCalledWith({ name: 'hello' });
        });

        it('valuePropName 切换（checkbox 用 checked）', async () => {
            const onFinish = vi.fn();
            render(
                <Form onFinish={onFinish}>
                    <Form.Item name="agree" valuePropName="checked">
                        <input type="checkbox" />
                    </Form.Item>
                </Form>
            );
            const checkbox = document.querySelector('input[type="checkbox"]') as HTMLInputElement;
            const form = document.querySelector('form') as HTMLFormElement;
            await act(async () => {
                fireEvent.click(checkbox);
            });
            await act(async () => {
                fireEvent.submit(form);
            });
            expect(onFinish).toHaveBeenCalledWith({ agree: true });
        });

        it('Form.Item initialValue 在挂载时写入字段', () => {
            const { container } = render(
                <Form>
                    <Form.Item name="seed" initialValue="hi">
                        <Input />
                    </Form.Item>
                </Form>
            );
            expect((container.querySelector('input') as HTMLInputElement).value).toBe('hi');
        });
    });

    describe('onValuesChange', () => {
        it('单字段 change 触发，changedValues 仅含变化字段', () => {
            const onValuesChange = vi.fn();
            render(
                <Form onValuesChange={onValuesChange}>
                    <Form.Item name="a">
                        <Input />
                    </Form.Item>
                    <Form.Item name="b">
                        <Input />
                    </Form.Item>
                </Form>
            );
            const inputA = screen.getAllByRole('textbox')[0] as HTMLInputElement;
            fireEvent.change(inputA, { target: { value: 'hello' } });
            expect(onValuesChange).toHaveBeenCalledTimes(1);
            const [changed, all] = onValuesChange.mock.calls[0] as [
                Record<string, unknown>,
                Record<string, unknown>,
            ];
            expect(changed).toEqual({ a: 'hello' });
            expect(all).toEqual({ a: 'hello' });
        });

        it('第二个参数是全量 values', () => {
            const onValuesChange = vi.fn();
            function Host() {
                const [form] = Form.useForm();
                useEffect(() => {
                    form.setFieldsValue({ a: 'init' });
                }, [form]);
                return (
                    <Form form={form} onValuesChange={onValuesChange}>
                        <Form.Item name="a">
                            <Input />
                        </Form.Item>
                        <Form.Item name="b">
                            <Input />
                        </Form.Item>
                    </Form>
                );
            }
            render(<Host />);
            const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];
            fireEvent.change(inputs[1], { target: { value: 'B' } });
            const [changed, all] = onValuesChange.mock.calls[0] as [
                Record<string, unknown>,
                Record<string, unknown>,
            ];
            expect(changed).toEqual({ b: 'B' });
            expect(all).toEqual({ a: 'init', b: 'B' });
        });
    });

    describe('initialValues 同步', () => {
        it('同内容新引用 initialValues，re-render 不重复 setFieldsValue', () => {
            let spy: ReturnType<typeof vi.fn> | null = null;
            function Spy({ form }: { form: FormInstance }) {
                if (!spy) {
                    const orig = form.setFieldsValue.bind(form);
                    spy = vi.fn((v: Record<string, unknown>) => orig(v));
                    (form as { setFieldsValue: typeof orig }).setFieldsValue = spy as never;
                }
                return null;
            }
            function Parent({ tick }: { tick: number }) {
                const [form] = Form.useForm();
                return (
                    <>
                        <Spy form={form} />
                        <Form form={form} initialValues={{ a: 1, b: 2 }}>
                            <Form.Item name="a">
                                <Input />
                            </Form.Item>
                        </Form>
                        <div>{tick}</div>
                    </>
                );
            }
            const { rerender } = render(<Parent tick={0} />);
            rerender(<Parent tick={1} />);
            rerender(<Parent tick={2} />);
            expect(spy).toHaveBeenCalledTimes(1);
        });

        it('initialValues 内容变化时 setFieldsValue 再调', () => {
            let spy: ReturnType<typeof vi.fn> | null = null;
            function Spy({ form }: { form: FormInstance }) {
                if (!spy) {
                    const orig = form.setFieldsValue.bind(form);
                    spy = vi.fn((v: Record<string, unknown>) => orig(v));
                    (form as { setFieldsValue: typeof orig }).setFieldsValue = spy as never;
                }
                return null;
            }
            function Parent({ tick, iv }: { tick: number; iv: Record<string, unknown> }) {
                const [form] = Form.useForm();
                return (
                    <>
                        <Spy form={form} />
                        <Form form={form} initialValues={iv}>
                            <Form.Item name="a">
                                <Input />
                            </Form.Item>
                        </Form>
                        <div>{tick}</div>
                    </>
                );
            }
            const { rerender } = render(<Parent tick={0} iv={{ a: 1 }} />);
            rerender(<Parent tick={1} iv={{ a: 2 }} />);
            rerender(<Parent tick={2} iv={{ a: 2 }} />);
            rerender(<Parent tick={3} iv={{ a: 2 }} />);
            rerender(<Parent tick={4} iv={{ a: 3 }} />);
            expect(spy).toHaveBeenCalledTimes(3);
        });
    });

    describe('onReset', () => {
        it('点击 reset 按钮触发 onReset', async () => {
            const onReset = vi.fn();
            render(
                <Form onReset={onReset} initialValues={{ a: 'init' }}>
                    <Form.Item name="a">
                        <Input />
                    </Form.Item>
                    <button type="reset">reset</button>
                </Form>
            );
            const input = screen.getByRole('textbox') as HTMLInputElement;
            await act(async () => {
                fireEvent.change(input, { target: { value: 'dirty' } });
            });
            expect(input.value).toBe('dirty');
            await act(async () => {
                fireEvent.click(screen.getByText('reset'));
            });
            expect(onReset).toHaveBeenCalledTimes(1);
            expect(input.value).toBe('init');
        });
    });

    describe('context 注入', () => {
        it('Form.Item 脱离 Form 使用时抛错', () => {
            const spy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
            expect(() =>
                render(
                    <Form.Item name="a">
                        <Input />
                    </Form.Item>
                )
            ).toThrow(/Form\.Item must be used inside/);
            spy.mockRestore();
        });
    });
});
