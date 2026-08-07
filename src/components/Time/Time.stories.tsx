import type { Meta, StoryObj } from '@storybook/react-vite';
import { Time } from './Time';

const meta = {
    component: Time,
    tags: ['ai-generated'],
} satisfies Meta<typeof Time>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Game layout (default): vertical stack — time / divider / date + weekday in Chinese. */
export const Default: Story = {};

/** Game layout: explicit type="game". */
export const Game: Story = { args: { type: 'game' } };

/** HUD layout: horizontal — weekday/date on left, clock on right. */
export const Hud: Story = { args: { type: 'hud' } };
