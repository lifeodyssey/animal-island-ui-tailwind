import type { Meta, StoryObj } from '@storybook/react';
import type { CSSProperties } from 'react';
import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import { Button, Checkbox, Radio, Select, Switch, Tooltip } from '../src';
import type { CheckboxOption, RadioOption, SelectOption } from '../src';

const meta = {
    title: 'Regression/Parity/Controls',
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
    gap: 16,
} satisfies CSSProperties;

const boxStyle = {
    padding: 16,
    background: '#faf8f3',
    border: '1px solid #e8e2d6',
    borderRadius: 12,
} satisfies CSSProperties;

const matrixGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
    gap: 14,
    alignItems: 'start',
} satisfies CSSProperties;

const matrixCardStyle = {
    ...boxStyle,
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    minHeight: 84,
} satisfies CSSProperties;

const labelStyle = {
    color: '#a0936e',
    fontFamily: 'var(--animal-font-family)',
    fontSize: 14,
    fontWeight: 500,
} satisfies CSSProperties;

const islandOptions: CheckboxOption[] = [
    { label: '🌊 海滩', value: 'beach' },
    { label: '🌳 森林', value: 'forest' },
    { label: '🌸 花园', value: 'garden' },
    { label: '🏡 村庄', value: 'village' },
];

const critterOptions: CheckboxOption[] = [
    { label: '🦋 蝴蝶', value: 'butterfly' },
    { label: '🐟 鲈鱼', value: 'bass' },
    { label: '🦀 螃蟹', value: 'crab', disabled: true },
    { label: '🐛 毛毛虫', value: 'caterpillar' },
    { label: '🌊 水母', value: 'jellyfish' },
];

const fishOptions: SelectOption[] = [
    { key: 'fish1', label: '鲈鱼' },
    { key: 'fish2', label: '鲷鱼' },
    { key: 'fish3', label: '草鱼' },
    { key: 'fish4', label: '龙睛鱼' },
    { key: 'fish5', label: '神仙鱼' },
];

const flowerOptions: SelectOption[] = [
    { key: 'flower1', label: '樱花' },
    { key: 'flower2', label: '玫瑰' },
    { key: 'flower3', label: '向日葵' },
    { key: 'flower4', label: '薰衣草' },
    { key: 'flower5', label: '郁金香' },
];

const fruitOptions: SelectOption[] = [
    { key: 'fruit1', label: '草莓' },
    { key: 'fruit2', label: '蓝莓' },
    { key: 'fruit3', label: '桃子' },
    { key: 'fruit4', label: '樱桃' },
    { key: 'fruit5', label: '猕猴桃' },
];

const emptyKeyOptions: SelectOption[] = [
    { key: '', label: '空键选项' },
    { key: 'filled', label: '普通选项' },
];

const matrixSelectOptions: SelectOption[] = [
    { key: 'spring', label: '春樱' },
    { key: 'summer', label: '夏葵' },
    { key: 'autumn', label: '秋菊' },
    { key: 'winter', label: '冬莓' },
];

const radioSeasonOptions: RadioOption[] = [
    { label: '🌸 春天', value: 'spring' },
    { label: '☀️ 夏天', value: 'summer' },
    { label: '🍁 秋天', value: 'autumn' },
    { label: '❄️ 冬天', value: 'winter' },
];

const radioFruitOptions: RadioOption[] = [
    { label: '🍎 苹果', value: 'apple' },
    { label: '🍊 橙子', value: 'orange' },
    { label: '🍑 桃子', value: 'peach' },
    { label: '🍐 梨子', value: 'pear', disabled: true },
];

const SwitchSection = () => {
    const [checked, setChecked] = useState(false);

    return (
        <section data-testid="switch-parity-region" style={sectionStyle}>
            <div style={labelStyle}>basic usage</div>
            <div style={rowStyle}>
                <Switch checked={checked} onChange={setChecked} />
                <span data-testid="switch-state-label" style={{ fontSize: 13 }}>
                    {checked ? 'ON' : 'OFF'}
                </span>
            </div>
            <div style={labelStyle}>checkedChildren / unCheckedChildren custom labels</div>
            <div style={rowStyle}>
                <Switch defaultChecked checkedChildren="开" unCheckedChildren="关" />
            </div>
            <div style={labelStyle}>size variants</div>
            <div style={rowStyle}>
                <Switch defaultChecked />
                <Switch size="small" defaultChecked />
            </div>
            <div style={labelStyle}>disabled / loading states</div>
            <div style={rowStyle}>
                <Switch disabled />
                <Switch loading defaultChecked />
            </div>
        </section>
    );
};

const CheckboxSection = () => {
    const [selected, setSelected] = useState<Array<string | number>>(['beach', 'garden']);
    const [vertical, setVertical] = useState<Array<string | number>>([]);

    return (
        <section data-testid="checkbox-parity-region" style={sectionStyle}>
            <div style={labelStyle}>horizontal layout (controlled)</div>
            <div data-testid="checkbox-selected-label" style={{ fontSize: 13, color: '#a08060' }}>
                已选中:{' '}
                <span style={{ color: '#19c8b9', fontWeight: 600 }}>
                    {selected.length > 0
                        ? islandOptions.filter((item) => selected.includes(item.value)).map((item) => item.label).join('、')
                        : '无'}
                </span>
            </div>
            <div style={boxStyle}>
                <Checkbox options={islandOptions} value={selected} onChange={setSelected} style={{ gap: 20 }} />
            </div>
            <div style={labelStyle}>vertical layout + disabled option</div>
            <div style={boxStyle}>
                <Checkbox options={critterOptions} value={vertical} onChange={setVertical} direction="vertical" style={{ gap: 12 }} />
            </div>
            <div style={labelStyle}>small size</div>
            <div style={boxStyle}>
                <Checkbox options={islandOptions} defaultValue={['forest']} size="small" />
            </div>
            <div style={labelStyle}>middle size (default)</div>
            <div style={boxStyle}>
                <Checkbox options={islandOptions} defaultValue={['beach']} size="middle" />
            </div>
            <div style={labelStyle}>large size</div>
            <div style={boxStyle}>
                <Checkbox options={islandOptions.slice(0, 3)} defaultValue={['beach']} size="large" />
            </div>
            <div style={labelStyle}>all disabled</div>
            <div style={boxStyle}>
                <Checkbox options={islandOptions} defaultValue={['garden', 'village']} disabled />
            </div>
        </section>
    );
};

const SelectSection = () => {
    const [fish, setFish] = useState('fish1');
    const [flower, setFlower] = useState('');
    const [fruit, setFruit] = useState('');
    const [disabledValue, setDisabledValue] = useState('flower2');

    return (
        <section data-testid="select-parity-region" style={sectionStyle}>
            <div style={labelStyle}>default state</div>
            <div style={{ marginBottom: 8, fontSize: 13, lineHeight: '18px', color: '#a08060' }}>
                当前选中: <span style={{ color: '#19c8b9', fontWeight: 600 }}>{fishOptions.find((item) => item.key === fish)?.label}</span>
            </div>
            <div data-testid="select-default" style={boxStyle}>
                <Select options={fishOptions} value={fish} onChange={setFish} />
            </div>
            <div style={labelStyle}>custom placeholder</div>
            <div style={{ ...boxStyle, display: 'flex', gap: 16, alignItems: 'center', justifyContent: 'space-between', borderStyle: 'dashed' }}>
                <Select options={flowerOptions} value={flower} onChange={setFlower} placeholder="请选择花朵" />
                <Select options={fruitOptions} value={fruit} onChange={setFruit} placeholder="请选择水果" />
            </div>
            <div style={labelStyle}>disabled state</div>
            <div style={boxStyle}>
                <Select options={flowerOptions} value={disabledValue} onChange={setDisabledValue} disabled />
            </div>
        </section>
    );
};

const RadioSection = () => {
    const [value, setValue] = useState<string | number>('spring');

    return (
        <section data-testid="radio-parity-region" style={sectionStyle}>
            <div style={labelStyle}>horizontal controlled + keyboard roving</div>
            <div data-testid="radio-selected-label" style={{ marginBottom: 8, fontSize: 13, color: '#a08060' }}>
                已选中:{' '}
                <span style={{ color: '#19c8b9', fontWeight: 600 }}>
                    {radioSeasonOptions.find((item) => item.value === value)?.label}
                </span>
            </div>
            <div style={boxStyle}>
                <Radio options={radioSeasonOptions} value={value} onChange={setValue} style={{ gap: 20 }} />
            </div>
            <div style={labelStyle}>vertical + disabled option</div>
            <div style={boxStyle}>
                <Radio options={radioFruitOptions} defaultValue="orange" direction="vertical" />
            </div>
            <div style={labelStyle}>small / middle / large</div>
            <div style={{ ...boxStyle, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <Radio options={radioSeasonOptions.slice(0, 3)} defaultValue="spring" size="small" />
                <Radio options={radioSeasonOptions.slice(0, 3)} defaultValue="summer" size="middle" />
                <Radio options={radioSeasonOptions.slice(0, 3)} defaultValue="autumn" size="large" />
            </div>
            <div style={labelStyle}>group disabled</div>
            <div style={boxStyle}>
                <Radio options={radioSeasonOptions.slice(0, 3)} defaultValue="spring" disabled />
            </div>
        </section>
    );
};

const TooltipSection = () => (
    <section data-testid="tooltip-parity-region" style={sectionStyle}>
        <div style={labelStyle}>trigger and variants</div>
        <div style={{ ...boxStyle, overflow: 'visible', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Tooltip title="默认提示">
                <Button size="small">hover default</Button>
            </Tooltip>
            <Tooltip title="点击提示" trigger="click">
                <Button size="small">click trigger</Button>
            </Tooltip>
            <Tooltip title="island 风格" variant="island">
                <Button size="small">island</Button>
            </Tooltip>
            <Tooltip title="无边框 island" variant="island" bordered={false}>
                <Button size="small">island borderless</Button>
            </Tooltip>
        </div>
        <div style={labelStyle}>placements</div>
        <div style={{ ...boxStyle, overflow: 'visible', display: 'grid', gridTemplateColumns: 'repeat(3, minmax(120px, 1fr))', gap: 16 }}>
            <Tooltip title="top-start" placement="top-start">
                <Button size="small">top-start</Button>
            </Tooltip>
            <Tooltip title="top" placement="top">
                <Button size="small">top</Button>
            </Tooltip>
            <Tooltip title="top-end" placement="top-end">
                <Button size="small">top-end</Button>
            </Tooltip>
            <Tooltip title="left" placement="left">
                <Button size="small">left</Button>
            </Tooltip>
            <Tooltip title="bottom" placement="bottom">
                <Button size="small">bottom</Button>
            </Tooltip>
            <Tooltip title="right" placement="right">
                <Button size="small">right</Button>
            </Tooltip>
        </div>
    </section>
);

const SelectEmptyKeySection = () => {
    const [value, setValue] = useState('');

    return (
        <div style={pageStyle}>
            <section data-testid="select-empty-key-region" style={sectionStyle}>
                <div style={labelStyle}>empty string key</div>
                <div data-testid="select-empty-key" style={boxStyle}>
                    <Select options={emptyKeyOptions} value={value} onChange={setValue} />
                </div>
                <div data-testid="select-empty-key-label" style={{ fontSize: 13, lineHeight: '18px', color: '#a08060' }}>
                    当前选中: <span style={{ color: '#19c8b9', fontWeight: 600 }}>
                        {emptyKeyOptions.find((item) => item.key === value)?.label}
                    </span>
                </div>
            </section>
        </div>
    );
};

const SwitchStateMatrixSection = () => {
    const [controlled, setControlled] = useState(false);

    return (
        <section data-testid="switch-state-matrix-region" style={sectionStyle}>
            <div style={labelStyle}>Switch state matrix</div>
            <div style={matrixGridStyle}>
                <div style={matrixCardStyle}>
                    <span style={labelStyle}>controlled default</span>
                    <div style={rowStyle}>
                        <Switch checked={controlled} onChange={setControlled} checkedChildren="ON" unCheckedChildren="OFF" />
                        <span data-testid="switch-controlled-state" style={{ fontSize: 13, fontWeight: 700 }}>
                            {controlled ? 'ON' : 'OFF'}
                        </span>
                    </div>
                </div>
                <div style={matrixCardStyle}>
                    <span style={labelStyle}>defaultChecked</span>
                    <Switch defaultChecked checkedChildren="开" unCheckedChildren="关" />
                </div>
                <div style={matrixCardStyle}>
                    <span style={labelStyle}>small checked</span>
                    <Switch size="small" defaultChecked checkedChildren="开" unCheckedChildren="关" />
                </div>
                <div style={matrixCardStyle}>
                    <span style={labelStyle}>disabled off/on</span>
                    <div style={rowStyle}>
                        <Switch disabled />
                        <Switch defaultChecked disabled />
                    </div>
                </div>
                <div style={matrixCardStyle}>
                    <span style={labelStyle}>loading off/on</span>
                    <div style={rowStyle}>
                        <Switch loading />
                        <Switch defaultChecked loading />
                    </div>
                </div>
            </div>
        </section>
    );
};

const CheckboxStateMatrixSection = () => {
    const [values, setValues] = useState<Array<string | number>>([101]);
    const keyboardOptions: CheckboxOption[] = [
        { label: '数字 101', value: 101 },
        { label: '文字 alpha', value: 'alpha' },
        { label: '禁用 beta', value: 'beta', disabled: true },
    ];

    return (
        <section data-testid="checkbox-state-matrix-region" style={sectionStyle}>
            <div style={labelStyle}>Checkbox size / direction / disabled matrix</div>
            <div data-testid="checkbox-size-matrix" style={matrixGridStyle}>
                <div data-testid="checkbox-size-small" style={matrixCardStyle}>
                    <span style={labelStyle}>small</span>
                    <Checkbox options={islandOptions.slice(0, 3)} defaultValue={['forest']} size="small" />
                </div>
                <div data-testid="checkbox-size-middle" style={matrixCardStyle}>
                    <span style={labelStyle}>middle</span>
                    <Checkbox options={islandOptions.slice(0, 3)} defaultValue={['beach']} size="middle" />
                </div>
                <div data-testid="checkbox-size-large" style={matrixCardStyle}>
                    <span style={labelStyle}>large</span>
                    <Checkbox options={islandOptions.slice(0, 3)} defaultValue={['garden']} size="large" />
                </div>
            </div>
            <div data-testid="checkbox-direction-disabled-matrix" style={matrixGridStyle}>
                <div style={matrixCardStyle}>
                    <span style={labelStyle}>vertical + option disabled</span>
                    <Checkbox options={critterOptions.slice(0, 4)} defaultValue={['butterfly']} direction="vertical" style={{ gap: 10 }} />
                </div>
                <div style={matrixCardStyle}>
                    <span style={labelStyle}>group disabled</span>
                    <Checkbox options={islandOptions.slice(0, 3)} defaultValue={['beach', 'garden']} disabled />
                </div>
                <div data-testid="checkbox-keyboard-matrix" style={matrixCardStyle}>
                    <span style={labelStyle}>numeric controlled</span>
                    <Checkbox options={keyboardOptions} value={values} onChange={setValues} style={{ gap: 12 }} />
                    <span data-testid="checkbox-numeric-state" style={{ fontSize: 13, fontWeight: 700 }}>
                        {values.length ? values.join(', ') : 'empty'}
                    </span>
                </div>
            </div>
        </section>
    );
};

const SelectStateMatrixSection = () => {
    const [flower, setFlower] = useState('');
    const [fruit, setFruit] = useState('autumn');

    return (
        <section data-testid="select-state-matrix-region" style={sectionStyle}>
            <div style={labelStyle}>Select placeholder / disabled / selected matrix</div>
            <div style={matrixGridStyle}>
                <div data-testid="select-placeholder-matrix" style={matrixCardStyle}>
                    <span style={labelStyle}>placeholder to selected</span>
                    <Select options={matrixSelectOptions} value={flower} onChange={setFlower} placeholder="请选择季节花" />
                    <span data-testid="select-placeholder-state" style={{ fontSize: 13, fontWeight: 700 }}>
                        {matrixSelectOptions.find((item) => item.key === flower)?.label ?? 'empty'}
                    </span>
                </div>
                <div data-testid="select-selected-matrix" style={matrixCardStyle}>
                    <span style={labelStyle}>selected value</span>
                    <Select options={matrixSelectOptions} value={fruit} onChange={setFruit} />
                    <span data-testid="select-selected-state" style={{ fontSize: 13, fontWeight: 700 }}>
                        {matrixSelectOptions.find((item) => item.key === fruit)?.label}
                    </span>
                </div>
                <div data-testid="select-disabled-matrix" style={matrixCardStyle}>
                    <span style={labelStyle}>disabled selected</span>
                    <Select options={matrixSelectOptions} value="winter" onChange={() => undefined} disabled />
                </div>
            </div>
        </section>
    );
};

const SelectPlacementSection = () => {
    const [normal, setNormal] = useState('spring');
    const [collision, setCollision] = useState('summer');

    return (
        <div style={{ ...pageStyle, maxWidth: 1080 }}>
            <section data-testid="select-placement-region" style={sectionStyle}>
                <div style={labelStyle}>dropdown placement</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 24, minHeight: 420, padding: '240px 16px 16px' }}>
                    <div data-testid="select-placement-right" style={matrixCardStyle}>
                        <span style={labelStyle}>right side open</span>
                        <Select options={matrixSelectOptions} value={normal} onChange={setNormal} />
                    </div>
                    <div data-testid="select-placement-left" style={matrixCardStyle}>
                        <span style={labelStyle}>left collision open</span>
                        <Select options={matrixSelectOptions} value={collision} onChange={setCollision} />
                    </div>
                </div>
            </section>
        </div>
    );
};

export const ControlsParity: Story = {
    render: () => (
        <div style={pageStyle}>
            <SwitchSection />
            <CheckboxSection />
            <SelectSection />
            <RadioSection />
            <TooltipSection />
        </div>
    ),
    play: async ({ canvas, canvasElement }) => {
        await expect(canvas.getByTestId('switch-state-label')).toHaveTextContent('OFF');
        await userEvent.click(canvas.getAllByRole('switch')[0]);
        await expect(canvas.getByTestId('switch-state-label')).toHaveTextContent('ON');
        await userEvent.click(canvas.getAllByRole('switch')[0]);
        await expect(canvas.getByTestId('switch-state-label')).toHaveTextContent('OFF');

        await expect(canvas.getByTestId('checkbox-selected-label')).toHaveTextContent('海滩');
        await userEvent.click(canvas.getAllByText('🌳 森林')[0]);
        await expect(canvas.getByTestId('checkbox-selected-label')).toHaveTextContent('森林');
        await userEvent.click(canvas.getAllByText('🌳 森林')[0]);
        await userEvent.click(canvas.getByText('🦀 螃蟹'));
        await expect(canvas.getByText('🦀 螃蟹')).toBeVisible();

        await expect(canvas.getByText('请选择花朵')).toBeVisible();
        await expect(canvas.getByText('玫瑰')).toBeVisible();
        await expect(canvas.getByTestId('radio-selected-label')).toHaveTextContent('春天');
        await userEvent.click(canvas.getAllByText('☀️ 夏天')[0]);
        await expect(canvas.getByTestId('radio-selected-label')).toHaveTextContent('夏天');
        await userEvent.hover(canvas.getByRole('button', { name: 'hover default' }));
        const docBody = within(canvasElement.ownerDocument.body);
        const tooltip = await docBody.findByRole('tooltip', {}, { timeout: 3000 });
        await expect(tooltip).toHaveTextContent('默认提示');
    },
};

export const ControlsPlaywrightParity: Story = {
    render: () => (
        <div style={pageStyle}>
            <SwitchSection />
            <CheckboxSection />
            <SelectSection />
            <RadioSection />
            <TooltipSection />
        </div>
    ),
};

export const SelectEmptyKeyParity: Story = {
    render: () => <SelectEmptyKeySection />,
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const selectBox = canvas.getByTestId('select-empty-key');
        await expect(canvas.getByTestId('select-empty-key-label')).toHaveTextContent('空键选项');
        const trigger1 = within(selectBox).getAllByText('空键选项')[0].closest('button, div');
        if (!trigger1) throw new Error('Select trigger element not found');
        await userEvent.click(trigger1);

        const body = within(document.body);
        await userEvent.click(await body.findByText('普通选项'));
        await expect(canvas.getByTestId('select-empty-key-label')).toHaveTextContent('普通选项');
        const trigger2 = within(selectBox).getAllByText('普通选项')[0].closest('button, div');
        if (!trigger2) throw new Error('Select trigger element not found');
        await userEvent.click(trigger2);
        const emptyOptions = await body.findAllByText('空键选项');
        await userEvent.click(emptyOptions[emptyOptions.length - 1]);
        await expect(canvas.getByTestId('select-empty-key-label')).toHaveTextContent('空键选项');
    },
};

export const SelectEmptyKeyPlaywrightParity: Story = {
    render: () => <SelectEmptyKeySection />,
};

export const ControlsStateMatrixParity: Story = {
    render: () => (
        <div style={pageStyle}>
            <SwitchStateMatrixSection />
            <CheckboxStateMatrixSection />
            <SelectStateMatrixSection />
        </div>
    ),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const body = within(document.body);

        await expect(canvas.getByTestId('switch-controlled-state')).toHaveTextContent('OFF');
        const switches = canvas.getAllByRole('switch');
        await userEvent.click(switches[0]);
        await expect(canvas.getByTestId('switch-controlled-state')).toHaveTextContent('ON');
        await userEvent.click(switches[0]);
        await expect(canvas.getByTestId('switch-controlled-state')).toHaveTextContent('OFF');
        await expect(switches[1]).toHaveAttribute('aria-checked', 'true');
        await expect(switches[2]).toHaveAttribute('aria-checked', 'true');
        await expect(switches[3]).toBeDisabled();
        await expect(switches[4]).toBeDisabled();
        await expect(switches[4]).toHaveAttribute('aria-checked', 'true');
        await expect(switches[5]).toHaveAttribute('aria-checked', 'false');
        await expect(switches[6]).toHaveAttribute('aria-checked', 'true');

        await expect(canvas.getByTestId('checkbox-numeric-state')).toHaveTextContent('101');
        await userEvent.click(canvas.getByText('文字 alpha'));
        await expect(canvas.getByTestId('checkbox-numeric-state')).toHaveTextContent('101, alpha');
        await userEvent.click(canvas.getByText('文字 alpha'));
        await expect(canvas.getByTestId('checkbox-numeric-state')).toHaveTextContent('101');
        await userEvent.click(canvas.getByText('禁用 beta'));
        await expect(canvas.getByTestId('checkbox-numeric-state')).toHaveTextContent('101');

        await expect(canvas.getByTestId('select-placeholder-state')).toHaveTextContent('empty');
        const placeholderTrigger = within(canvas.getByTestId('select-placeholder-matrix')).getByText('请选择季节花').closest('button, div');
        if (!placeholderTrigger) throw new Error('Select trigger element not found');
        await userEvent.click(placeholderTrigger);
        await userEvent.click(await body.findByText('夏葵'));
        await expect(canvas.getByTestId('select-placeholder-state')).toHaveTextContent('夏葵');
        const disabledTrigger = within(canvas.getByTestId('select-disabled-matrix')).getByText('冬莓').closest('button, div');
        if (!disabledTrigger) throw new Error('Select trigger element not found');
        await userEvent.click(disabledTrigger);
        await expect(body.queryByText('春樱')).not.toBeInTheDocument();
    },
};

export const ControlsStateMatrixStable: Story = {
    render: () => (
        <div style={pageStyle}>
            <SwitchStateMatrixSection />
            <CheckboxStateMatrixSection />
            <SelectStateMatrixSection />
        </div>
    ),
};

export const SelectPlacementParity: Story = {
    render: () => <SelectPlacementSection />,
};
