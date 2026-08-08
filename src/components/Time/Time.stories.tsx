import type { Meta, StoryObj } from '@storybook/react-vite';
import { Time } from './Time';

const meta = {
    component: Time,
    tags: ['ai-generated'],
    argTypes: {
        type: {
            control: { type: 'radio' },
            options: ['game', 'hud'],
            description: 'Display style: game (vertical, Chinese date) or hud (horizontal, English date)',
            table: { defaultValue: { summary: 'game' } },
        },
    },
} satisfies Meta<typeof Time>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 游戏风格时钟（默认）：上下结构，时间 / 分割线 / 中文日期+周几 */
export const Default: Story = {
    args: { type: 'game' },
};

/** HUD 风格时钟：左右结构，英文星期/日期 + 数字时间。悬停可看到自定义光标效果。 */
export const Hud: Story = {
    args: { type: 'hud' },
};
