import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor } from 'storybook/test';
import { Collapse } from './Collapse';

const meta = {
    component: Collapse,
    tags: ['ai-generated'],
    args: {
        question: '集合啦！今天的岛屿活动是什么？',
        answer: '今天可以去海边捡贝壳，顺便和喵喵打个招呼～',
    },
} satisfies Meta<typeof Collapse>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 默认折叠（关闭）状态 */
export const CollapsedDefault: Story = {
    args: {},
};

/** defaultExpanded=true：默认展开状态 */
export const DefaultExpanded: Story = {
    args: {
        defaultExpanded: true,
    },
};

/** disabled=true：禁用状态，无法展开或折叠 */
export const Disabled: Story = {
    args: {
        disabled: true,
        question: '这个问题被禁用了～',
        answer: '喵喵说这个答案暂时不能查看。',
    },
};

/** 禁用且默认展开的状态 */
export const DisabledExpanded: Story = {
    args: {
        disabled: true,
        defaultExpanded: true,
        question: '禁用但已展开的岛民问题',
        answer: '即使禁用，已经展开的内容依然可见。',
    },
};

/**
 * 受控模式（controlled）：expanded + onChange 受外部 state 控制。
 * 点击按钮可以从外部切换展开/折叠状态。
 */
export const Controlled: Story = {
    render: () => {
        const [expanded, setExpanded] = React.useState(true);
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <Collapse
                    question="受控模式：今天钓鱼了吗？"
                    answer="钓到了一条稀有的鳄鱼！恭喜集合啦岛民！"
                    expanded={expanded}
                    onChange={setExpanded}
                />
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                        onClick={() => setExpanded(true)}
                        style={{
                            padding: '6px 18px',
                            borderRadius: '999px',
                            background: '#12b2da',
                            color: '#fff',
                            border: 'none',
                            cursor: 'pointer',
                            fontWeight: 600,
                        }}
                    >
                        展开 +
                    </button>
                    <button
                        onClick={() => setExpanded(false)}
                        style={{
                            padding: '6px 18px',
                            borderRadius: '999px',
                            background: '#fed09d',
                            color: '#7a5230',
                            border: 'none',
                            cursor: 'pointer',
                            fontWeight: 600,
                        }}
                    >
                        折叠 −
                    </button>
                </div>
                <p style={{ color: '#7a5230', fontSize: '14px' }}>
                    当前状态：{expanded ? '已展开' : '已折叠'}
                </p>
            </div>
        );
    },
};

/**
 * 富文本 ReactNode 内容：answer 为包含格式化内容的复杂节点。
 */
export const RichNodeAnswer: Story = {
    args: {
        question: '喵喵的岛屿每日清单是什么？',
        answer: (
            <div>
                <ul style={{ paddingLeft: '1.25rem', margin: '0 0 8px 0' }}>
                    <li>早上：摘果子 🍎、打树桩</li>
                    <li>下午：去化石挖掘现场找狐狸</li>
                    <li>晚上：和岛民们一起看流星雨 🌠</li>
                </ul>
                <p style={{ margin: 0, color: '#7a5230', fontSize: '13px' }}>
                    提示：星期日记得去看看芜菁价格！
                </p>
            </div>
        ),
        defaultExpanded: true,
    },
};

/**
 * 展开/折叠交互测试：点击标题可以切换状态，
 * 验证 Accordion Trigger 的 aria-expanded 属性正确翻转。
 */
export const ToggleInteraction: Story = {
    args: {
        question: '今天的岛屿天气怎么样？',
        answer: '阳光明媚，非常适合去海边挖化石！',
    },
    play: async ({ canvas, userEvent }) => {
        const trigger = canvas.getByRole('button');
        // 初始为折叠状态
        await expect(trigger).toHaveAttribute('aria-expanded', 'false');

        // 点击展开
        await userEvent.click(trigger);
        await waitFor(async () => {
            await expect(trigger).toHaveAttribute('aria-expanded', 'true');
        });

        // 再次点击折叠
        await userEvent.click(trigger);
        await waitFor(async () => {
            await expect(trigger).toHaveAttribute('aria-expanded', 'false');
        });
    },
};
