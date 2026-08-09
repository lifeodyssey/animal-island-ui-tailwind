import type { Meta, StoryObj } from '@storybook/react-vite';
import { Time } from './Time';

const meta = {
    component: Time,
    tags: ['ai-generated'],
    argTypes: {
        type: {
            control: 'select',
            options: ['game', 'hud'],
            description: '显示风格：game（上下：时间/分割线/日期+周几）| hud（左右：星期/日期+时间）',
            table: { defaultValue: { summary: 'game' } },
        },
        className: { control: 'text', description: '自定义类名' },
    },
} satisfies Meta<typeof Time>;

export default meta;
type Story = StoryObj<typeof meta>;

/** game 风格（默认）：上下结构，时间 / 分割线 / 日期 + 周几 */
export const Default: Story = {};

/** game 风格（显式）：上下结构，时间 / 分割线 / 日期 + 周几 */
export const Game: Story = {
    args: { type: 'game' },
};

/** hud 风格：左右结构，星期/日期 + 时间（Animal Crossing HUD 风格）。悬停可看到自定义光标效果。 */
export const Hud: Story = {
    args: { type: 'hud' },
};
