import type { Meta, StoryObj } from '@storybook/react-vite';
import { Carousel } from './Carousel';

const meta = {
    component: Carousel,
    tags: ['autodocs'],
    argTypes: {
        autoplay: { control: 'boolean', description: '自动播放' },
        interval: { control: 'number', description: '自动播放间隔（ms）', defaultValue: { summary: 3000 } },
        loop: { control: 'boolean', description: '首尾循环', defaultValue: { summary: true } },
        showArrows: { control: 'boolean', description: '显示箭头', defaultValue: { summary: true } },
        showDots: { control: 'boolean', description: '显示圆点指示器', defaultValue: { summary: true } },
        pauseOnHover: { control: 'boolean', description: '悬停暂停', defaultValue: { summary: true } },
    },
} satisfies Meta<typeof Carousel>;

export default meta;
type Story = StoryObj<typeof meta>;

const SlideContent = ({ label, bg }: { label: string; bg: string }) => (
    <div style={{ minHeight: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', background: bg, fontSize: 24, fontWeight: 700, color: '#8b7355', borderRadius: 20 }}>
        {label}
    </div>
);

export const Default: Story = {
    args: { 'aria-label': '示例轮播', children: null },
    render: (args) => (
        <Carousel {...args} style={{ maxWidth: 480 }}>
            <SlideContent label="🏖️ 海滩" bg="#fffbe7" />
            <SlideContent label="🌳 广场" bg="#f0f8e8" />
            <SlideContent label="🏛️ 博物馆" bg="#e8f0f8" />
        </Carousel>
    ),
    name: '默认（三张幻灯片）',
};

export const Autoplay: Story = {
    args: { autoplay: true, interval: 2_000, 'aria-label': '自动播放示例', children: null },
    render: (args) => (
        <Carousel {...args} style={{ maxWidth: 480 }}>
            <SlideContent label="第一张" bg="#fffbe7" />
            <SlideContent label="第二张" bg="#f0f8e8" />
            <SlideContent label="第三张" bg="#f8e8f0" />
        </Carousel>
    ),
    name: '自动播放',
};

export const NoLoop: Story = {
    args: { loop: false, 'aria-label': '非循环示例', children: null },
    render: (args) => (
        <Carousel {...args} style={{ maxWidth: 480 }}>
            <SlideContent label="开始" bg="#fffbe7" />
            <SlideContent label="中间" bg="#f0f8e8" />
            <SlideContent label="结束" bg="#e8f0f8" />
        </Carousel>
    ),
    name: '非循环（边界禁用箭头）',
};
