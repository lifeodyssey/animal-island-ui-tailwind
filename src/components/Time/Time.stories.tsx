import type { Meta, StoryObj } from '@storybook/react-vite';
import { Time } from './Time';

const meta = {
    component: Time,
    tags: ['ui'],
    argTypes: {
        type: {
            control: 'select',
            options: ['game', 'hud'],
            description: '显示风格',
            table: { defaultValue: { summary: 'game' } },
        },
        className: { control: 'text' },
    },
} satisfies Meta<typeof Time>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Game 风格（默认）：上下结构 — 时间 / 分割线 / 日期 + 周几。 */
export const Game: Story = {
    args: { type: 'game' },
};

/** HUD 风格：左右结构 — 星期/日期 + 时间。 */
export const Hud: Story = {
    args: { type: 'hud' },
};
