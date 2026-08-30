import type { Meta, StoryObj } from '@storybook/react';
import type { CSSProperties } from 'react';
import { useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Carousel, Countdown, DatePicker, TimePicker } from '../src';
import type { DatePickerValue } from '../src';

const meta = {
    title: 'Regression/Parity/Pickers',
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
    fontFamily: 'var(--animal-font-family)',
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

const labelStyle = {
    color: '#a0936e',
    fontSize: 14,
    fontWeight: 500,
} satisfies CSSProperties;

// ─── Carousel ────────────────────────────────────────────────────────────────

const CarouselSlide = ({ label, bg }: { label: string; bg: string }) => (
    <div
        style={{
            height: 180,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: bg,
            fontSize: 22,
            fontWeight: 700,
            color: '#8b7355',
            borderRadius: 20,
        }}
    >
        {label}
    </div>
);

// 注意：Carousel 用 Children.toArray 按直接子元素切分 slide，
// 不能把三张 slide 包进组件或 Fragment，必须作为数组/直接子元素传入。
const carouselSlides = [
    <CarouselSlide key="beach" label="🏖️ 海滩" bg="#fffbe7" />,
    <CarouselSlide key="plaza" label="🌳 广场" bg="#f0f8e8" />,
    <CarouselSlide key="museum" label="🏛️ 博物馆" bg="#e8f0f8" />,
];

const CarouselDemo = ({ loop, testId }: { loop: boolean; testId: string }) => {
    const [index, setIndex] = useState(0);

    return (
        <section data-testid={`${testId}-region`} style={sectionStyle}>
            <div data-testid={`${testId}-index-label`} style={labelStyle}>
                当前索引: {index}
            </div>
            <Carousel loop={loop} onChange={setIndex} aria-label="parity 轮播" style={{ maxWidth: 480 }}>
                {carouselSlides}
            </Carousel>
        </section>
    );
};

export const CarouselParity: Story = {
    render: () => (
        <div style={pageStyle}>
            <CarouselDemo loop testId="carousel" />
        </div>
    ),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const label = canvas.getByTestId('carousel-index-label');

        await expect(label).toHaveTextContent('当前索引: 0');
        await userEvent.click(canvas.getByRole('button', { name: '下一张' }));
        await expect(label).toHaveTextContent('当前索引: 1');
        await userEvent.click(canvas.getByRole('button', { name: '转到第 3 张' }));
        await expect(label).toHaveTextContent('当前索引: 2');
        await expect(canvas.getByRole('button', { name: '转到第 3 张' })).toHaveAttribute('aria-current', 'true');
        // loop 模式下最后一张再点下一张回到第一张
        await userEvent.click(canvas.getByRole('button', { name: '下一张' }));
        await expect(label).toHaveTextContent('当前索引: 0');

        const region = canvas.getByRole('region', { name: 'parity 轮播' });
        region.focus();
        await userEvent.keyboard('{ArrowRight}');
        await expect(label).toHaveTextContent('当前索引: 1');
        await userEvent.keyboard('{End}');
        await expect(label).toHaveTextContent('当前索引: 2');
        await userEvent.keyboard('{Home}');
        await expect(label).toHaveTextContent('当前索引: 0');
        // loop 模式下第一张按左箭头跳到最后一张
        await userEvent.keyboard('{ArrowLeft}');
        await expect(label).toHaveTextContent('当前索引: 2');
    },
};

export const CarouselPlaywrightParity: Story = {
    render: () => (
        <div style={pageStyle}>
            <CarouselDemo loop testId="carousel" />
        </div>
    ),
};

export const CarouselNoLoopParity: Story = {
    render: () => (
        <div style={pageStyle}>
            <CarouselDemo loop={false} testId="carousel-no-loop" />
        </div>
    ),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const label = canvas.getByTestId('carousel-no-loop-index-label');
        const prev = canvas.getByRole('button', { name: '上一张' });
        const next = canvas.getByRole('button', { name: '下一张' });

        await expect(label).toHaveTextContent('当前索引: 0');
        await expect(prev).toBeDisabled();
        await expect(next).toBeEnabled();
        await userEvent.click(next);
        await expect(label).toHaveTextContent('当前索引: 1');
        await expect(prev).toBeEnabled();
        await userEvent.click(next);
        await expect(label).toHaveTextContent('当前索引: 2');
        await expect(next).toBeDisabled();
    },
};

export const CarouselNoLoopPlaywrightParity: Story = {
    render: () => (
        <div style={pageStyle}>
            <CarouselDemo loop={false} testId="carousel-no-loop" />
        </div>
    ),
};

export const CarouselShowcaseParity: Story = {
    render: () => (
        <div style={pageStyle}>
            <section data-testid="carousel-default-region" style={sectionStyle}>
                <div style={labelStyle}>default</div>
                <Carousel aria-label="默认轮播" style={{ maxWidth: 480 }}>
                    {carouselSlides}
                </Carousel>
            </section>
            <section data-testid="carousel-autoplay-region" style={sectionStyle}>
                <div style={labelStyle}>autoplay（长间隔静态定格）</div>
                <Carousel aria-label="自动播放轮播" autoplay interval={60_000} style={{ maxWidth: 480 }}>
                    {carouselSlides}
                </Carousel>
            </section>
            <section data-testid="carousel-no-arrows-region" style={sectionStyle}>
                <div style={labelStyle}>no arrows</div>
                <Carousel aria-label="无箭头轮播" showArrows={false} defaultActiveIndex={1} style={{ maxWidth: 480 }}>
                    {carouselSlides}
                </Carousel>
            </section>
            <section data-testid="carousel-no-dots-region" style={sectionStyle}>
                <div style={labelStyle}>no dots</div>
                <Carousel aria-label="无圆点轮播" showDots={false} defaultActiveIndex={2} style={{ maxWidth: 480 }}>
                    {carouselSlides}
                </Carousel>
            </section>
        </div>
    ),
};

// ─── Countdown ───────────────────────────────────────────────────────────────

// 固定结束时间，配合视觉测试冻结的时钟（2026-12-31T22:00:00）得到稳定画面
const FIXED_COUNTDOWN_TARGET = new Date('2027-01-01T00:00:00');

const CountdownDemo = () => (
    <section data-testid="countdown-parity-region" style={sectionStyle}>
        <div style={labelStyle}>live countdown（相对当前时间）</div>
        <Countdown value={Date.now() + 3_600_000} prefix="距打烊" />
    </section>
);

export const CountdownParity: Story = {
    render: () => (
        <div style={pageStyle}>
            <CountdownDemo />
        </div>
    ),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const timer = canvas.getByRole('timer');
        await expect(timer).toBeInTheDocument();
        const srOnly = timer.querySelector('.animal-countdown-sr-only');
        expect(srOnly?.textContent ?? '').toMatch(/^\d{2}:\d{2}:\d{2}$/);
        await expect(canvas.getByText('距打烊')).toBeVisible();
    },
};

export const CountdownPlaywrightParity: Story = {
    render: () => (
        <div style={pageStyle}>
            <CountdownDemo />
        </div>
    ),
};

export const CountdownShowcaseParity: Story = {
    render: () => (
        <div style={pageStyle}>
            <section data-testid="countdown-variants-region" style={sectionStyle}>
                <div style={labelStyle}>default / island / bordered</div>
                <div style={rowStyle}>
                    <Countdown value={FIXED_COUNTDOWN_TARGET} />
                    <Countdown value={FIXED_COUNTDOWN_TARGET} variant="island" />
                    <Countdown value={FIXED_COUNTDOWN_TARGET} bordered />
                </div>
            </section>
            <section data-testid="countdown-sizes-region" style={sectionStyle}>
                <div style={labelStyle}>small / middle / large</div>
                <Countdown value={FIXED_COUNTDOWN_TARGET} size="small" />
                <Countdown value={FIXED_COUNTDOWN_TARGET} size="middle" />
                <Countdown value={FIXED_COUNTDOWN_TARGET} size="large" />
            </section>
            <section data-testid="countdown-format-prefix-region" style={sectionStyle}>
                <div style={labelStyle}>prefix + custom format</div>
                <Countdown value={FIXED_COUNTDOWN_TARGET} prefix="活动结束还有" format="DD 天 HH:mm:ss" />
                <Countdown value={FIXED_COUNTDOWN_TARGET} format="HH 时 mm 分 ss 秒" />
            </section>
        </div>
    ),
};

// ─── DatePicker ──────────────────────────────────────────────────────────────

const DatePickerDemo = () => {
    const [value, setValue] = useState<DatePickerValue>('2026-08-15');

    return (
        <div style={pageStyle}>
            <section data-testid="datepicker-single-region" style={sectionStyle}>
                <div data-testid="datepicker-value-label" style={labelStyle}>
                    选中: {typeof value === 'string' ? value : '无'}
                </div>
                <DatePicker defaultValue="2026-08-15" onChange={setValue} aria-label="单选日期" />
            </section>
            <section data-testid="datepicker-disabled-date-region" style={sectionStyle}>
                <div style={labelStyle}>disabledDate（禁用 2026-08-15 之前的日期）</div>
                <DatePicker
                    defaultValue="2026-08-15"
                    disabledDate={(date) => date < new Date(2026, 7, 15)}
                    aria-label="禁用部分日期"
                />
            </section>
        </div>
    );
};

export const DatePickerParity: Story = {
    render: () => <DatePickerDemo />,
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const single = within(canvas.getByTestId('datepicker-single-region'));

        await expect(canvas.getByTestId('datepicker-value-label')).toHaveTextContent('2026-08-15');
        await userEvent.click(single.getByRole('combobox'));
        const dialog = await canvas.findByRole('dialog');
        await userEvent.click(within(dialog).getByRole('button', { name: '2026年8月20日' }));
        // 点选仅更新待选值，确定后才提交
        await expect(canvas.getByTestId('datepicker-value-label')).toHaveTextContent('2026-08-15');
        await userEvent.click(within(dialog).getByRole('button', { name: '确定' }));
        await expect(canvas.getByTestId('datepicker-value-label')).toHaveTextContent('2026-08-20');
        await waitFor(() => expect(canvas.queryByRole('dialog')).not.toBeInTheDocument());

        // 重新打开后 Escape 关闭
        await userEvent.click(single.getByRole('combobox'));
        await canvas.findByRole('dialog');
        await userEvent.keyboard('{Escape}');
        await waitFor(() => expect(canvas.queryByRole('dialog')).not.toBeInTheDocument());

        // disabledDate 的格子禁用且不可点选
        const disabledRegion = within(canvas.getByTestId('datepicker-disabled-date-region'));
        await userEvent.click(disabledRegion.getByRole('combobox'));
        const dialog2 = await canvas.findByRole('dialog');
        const disabledCell = within(dialog2).getByRole('button', { name: '2026年8月10日' });
        await expect(disabledCell).toBeDisabled();
        await expect(disabledCell).toHaveClass('animal-datepicker-day-disabled');
        await expect(disabledRegion.getByRole('combobox')).toHaveTextContent('2026-08-15');
    },
};

export const DatePickerPlaywrightParity: Story = {
    render: () => <DatePickerDemo />,
};

const DatePickerRangeDemo = () => {
    const [value, setValue] = useState<DatePickerValue>(['2026-08-10', '2026-08-20']);

    return (
        <section data-testid="datepicker-range-region" style={sectionStyle}>
            <div data-testid="datepicker-range-label" style={labelStyle}>
                范围: {Array.isArray(value) ? value.join(' ~ ') : '无'}
            </div>
            <DatePicker range defaultValue={['2026-08-10', '2026-08-20']} onChange={setValue} aria-label="范围日期" />
        </section>
    );
};

export const DatePickerRangeParity: Story = {
    render: () => (
        <div style={pageStyle}>
            <DatePickerRangeDemo />
        </div>
    ),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await userEvent.click(canvas.getByRole('combobox'));
        const dialog = await canvas.findByRole('dialog', { name: '选择日期范围' });
        await userEvent.click(within(dialog).getByRole('button', { name: '2026年8月12日' }));
        await userEvent.click(within(dialog).getByRole('button', { name: '2026年8月18日' }));
        await userEvent.click(within(dialog).getByRole('button', { name: '确定' }));
        await expect(canvas.getByTestId('datepicker-range-label')).toHaveTextContent('2026-08-12 ~ 2026-08-18');
        await waitFor(() => expect(canvas.queryByRole('dialog')).not.toBeInTheDocument());
    },
};

export const DatePickerRangePlaywrightParity: Story = {
    render: () => (
        <div style={pageStyle}>
            <DatePickerRangeDemo />
        </div>
    ),
};

export const DatePickerShowcaseParity: Story = {
    render: () => (
        <div style={pageStyle}>
            <section data-testid="datepicker-basic-region" style={sectionStyle}>
                <div style={labelStyle}>single / range / month picker</div>
                <div style={rowStyle}>
                    <DatePicker value="2026-08-15" aria-label="单选示例" />
                    <DatePicker range value={['2026-08-10', '2026-08-20']} aria-label="范围示例" />
                    <DatePicker picker="month" value="2026-08" aria-label="月份示例" />
                </div>
            </section>
            <section data-testid="datepicker-sizes-region" style={sectionStyle}>
                <div style={labelStyle}>small / middle / large</div>
                <div style={rowStyle}>
                    <DatePicker size="small" value="2026-08-15" aria-label="小尺寸日期" />
                    <DatePicker size="middle" value="2026-08-15" aria-label="中尺寸日期" />
                    <DatePicker size="large" value="2026-08-15" aria-label="大尺寸日期" />
                </div>
            </section>
            <section data-testid="datepicker-status-region" style={sectionStyle}>
                <div style={labelStyle}>error / warning / disabled</div>
                <div style={rowStyle}>
                    <DatePicker status="error" value="2026-08-15" aria-label="错误状态日期" />
                    <DatePicker status="warning" value="2026-08-15" aria-label="警告状态日期" />
                    <DatePicker disabled value="2026-08-15" aria-label="禁用日期" />
                </div>
            </section>
        </div>
    ),
};

// ─── TimePicker ──────────────────────────────────────────────────────────────

const TimePickerDemo = () => {
    const [value, setValue] = useState<string | null>('09:30:00');

    return (
        <section data-testid="timepicker-region" style={sectionStyle}>
            <div data-testid="timepicker-value-label" style={labelStyle}>
                选中: {value ?? '无'}
            </div>
            <TimePicker defaultValue="09:30:00" onChange={setValue} allowClear aria-label="时间选择" />
        </section>
    );
};

export const TimePickerParity: Story = {
    render: () => (
        <div style={pageStyle}>
            <TimePickerDemo />
        </div>
    ),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await expect(canvas.getByTestId('timepicker-value-label')).toHaveTextContent('09:30:00');
        await userEvent.click(canvas.getByRole('combobox'));
        const dialog = await canvas.findByRole('dialog', { name: '选择时间' });
        await userEvent.click(within(dialog).getByRole('button', { name: '10 时' }));
        await userEvent.click(within(dialog).getByRole('button', { name: '45 分' }));
        await userEvent.click(within(dialog).getByRole('button', { name: '确定' }));
        await expect(canvas.getByTestId('timepicker-value-label')).toHaveTextContent('10:45:00');
        await waitFor(() => expect(canvas.queryByRole('dialog')).not.toBeInTheDocument());

        await userEvent.click(canvas.getByRole('button', { name: '清除时间' }));
        await expect(canvas.getByTestId('timepicker-value-label')).toHaveTextContent('选中: 无');
    },
};

export const TimePickerPlaywrightParity: Story = {
    render: () => (
        <div style={pageStyle}>
            <TimePickerDemo />
        </div>
    ),
};

export const TimePickerShowcaseParity: Story = {
    render: () => (
        <div style={pageStyle}>
            <section data-testid="timepicker-format-region" style={sectionStyle}>
                <div style={labelStyle}>HH:mm / HH:mm:ss / step</div>
                <div style={rowStyle}>
                    <TimePicker format="HH:mm" value="09:30" aria-label="时分格式" />
                    <TimePicker value="09:30:45" aria-label="时分秒格式" />
                    <TimePicker value="09:30:00" minuteStep={15} secondStep={30} aria-label="步进时间" />
                </div>
            </section>
            <section data-testid="timepicker-sizes-region" style={sectionStyle}>
                <div style={labelStyle}>small / middle / large</div>
                <div style={rowStyle}>
                    <TimePicker size="small" value="09:30:45" aria-label="小尺寸时间" />
                    <TimePicker size="middle" value="09:30:45" aria-label="中尺寸时间" />
                    <TimePicker size="large" value="09:30:45" aria-label="大尺寸时间" />
                </div>
            </section>
            <section data-testid="timepicker-status-region" style={sectionStyle}>
                <div style={labelStyle}>error / warning / disabled</div>
                <div style={rowStyle}>
                    <TimePicker status="error" value="09:30:45" aria-label="错误状态时间" />
                    <TimePicker status="warning" value="09:30:45" aria-label="警告状态时间" />
                    <TimePicker disabled value="09:30:45" aria-label="禁用时间" />
                </div>
            </section>
        </div>
    ),
};
