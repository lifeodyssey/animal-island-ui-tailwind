import type { Meta, StoryObj } from '@storybook/react';
import type { CSSProperties } from 'react';
import { useState } from 'react';
import { expect, userEvent } from 'storybook/test';
import { Button, Input } from '../src';

const meta = {
    title: 'Regression/Parity/Button Input',
    // Internal visual-regression fixtures: hide from the published sidebar
    // (!dev) and skip autodocs, but keep them built + URL-reachable so the
    // Playwright/visual tests and the vitest test-runner still cover them.
    tags: ['!dev', '!autodocs'],
    parameters: {
        layout: 'padded',
    },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

const pageStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: 28,
    maxWidth: 760,
    fontFamily: 'Times',
} satisfies CSSProperties;

const sectionStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
} satisfies CSSProperties;

const rowStyle = {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
} satisfies CSSProperties;

const titleStyle = {
    margin: 0,
    color: 'var(--animal-text-color)',
    fontFamily: 'var(--animal-font-family)',
    fontSize: 18,
    fontWeight: 700,
} satisfies CSSProperties;

const labelStyle = {
    color: '#a0936e',
    fontFamily: 'var(--animal-font-family)',
    fontSize: 14,
    fontWeight: 500,
} satisfies CSSProperties;

const inputStackStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    width: 360,
    maxWidth: '100%',
} satisfies CSSProperties;

const matrixGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(126px, 1fr))',
    gap: 12,
    alignItems: 'center',
} satisfies CSSProperties;

const formRowStyle = {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
    padding: 16,
    background: '#faf8f3',
    border: '1px solid #e8e2d6',
    borderRadius: 12,
} satisfies CSSProperties;

const buttonTypes = ['primary', 'default', 'dashed', 'text', 'link'] as const;
const buttonSizes = ['small', 'middle', 'large'] as const;

const ButtonSection = () => (
    <section data-testid="button-parity-region" style={sectionStyle}>
        <h2 style={titleStyle}>Button</h2>
        <div style={labelStyle}>type variants</div>
        <div style={rowStyle}>
            <Button type="primary">Primary</Button>
            <Button>Default</Button>
            <Button type="dashed">Dashed</Button>
            <Button type="text">Text</Button>
            <Button type="link">Link</Button>
        </div>
        <div style={labelStyle}>danger / ghost / loading / disabled states</div>
        <div style={rowStyle}>
            <Button type="primary" danger>
                Danger
            </Button>
            <Button type="primary" ghost>
                Ghost
            </Button>
            <Button type="primary" loading>
                Loading
            </Button>
            <Button type="primary" disabled>
                Disabled
            </Button>
        </div>
        <div style={labelStyle}>size variants</div>
        <div style={rowStyle}>
            <Button type="primary" size="small">
                Small
            </Button>
            <Button type="primary" size="middle">
                Middle
            </Button>
            <Button type="primary" size="large">
                Large
            </Button>
        </div>
        <div style={labelStyle}>icon buttons</div>
        <div style={rowStyle}>
            <Button type="primary" icon={<span>🔍</span>}>
                搜索
            </Button>
            <Button icon={<span>⭐</span>}>收藏</Button>
            <Button type="dashed" icon={<span>＋</span>}>
                新增
            </Button>
        </div>
        <div style={labelStyle}>block button</div>
        <div style={{ width: 360, maxWidth: '100%' }}>
            <Button type="primary" block>
                Block Button
            </Button>
        </div>
        <div style={labelStyle}>danger combinations</div>
        <div style={rowStyle}>
            <Button type="primary" danger>
                Primary Danger
            </Button>
            <Button danger>Default Danger</Button>
            <Button type="dashed" danger>
                Dashed Danger
            </Button>
            <Button type="text" danger>
                Text Danger
            </Button>
            <Button type="link" danger>
                Link Danger
            </Button>
        </div>
    </section>
);

const InputSection = () => {
    const [clearValue, setClearValue] = useState('Island note');

    return (
        <section data-testid="input-parity-region" style={sectionStyle}>
            <h2 style={titleStyle}>Input</h2>
            <div style={labelStyle}>shadow control</div>
            <div style={inputStackStyle}>
                <Input placeholder="No shadow (default)" />
                <Input placeholder="With shadow" shadow />
            </div>
            <div style={labelStyle}>basic usage</div>
            <div style={inputStackStyle}>
                <Input placeholder="Basic input" />
                <Input
                    placeholder="With clear"
                    allowClear
                    value={clearValue}
                    onChange={(event) => setClearValue(event.target.value)}
                    onClear={() => setClearValue('')}
                />
                <Input placeholder="Clear empty" allowClear />
                <Input placeholder="Prefix & Suffix" prefix="🔍" suffix="⏎" />
            </div>
            <div style={labelStyle}>size variants</div>
            <div style={inputStackStyle}>
                <Input placeholder="Small" size="small" />
                <Input placeholder="Middle (default)" size="middle" />
                <Input placeholder="Large" size="large" />
            </div>
            <div style={labelStyle}>status validation</div>
            <div style={inputStackStyle}>
                <Input placeholder="Error status" status="error" />
                <Input placeholder="Warning status" status="warning" />
            </div>
            <div style={labelStyle}>disabled state</div>
            <div style={inputStackStyle}>
                <Input placeholder="Disabled" disabled defaultValue="Disabled" />
            </div>
        </section>
    );
};

const ButtonMatrixSection = () => {
    const [formAction, setFormAction] = useState('idle');

    return (
        <section data-testid="button-matrix-region" style={sectionStyle}>
            <h2 style={titleStyle}>Button Matrix</h2>
            <div style={labelStyle}>type x size combinations</div>
            <div data-testid="button-type-size-matrix" style={matrixGridStyle}>
                {buttonSizes.flatMap((size) =>
                    buttonTypes.map((type) => (
                        <Button key={`${type}-${size}`} type={type} size={size}>
                            {type}-{size}
                        </Button>
                    )),
                )}
            </div>
            <div style={labelStyle}>state combinations</div>
            <div data-testid="button-state-matrix" style={rowStyle}>
                <Button type="primary" danger>
                    primary-danger
                </Button>
                <Button danger>default-danger</Button>
                <Button type="dashed" danger>
                    dashed-danger
                </Button>
                <Button type="text" danger>
                    text-danger
                </Button>
                <Button type="link" danger>
                    link-danger
                </Button>
                <Button type="primary" ghost>
                    primary-ghost
                </Button>
                <Button type="primary" ghost danger>
                    ghost-danger
                </Button>
                <Button type="primary" loading icon={<span>🔍</span>}>
                    loading-hides-icon
                </Button>
                <Button disabled icon={<span>⭐</span>}>
                    disabled-icon
                </Button>
            </div>
            <div style={labelStyle}>htmlType native button behavior</div>
            <form
                data-testid="button-htmltype-form"
                style={formRowStyle}
                onSubmit={(event) => {
                    event.preventDefault();
                    setFormAction('submitted');
                }}
                onReset={() => setFormAction('reset')}
            >
                <Button htmlType="submit" type="primary">
                    submit-native
                </Button>
                <Button htmlType="reset">reset-native</Button>
                <Button htmlType="button" type="dashed" onClick={() => setFormAction('button-clicked')}>
                    button-native
                </Button>
                <span data-testid="button-form-action" style={{ color: '#725d42', fontSize: 13, fontWeight: 700 }}>
                    {formAction}
                </span>
            </form>
        </section>
    );
};

const InputMatrixSection = () => {
    const [controlledValue, setControlledValue] = useState('Controlled');
    const [clearCount, setClearCount] = useState(0);

    return (
        <section data-testid="input-matrix-region" style={sectionStyle}>
            <h2 style={titleStyle}>Input Matrix</h2>
            <div style={labelStyle}>size × status</div>
            <div data-testid="input-size-status-matrix" style={inputStackStyle}>
                <Input placeholder="small-default" size="small" defaultValue="Small default" />
                <Input placeholder="middle-error" size="middle" status="error" defaultValue="Middle error" />
                <Input placeholder="large-warning" size="large" status="warning" defaultValue="Large warning" />
            </div>
            <div style={labelStyle}>native input props</div>
            <div data-testid="input-native-matrix" style={inputStackStyle}>
                <Input placeholder="Email input" type="email" name="islandEmail" required defaultValue="nook@example.com" prefix="@" />
                <Input placeholder="Password input" type="password" defaultValue="turnips" suffix="🔒" />
                <Input placeholder="Read only input" readOnly defaultValue="Read only" />
            </div>
            <div style={labelStyle}>controlled clear / disabled clear</div>
            <div data-testid="input-clear-matrix" style={inputStackStyle}>
                <Input
                    placeholder="Controlled clear"
                    allowClear
                    value={controlledValue}
                    maxLength={8}
                    onChange={(event) => setControlledValue(event.target.value)}
                    onClear={() => setClearCount((count) => count + 1)}
                />
                <span data-testid="controlled-input-state" style={{ color: '#725d42', fontSize: 13, fontWeight: 700 }}>
                    {controlledValue || 'empty'} / clears: {clearCount}
                </span>
                <Input placeholder="Disabled clear" allowClear disabled defaultValue="Cannot clear" />
            </div>
        </section>
    );
};

export const ButtonInputParity: Story = {
    render: () => (
        <div style={pageStyle}>
            <ButtonSection />
            <InputSection />
        </div>
    ),
    play: async ({ canvas }) => {
        await expect(canvas.getByRole('button', { name: 'Primary' })).toBeVisible();
        await expect(canvas.getByRole('button', { name: 'Ghost' })).toBeVisible();
        await expect(canvas.getByRole('button', { name: 'Disabled' })).toBeDisabled();
        await expect(canvas.getByRole('button', { name: 'Block Button' })).toBeVisible();
        await expect(canvas.getByRole('button', { name: 'Default Danger' })).toBeVisible();
        await expect(canvas.getByPlaceholderText('Prefix & Suffix')).toBeVisible();
        await expect(canvas.getByPlaceholderText('Disabled')).toBeDisabled();

        const clearableInput = canvas.getByPlaceholderText('With clear');
        await expect(clearableInput).toHaveValue('Island note');
        await userEvent.click(
            canvas.getByRole('button', { name: /×|Clear input/ }),
        );
        await expect(clearableInput).toHaveValue('');
        await userEvent.type(clearableInput, 'Island note');
        await expect(clearableInput).toHaveValue('Island note');
    },
};

export const ButtonMatrixParity: Story = {
    render: () => <ButtonMatrixSection />,
    play: async ({ canvas }) => {
        await expect(canvas.getByRole('button', { name: 'primary-small' })).toBeVisible();
        await expect(canvas.getByRole('button', { name: 'link-large' })).toBeVisible();
        await expect(canvas.getByRole('button', { name: 'ghost-danger' })).toBeVisible();
        await expect(canvas.getByRole('button', { name: /disabled-icon/ })).toBeDisabled();
        await expect(canvas.getByRole('button', { name: 'submit-native' })).toHaveAttribute('type', 'submit');
        await expect(canvas.getByRole('button', { name: 'reset-native' })).toHaveAttribute('type', 'reset');
        await expect(canvas.getByRole('button', { name: 'button-native' })).toHaveAttribute('type', 'button');

        await expect(canvas.getByTestId('button-form-action')).toHaveTextContent('idle');
        await userEvent.click(canvas.getByRole('button', { name: 'button-native' }));
        await expect(canvas.getByTestId('button-form-action')).toHaveTextContent('button-clicked');
        await userEvent.click(canvas.getByRole('button', { name: 'submit-native' }));
        await expect(canvas.getByTestId('button-form-action')).toHaveTextContent('submitted');
        await userEvent.click(canvas.getByRole('button', { name: 'reset-native' }));
        await expect(canvas.getByTestId('button-form-action')).toHaveTextContent('reset');
    },
};

export const InputMatrixParity: Story = {
    render: () => <InputMatrixSection />,
    play: async ({ canvas }) => {
        await expect(canvas.getByPlaceholderText('small-default')).toHaveValue('Small default');
        await expect(canvas.getByPlaceholderText('middle-error')).toHaveValue('Middle error');
        await expect(canvas.getByPlaceholderText('large-warning')).toHaveValue('Large warning');
        await expect(canvas.getByPlaceholderText('Email input')).toHaveAttribute('type', 'email');
        await expect(canvas.getByPlaceholderText('Email input')).toHaveAttribute('name', 'islandEmail');
        await expect(canvas.getByPlaceholderText('Email input')).toBeRequired();
        await expect(canvas.getByPlaceholderText('Password input')).toHaveAttribute('type', 'password');
        await expect(canvas.getByPlaceholderText('Read only input')).toHaveAttribute('readonly');
        await expect(canvas.getByPlaceholderText('Disabled clear')).toBeDisabled();

        const controlledInput = canvas.getByPlaceholderText('Controlled clear');
        await expect(controlledInput).toHaveValue('Controlled');
        await userEvent.click(canvas.getByRole('button', { name: /×|Clear input/ }));
        await expect(controlledInput).toHaveValue('');
        await expect(canvas.getByTestId('controlled-input-state')).toHaveTextContent('empty / clears: 1');
        await expect(controlledInput).toHaveAttribute('maxlength', '8');
        await userEvent.type(controlledInput, 'ReturnedX');
        await expect(canvas.getByTestId('controlled-input-state')).toHaveTextContent('Returned / clears: 1');
    },
};
