import type { Meta, StoryObj } from '@storybook/react-vite';
import { Phone } from './Phone';

const meta = {
    component: Phone,
    tags: ['ai-generated'],
} satisfies Meta<typeof Phone>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default NookPhone layout — shows the live clock, app grid with notification badges, and page indicator. */
export const Default: Story = {};
