import type { Meta, StoryObj } from '@storybook/react';
import type { CSSProperties } from 'react';
import { expect, within } from 'storybook/test';
import { Progress, Tag } from '../src';

const meta = {
    title: 'Regression/Parity/Tag Progress',
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
    maxWidth: 780,
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
    gap: 10,
} satisfies CSSProperties;

const labelStyle = {
    color: '#a0936e',
    fontSize: 13,
    fontWeight: 700,
    marginBottom: 4,
} satisfies CSSProperties;

const COLORS = [
    'default',
    'app-pink',
    'purple',
    'app-blue',
    'app-yellow',
    'app-orange',
    'app-teal',
    'app-green',
    'app-red',
    'lime-green',
    'yellow-green',
    'brown',
    'warm-peach-pink',
] as const;

const VARIANTS = ['soft', 'solid', 'outlined', 'dashed'] as const;
const SIZES = ['small', 'medium', 'large'] as const;

export const TagParity: Story = {
    name: 'Tag — variants / sizes / colors',
    render: () => (
        <div style={pageStyle}>
            <div style={sectionStyle}>
                <div style={labelStyle}>Sizes</div>
                <div style={rowStyle}>
                    {SIZES.map((s) => (
                        <Tag key={s} size={s}>
                            {s}
                        </Tag>
                    ))}
                </div>
            </div>

            <div style={sectionStyle}>
                <div style={labelStyle}>Variants (default color)</div>
                <div style={rowStyle}>
                    {VARIANTS.map((v) => (
                        <Tag key={v} variant={v}>
                            {v}
                        </Tag>
                    ))}
                </div>
            </div>

            <div style={sectionStyle}>
                <div style={labelStyle}>Colors — soft</div>
                <div style={rowStyle}>
                    {COLORS.map((c) => (
                        <Tag key={c} color={c} variant="soft">
                            {c}
                        </Tag>
                    ))}
                </div>
            </div>

            <div style={sectionStyle}>
                <div style={labelStyle}>Colors — solid</div>
                <div style={rowStyle}>
                    {COLORS.filter((c) => c !== 'default').map((c) => (
                        <Tag key={c} color={c} variant="solid">
                            {c}
                        </Tag>
                    ))}
                </div>
            </div>

            <div style={sectionStyle}>
                <div style={labelStyle}>Closable</div>
                <div style={rowStyle}>
                    <Tag closable color="app-teal">
                        可关闭
                    </Tag>
                    <Tag closable color="app-pink" variant="solid">
                        solid + close
                    </Tag>
                </div>
            </div>

            <div style={sectionStyle}>
                <div style={labelStyle}>Disabled</div>
                <div style={rowStyle}>
                    <Tag disabled>disabled</Tag>
                    <Tag disabled closable>
                        disabled closable
                    </Tag>
                </div>
            </div>
        </div>
    ),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const tags = canvas.getAllByText('medium');
        await expect(tags.length).toBeGreaterThan(0);
        const tagEl = tags[0].closest('.animal-tag');
        await expect(tagEl).not.toBeNull();
        await expect(tagEl?.classList.contains('animal-tag-size-medium')).toBe(true);
    },
};

export const ProgressParity: Story = {
    name: 'Progress — sizes / positions',
    render: () => (
        <div style={pageStyle}>
            <div style={sectionStyle}>
                <div style={labelStyle}>Sizes</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {SIZES.map((s) => (
                        <div key={s}>
                            <div style={{ ...labelStyle, fontSize: 11, marginBottom: 4 }}>{s}</div>
                            <Progress percent={65} size={s} />
                        </div>
                    ))}
                </div>
            </div>

            <div style={sectionStyle}>
                <div style={labelStyle}>Info position: inside</div>
                <Progress percent={70} infoPosition="inside" />
                <div style={labelStyle}>Info position: right</div>
                <Progress percent={40} infoPosition="right" />
                <div style={labelStyle}>Info position: top</div>
                <Progress percent={85} infoPosition="top" />
            </div>

            <div style={sectionStyle}>
                <div style={labelStyle}>showInfo=false</div>
                <Progress percent={50} showInfo={false} />
            </div>

            <div style={sectionStyle}>
                <div style={labelStyle}>Edge cases (0% / 100% / inside below threshold)</div>
                <Progress percent={0} infoPosition="inside" />
                <Progress percent={10} infoPosition="inside" />
                <Progress percent={100} infoPosition="inside" />
            </div>

            <div style={sectionStyle}>
                <div style={labelStyle}>Custom format</div>
                <Progress
                    percent={75}
                    infoPosition="right"
                    infoFormat={(p) => `${p} / 100`}
                />
            </div>
        </div>
    ),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const progressBars = canvasElement.querySelectorAll('[role="progressbar"]');
        await expect(progressBars.length).toBeGreaterThan(0);
        const first = progressBars[0] as HTMLElement;
        await expect(first.getAttribute('aria-valuemin')).toBe('0');
        await expect(first.getAttribute('aria-valuemax')).toBe('100');
    },
};
