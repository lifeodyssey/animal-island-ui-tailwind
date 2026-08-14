import type { Meta, StoryObj } from '@storybook/react-vite';
import { Time } from './Time';

const meta = {
    component: Time,
    tags: ['autodocs'],
    argTypes: {
        type: {
            control: 'select',
            options: ['game', 'hud'],
            description: '显示风格：game（上下结构）| hud（左右结构，带自定义光标）',
            table: { defaultValue: { summary: 'game' } },
        },
        className: { control: 'text' },
    },
} satisfies Meta<typeof Time>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 默认 game 布局：垂直结构，时间 / 分割线 / 日期 + 周几 */
export const Default: Story = {};

/** Game 布局（显式传 type="game"） */
export const Game: Story = {
    args: { type: 'game' },
};

/** HUD 布局：左右结构，星期/日期 + 时间；悬停可看到自定义光标效果 */
export const Hud: Story = {
    args: { type: 'hud' },
};
