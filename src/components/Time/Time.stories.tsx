import type { Meta, StoryObj } from '@storybook/react-vite';
import { Time } from './Time';

const meta = {
    component: Time,
    tags: ['ai-generated'],
} satisfies Meta<typeof Time>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 默认时钟 / 日期展示：岛民聚集啦！悬停可看到自定义光标效果。 */
export const Default: Story = {};
