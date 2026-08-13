import type { Meta, StoryObj } from '@storybook/react-vite';
import { Time } from './Time';

const meta = {
    component: Time,
    tags: ['ai-generated'],
    argTypes: {
        type: {
            control: 'select',
            options: ['hud', 'game'],
            description: '显示风格：hud（左右结构）| game（上下结构）',
            table: { defaultValue: { summary: 'hud' } },
        },
    },
} satisfies Meta<typeof Time>;

export default meta;
type Story = StoryObj<typeof meta>;

/** HUD 风格：左右结构，星期/日期 + 时钟 */
export const Default: Story = {};

/** Game 风格：上下结构，时钟 / 分割线 / 日期+周几 */
export const Game: Story = {
    args: { type: 'game' },
};
