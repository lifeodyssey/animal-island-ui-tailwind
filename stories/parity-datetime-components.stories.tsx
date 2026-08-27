import type { Meta, StoryObj } from '@storybook/react';
import type { CSSProperties } from 'react';
import { useState } from 'react';
import { Carousel, Countdown, DatePicker, TimePicker } from '../src';

const meta = {
    title: 'Regression/Parity/Datetime Components',
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
    maxWidth: 980,
    fontFamily: 'var(--animal-font-family)',
} satisfies CSSProperties;

const sectionStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
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
    fontWeight: 700,
} satisfies CSSProperties;

// ─── Carousel ───────────────────────────────────────────────────────────────

const slides = [
    { bg: '#e6f9f6', label: '第一张' },
    { bg: '#fdf6d9', label: '第二张' },
    { bg: '#fde8e8', label: '第三张' },
];

export const CarouselParity: Story = {
    name: 'Carousel',
    render: () => (
        <div style={pageStyle}>
            <div style={sectionStyle}>
                <div style={labelStyle}>Basic Carousel</div>
                <Carousel style={{ width: 400 }}>
                    {slides.map((s) => (
                        <div
                            key={s.label}
                            style={{
                                height: 160,
                                background: s.bg,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 20,
                                fontWeight: 700,
                                color: '#725d42',
                            }}
                        >
                            {s.label}
                        </div>
                    ))}
                </Carousel>
            </div>
            <div style={sectionStyle}>
                <div style={labelStyle}>Without Arrows</div>
                <Carousel showArrows={false} style={{ width: 400 }}>
                    {slides.map((s) => (
                        <div key={s.label} style={{ height: 120, background: s.bg }} />
                    ))}
                </Carousel>
            </div>
        </div>
    ),
};

export const CarouselStable: Story = {
    name: 'Carousel (stable)',
    render: () => (
        <Carousel style={{ width: 360 }}>
            {slides.map((s) => (
                <div key={s.label} style={{ height: 120, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                    {s.label}
                </div>
            ))}
        </Carousel>
    ),
};

// ─── Countdown ──────────────────────────────────────────────────────────────

const futureMs = Date.now() + 3 * 3600 * 1000 + 25 * 60 * 1000 + 40 * 1000;

export const CountdownParity: Story = {
    name: 'Countdown',
    render: () => (
        <div style={pageStyle}>
            <div style={sectionStyle}>
                <div style={labelStyle}>Default (HH:mm:ss)</div>
                <Countdown value={futureMs} />
            </div>
            <div style={sectionStyle}>
                <div style={labelStyle}>Island variant</div>
                <Countdown value={futureMs} variant="island" />
            </div>
            <div style={sectionStyle}>
                <div style={labelStyle}>Bordered</div>
                <Countdown value={futureMs} bordered />
            </div>
            <div style={sectionStyle}>
                <div style={labelStyle}>Sizes</div>
                <div style={rowStyle}>
                    <Countdown value={futureMs} size="small" />
                    <Countdown value={futureMs} size="middle" />
                    <Countdown value={futureMs} size="large" />
                </div>
            </div>
            <div style={sectionStyle}>
                <div style={labelStyle}>With DD:HH:mm:ss</div>
                <Countdown value={futureMs + 2 * 86400 * 1000} format="DD:HH:mm:ss" />
            </div>
            <div style={sectionStyle}>
                <div style={labelStyle}>With prefix</div>
                <Countdown value={futureMs} prefix="剩余时间：" />
            </div>
        </div>
    ),
};

export const CountdownStable: Story = {
    name: 'Countdown (stable)',
    render: () => <Countdown value={futureMs} />,
};

// ─── TimePicker ─────────────────────────────────────────────────────────────

export const TimePickerParity: Story = {
    name: 'TimePicker',
    render: () => (
        <div style={pageStyle}>
            <div style={sectionStyle}>
                <div style={labelStyle}>Sizes</div>
                <div style={rowStyle}>
                    <TimePicker size="small" placeholder="小号" />
                    <TimePicker size="middle" placeholder="中号" />
                    <TimePicker size="large" placeholder="大号" />
                </div>
            </div>
            <div style={sectionStyle}>
                <div style={labelStyle}>Status</div>
                <div style={rowStyle}>
                    <TimePicker status="error" defaultValue="10:30:00" />
                    <TimePicker status="warning" defaultValue="14:00:00" />
                </div>
            </div>
            <div style={sectionStyle}>
                <div style={labelStyle}>Allow Clear</div>
                <TimePicker allowClear defaultValue="09:15:30" />
            </div>
            <div style={sectionStyle}>
                <div style={labelStyle}>No seconds (HH:mm)</div>
                <TimePicker format="HH:mm" />
            </div>
            <div style={sectionStyle}>
                <div style={labelStyle}>Disabled</div>
                <TimePicker disabled defaultValue="12:00:00" />
            </div>
        </div>
    ),
};

export const TimePickerStable: Story = {
    name: 'TimePicker (stable)',
    render: () => <TimePicker defaultValue="09:30:00" allowClear />,
};

// ─── DatePicker ─────────────────────────────────────────────────────────────

export const DatePickerParity: Story = {
    name: 'DatePicker',
    render: () => (
        <div style={pageStyle}>
            <div style={sectionStyle}>
                <div style={labelStyle}>Sizes</div>
                <div style={rowStyle}>
                    <DatePicker size="small" placeholder="小号" />
                    <DatePicker size="middle" placeholder="中号" />
                    <DatePicker size="large" placeholder="大号" />
                </div>
            </div>
            <div style={sectionStyle}>
                <div style={labelStyle}>Status</div>
                <div style={rowStyle}>
                    <DatePicker status="error" defaultValue="2025-01-15" />
                    <DatePicker status="warning" defaultValue="2025-06-01" />
                </div>
            </div>
            <div style={sectionStyle}>
                <div style={labelStyle}>Allow Clear</div>
                <DatePicker allowClear defaultValue="2025-03-20" />
            </div>
            <div style={sectionStyle}>
                <div style={labelStyle}>Month picker</div>
                <DatePicker picker="month" />
            </div>
            <div style={sectionStyle}>
                <div style={labelStyle}>Disabled</div>
                <DatePicker disabled defaultValue="2025-01-01" />
            </div>
        </div>
    ),
};

export const DatePickerStable: Story = {
    name: 'DatePicker (stable)',
    render: () => <DatePicker defaultValue="2025-08-27" allowClear />,
};

export const DatePickerRangeParity: Story = {
    name: 'DatePicker Range',
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState<[string, string] | string | null>(null);
            return (
                <div style={pageStyle}>
                    <div style={sectionStyle}>
                        <div style={labelStyle}>Range picker</div>
                        <DatePicker range value={value as [string, string] | null} onChange={(v) => setValue(v)} />
                        {value && Array.isArray(value) && (
                            <div style={{ color: '#8a7b66', fontSize: 13 }}>
                                {value[0]} ~ {value[1]}
                            </div>
                        )}
                    </div>
                </div>
            );
        };
        return <Demo />;
    },
};
