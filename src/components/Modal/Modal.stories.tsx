import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Modal } from './Modal';
import { Button } from '../Button';

const meta = {
    component: Modal,
    tags: ['ai-generated'],
    args: { open: false },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 基础用法：点击按钮打开/关闭对话框（maskClosable 默认开启）。 */
export const Basic: Story = {
    render: () => {
        const [open, setOpen] = useState(false);
        return (
            <>
                <Button type="primary" onClick={() => setOpen(true)}>
                    集合啦！打开对话框
                </Button>
                <Modal
                    open={open}
                    title="岛民公告"
                    onClose={() => setOpen(false)}
                    onOk={() => setOpen(false)}
                >
                    欢迎来到动物森友会！今天的活动从早上六点开始，记得带上渔竿哦~
                </Modal>
            </>
        );
    },
};

/** open=false 时对话框不渲染，页面显示一个「已关闭」提示。 */
export const Closed: Story = {
    render: () => (
        <>
            <p style={{ fontFamily: 'sans-serif', color: '#888' }}>对话框已关闭（open=false）</p>
            <Modal open={false} title="岛民公告" onClose={() => {}}>
                这段文字不会显示。
            </Modal>
        </>
    ),
};

/** 不传 title 时对话框没有标题栏，内容区撑满顶部。 */
export const NoTitle: Story = {
    render: () => {
        const [open, setOpen] = useState(false);
        return (
            <>
                <Button type="primary" onClick={() => setOpen(true)}>
                    无标题对话框
                </Button>
                <Modal open={open} onClose={() => setOpen(false)} onOk={() => setOpen(false)}>
                    喵喵说：「没有标题也没关系，我自己就是标题！」
                </Modal>
            </>
        );
    },
};

/** footer=null 时隐藏底部按钮区域。 */
export const NoFooter: Story = {
    render: () => {
        const [open, setOpen] = useState(false);
        return (
            <>
                <Button type="primary" onClick={() => setOpen(true)}>
                    无底部按钮
                </Button>
                <Modal
                    open={open}
                    title="纯内容弹窗"
                    footer={null}
                    onClose={() => setOpen(false)}
                >
                    狸克镇长说：这里没有确认/取消按钮，点击遮罩或按 Esc 关闭。
                </Modal>
            </>
        );
    },
};

/** footer 传入自定义节点。 */
export const CustomFooter: Story = {
    render: () => {
        const [open, setOpen] = useState(false);
        return (
            <>
                <Button type="primary" onClick={() => setOpen(true)}>
                    自定义底部按钮
                </Button>
                <Modal
                    open={open}
                    title="岛上投票"
                    footer={
                        <div style={{ display: 'flex', gap: 8 }}>
                            <Button type="primary" onClick={() => setOpen(false)}>
                                赞成 👍
                            </Button>
                            <Button type="primary" onClick={() => setOpen(false)}>
                                反对 👎
                            </Button>
                            <Button type="primary" onClick={() => setOpen(false)}>
                                弃权 🙈
                            </Button>
                        </div>
                    }
                    onClose={() => setOpen(false)}
                >
                    是否同意在南广场新建一座博物馆？
                </Modal>
            </>
        );
    },
};

/** maskClosable=false 时点击遮罩不关闭，必须使用底部按钮。 */
export const MaskNotClosable: Story = {
    render: () => {
        const [open, setOpen] = useState(false);
        return (
            <>
                <Button type="primary" onClick={() => setOpen(true)}>
                    点击遮罩不关闭
                </Button>
                <Modal
                    open={open}
                    title="重要提示"
                    maskClosable={false}
                    onClose={() => setOpen(false)}
                    onOk={() => setOpen(false)}
                >
                    阿猫说：「点遮罩是没有用哒，请使用下方按钮关闭。」
                </Modal>
            </>
        );
    },
};

/** typewriter=true（默认），内容逐字打出。 */
export const WithTypewriter: Story = {
    render: () => {
        const [open, setOpen] = useState(false);
        return (
            <>
                <Button type="primary" onClick={() => setOpen(true)}>
                    打字机效果（默认）
                </Button>
                <Modal
                    open={open}
                    title="来自集合啦的信"
                    typewriter={true}
                    typeSpeed={60}
                    onClose={() => setOpen(false)}
                    onOk={() => setOpen(false)}
                >
                    亲爱的岛民，您好！我是您的邻居喵喵。最近岛上的桃子已经成熟了，欢迎来摘哦！另外，本周六有流星雨，记得在海边许愿~
                </Modal>
            </>
        );
    },
};

/** typewriter=false 时内容立即全量显示。 */
export const NoTypewriter: Story = {
    render: () => {
        const [open, setOpen] = useState(false);
        return (
            <>
                <Button type="primary" onClick={() => setOpen(true)}>
                    无打字机效果
                </Button>
                <Modal
                    open={open}
                    title="公告栏"
                    typewriter={false}
                    onClose={() => setOpen(false)}
                    onOk={() => setOpen(false)}
                >
                    狸克镇长宣布：今日钱袋子利率为 0.5%，请各位岛民多多存款！文字直接全量显示，没有逐字动画。
                </Modal>
            </>
        );
    },
};

/** 自定义宽度：窄 (320 px)、默认 (520 px)、宽 (760 px) 三种对比。 */
export const CustomWidth: Story = {
    render: () => {
        const [which, setWhich] = useState<'narrow' | 'default' | 'wide' | null>(null);
        const widthMap = { narrow: 320, default: 520, wide: 760 } as const;
        return (
            <>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <Button type="primary" onClick={() => setWhich('narrow')}>
                        窄 320px
                    </Button>
                    <Button type="primary" onClick={() => setWhich('default')}>
                        默认 520px
                    </Button>
                    <Button type="primary" onClick={() => setWhich('wide')}>
                        宽 760px
                    </Button>
                </div>
                {(['narrow', 'default', 'wide'] as const).map((key) => (
                    <Modal
                        key={key}
                        open={which === key}
                        title={`宽度 ${widthMap[key]}px`}
                        width={widthMap[key]}
                        onClose={() => setWhich(null)}
                        onOk={() => setWhich(null)}
                    >
                        当前对话框宽度为 {widthMap[key]} px。岛上的星空真美啊～
                    </Modal>
                ))}
            </>
        );
    },
};
