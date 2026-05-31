import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Typewriter } from './Typewriter';

const meta = {
    component: Typewriter,
    tags: ['ai-generated'],
} satisfies Meta<typeof Typewriter>;

export default meta;
type Story = StoryObj<typeof meta>;

/** autoPlay=true（默认）：文字逐字打出，speed 默认 90ms/字。 */
export const AutoPlayTrue: Story = {
    args: {
        autoPlay: true,
        children: '集合啦！欢迎来到动物之岛，今天天气晴朗，桃子已经成熟啦～',
    },
};

/** autoPlay=false：文字直接全量显示，不播放动画。 */
export const AutoPlayFalse: Story = {
    args: {
        autoPlay: false,
        children: '岛民公告：今日流星雨将于晚上十点开始，记得来海边许愿哦！',
    },
};

/** speed 对比：慢速（250ms）、默认（90ms）、快速（20ms）三档。 */
export const SpeedVariants: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {(
                [
                    { label: '慢速 250ms', speed: 250 },
                    { label: '默认 90ms', speed: 90 },
                    { label: '快速 20ms', speed: 20 },
                ] as const
            ).map(({ label, speed }) => (
                <div key={speed} style={{ fontFamily: 'sans-serif' }}>
                    <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>{label}</div>
                    <Typewriter speed={speed}>
                        喵喵说：岛上的星空真美啊，每颗星都有自己的故事。
                    </Typewriter>
                </div>
            ))}
        </div>
    ),
};

/** trigger 重放：点击按钮递增 trigger 值，打字机从头重播。 */
export const TriggerReplay: Story = {
    render: () => {
        const [tick, setTick] = useState(0);
        return (
            <div style={{ fontFamily: 'sans-serif' }}>
                <button
                    onClick={() => setTick((t) => t + 1)}
                    style={{
                        marginBottom: 16,
                        padding: '6px 16px',
                        borderRadius: 8,
                        border: '1px solid #b5c9a8',
                        background: '#f0f7ee',
                        cursor: 'pointer',
                        fontFamily: 'sans-serif',
                    }}
                >
                    重新播放（已播放 {tick} 次）
                </button>
                <div>
                    <Typewriter trigger={tick} speed={70}>
                        狸克镇长宣布：岛上的博物馆今天举办特展，快来参观化石和鱼类标本！
                    </Typewriter>
                </div>
            </div>
        );
    },
};

/** onDone 回调：动画播放完成后显示提示信息。 */
export const OnDoneCallback: Story = {
    render: () => {
        const [done, setDone] = useState(false);
        const [tick, setTick] = useState(0);
        return (
            <div style={{ fontFamily: 'sans-serif' }}>
                <button
                    onClick={() => {
                        setDone(false);
                        setTick((t) => t + 1);
                    }}
                    style={{
                        marginBottom: 16,
                        padding: '6px 16px',
                        borderRadius: 8,
                        border: '1px solid #b5c9a8',
                        background: '#f0f7ee',
                        cursor: 'pointer',
                        fontFamily: 'sans-serif',
                    }}
                >
                    再读一遍
                </button>
                <div>
                    <Typewriter trigger={tick} speed={60} onDone={() => setDone(true)}>
                        阿猫悄悄告诉你：我发现了一个藏着贝尔的宝藏洞穴，要一起去吗？
                    </Typewriter>
                </div>
                {done && (
                    <div
                        style={{
                            marginTop: 12,
                            color: '#5a9a6e',
                            fontSize: 13,
                        }}
                    >
                        ✓ onDone 已触发
                    </div>
                )}
            </div>
        );
    },
};

/** nested ReactNode children：children 包含多种元素节点，结构与样式均被保留。 */
export const NestedReactNodeChildren: Story = {
    render: () => (
        <div style={{ fontFamily: 'sans-serif', lineHeight: 1.8 }}>
            <Typewriter speed={50}>
                <p>
                    <strong>集合啦！动物之森</strong>
                    今天的活动安排：
                </p>
                <ul style={{ paddingLeft: 20, margin: '8px 0' }}>
                    <li>
                        早上 <em>6:00</em> — 捕虫大赛
                    </li>
                    <li>
                        下午 <em>14:00</em> — <span style={{ color: '#e07b54' }}>钓鱼锦标赛</span>
                    </li>
                    <li>
                        晚上 <em>20:00</em> — 流星雨观测（记得许愿！）
                    </li>
                </ul>
                <p style={{ color: '#7a9e6f' }}>——喵喵 &amp; 狸克镇长联合发布</p>
            </Typewriter>
        </div>
    ),
};
