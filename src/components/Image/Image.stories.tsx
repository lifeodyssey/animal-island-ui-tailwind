import type { Meta, StoryObj } from '@storybook/react-vite';
import { Image } from './Image';

// Inline SVG data-URI — no network required, loads instantly in any environment
const SAMPLE_SRC =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='150'%3E%3Crect width='100%25' height='100%25' fill='%23a8d5c2'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='18' fill='%23fff'%3EIsland%3C/text%3E%3C/svg%3E";

const meta = {
    component: Image,
    tags: ['ai-generated'],
    args: { src: SAMPLE_SRC, alt: 'Animal Island scenery', preview: false },
} satisfies Meta<typeof Image>;

export default meta;
type Story = StoryObj<typeof meta>;

const rowStyle: React.CSSProperties = {
    display: 'flex',
    gap: 24,
    padding: '24px',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
};

const labelStyle: React.CSSProperties = {
    marginBottom: 8,
    fontSize: 12,
    color: '#7a6652',
    fontFamily: 'monospace',
};

/** default 大阴影大圆角（默认）/ bordered 边框小圆角 / stamp 邮票齿孔。 */
export const Variants: Story = {
    render: () => (
        <div style={rowStyle}>
            {(['default', 'bordered', 'stamp'] as const).map((variant) => (
                <div key={variant}>
                    <p style={labelStyle}>{variant}</p>
                    <Image src={SAMPLE_SRC} alt={variant} variant={variant} preview={false} width={160} height={120} />
                </div>
            ))}
        </div>
    ),
};

/** 邮票变体 + 右上角发行年份。 */
export const StampWithYear: Story = {
    args: { variant: 'stamp', stampYear: '2024', width: 200, height: 150 },
};

/** bordered 变体下的彩色相框。 */
export const BorderedColors: Story = {
    render: () => (
        <div style={rowStyle}>
            {(['default', 'app-pink', 'purple', 'app-teal', 'app-green'] as const).map((color) => (
                <div key={color}>
                    <p style={labelStyle}>{color}</p>
                    <Image
                        src={SAMPLE_SRC}
                        alt={color}
                        variant="bordered"
                        color={color}
                        preview={false}
                        width={120}
                        height={90}
                    />
                </div>
            ))}
        </div>
    ),
};

/** 加载失败：相机图标占位。 */
export const ErrorState: Story = {
    args: { src: '/nonexistent-image.png', alt: 'broken image', width: 160, height: 120 },
};
