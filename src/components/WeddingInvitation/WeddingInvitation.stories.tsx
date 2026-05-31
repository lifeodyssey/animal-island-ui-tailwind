import React, { useRef } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { WeddingInvitation, WeddingInvitationExportButton } from './WeddingInvitation';
import type { WeddingInvitationRef } from './WeddingInvitation';

const meta = {
    component: WeddingInvitation,
    tags: ['ai-generated'],
} satisfies Meta<typeof WeddingInvitation>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 默认请柬：显示所有内容，含抽奖券（showLotteryNumber=true）*/
export const Default: Story = { args: {} };

/** 不含抽奖券（showLotteryNumber=false）：请柬底部不渲染撕拉票区域 */
export const NoLottery: Story = { args: { showLotteryNumber: false } };

/** 自定义姓名与日期：喵喵 × 狸小子 联合举办集合啦婚礼 */
export const CustomNames: Story = {
    args: { groomName: '小蓝', brideName: '小红', date: '2026.10.10' },
    play: async ({ canvas }) => {
        await expect(canvas.getByText('小蓝')).toBeVisible();
        await expect(canvas.getByText('小红')).toBeVisible();
        await expect(canvas.getByText('2026.10.10')).toBeVisible();
    },
};

/**
 * 完全自定义内容：覆盖名字、日期、星期、时间、场地、地址以及祝词正文，
 * 展示所有文字类 props 的实际效果。
 */
export const CustomContent: Story = {
    args: {
        groomName: '狸小子',
        brideName: '喵喵',
        date: '2026.08.08',
        weekday: '星期六',
        time: '11:00 AM',
        venue: '无名小岛 · K.K. 演奏台',
        address: '动物之森 · 彩虹桥入口右转三步',
        title: 'Island Wedding',
        message:
            '集合啦！喵喵和狸小子的婚礼在小岛上等你来~ 请带上渔竿、抱枕和满满的祝福！不见不散！',
    },
};

/**
 * 自定义抽奖券内容：覆盖 lotteryNumber / lotteryLabel / lotteryHint，
 * 展示撕拉票区域的全部自定义文本 props。
 */
export const CustomLottery: Story = {
    args: {
        showLotteryNumber: true,
        lotteryNumber: '8888',
        lotteryLabel: '幸运星号码',
        lotteryHint: '凭此号码参与岛上摸鱼抽奖 · Keep this stub for the lucky draw',
    },
};

/**
 * 导出按钮 — 空闲状态：WeddingInvitationExportButton 以正常可点击状态呈现，
 * 按钮文字显示"保存为图片"（默认 children）。
 */
export const ExportButtonIdle: Story = {
    render: () => {
        const invitationRef = useRef<WeddingInvitationRef | null>(null);
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
                <WeddingInvitation ref={invitationRef} />
                <WeddingInvitationExportButton targetRef={invitationRef} />
            </div>
        );
    },
};

/**
 * 导出按钮 — 导出中/禁用状态：通过传入一个永不 resolve 的 exportAsImage，
 * 让按钮停留在 exporting=true（disabled + 文字"生成中…"）状态供视觉检查。
 */
export const ExportButtonExporting: Story = {
    render: () => {
        // 构造一个永不 resolve 的假 ref，让按钮锁定在"生成中…"状态
        const frozenRef = useRef<WeddingInvitationRef>({
            exportAsImage: () => new Promise(() => {}),
            getElement: () => null,
        });

        const [clicked, setClicked] = React.useState(false);

        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
                <WeddingInvitation showLotteryNumber={false} />
                {!clicked ? (
                    <button
                        type="button"
                        onClick={() => {
                            setClicked(true);
                            frozenRef.current.exportAsImage();
                        }}
                        style={{
                            padding: '8px 20px',
                            borderRadius: '999px',
                            background: '#12b2da',
                            color: '#fff',
                            border: 'none',
                            cursor: 'pointer',
                            fontWeight: 600,
                        }}
                    >
                        触发导出（演示 disabled 状态）
                    </button>
                ) : (
                    <WeddingInvitationExportButton targetRef={frozenRef} />
                )}
            </div>
        );
    },
};
