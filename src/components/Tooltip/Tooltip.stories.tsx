import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Tooltip } from './Tooltip';
import { Button } from '../Button';

const meta = {
    component: Tooltip,
    tags: ['ai-generated'],
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const HoverDefault: Story = {
    args: { title: '默认提示', children: <Button>hover me</Button> },
};

export const ClickTrigger: Story = {
    args: { title: '点击提示', trigger: 'click', children: <Button>click me</Button> },
};

export const IslandVariant: Story = {
    args: {
        title: 'island 风格提示',
        variant: 'island',
        children: <Button size="small">island</Button>,
    },
};

export const RendersInPortal: Story = {
    args: { title: '默认提示', children: <Button>show tooltip</Button> },
    play: async ({ canvas, canvasElement, userEvent }) => {
        const trigger = canvas.getByRole('button', { name: /show tooltip/i });
        await userEvent.hover(trigger);
        const docBody = within(canvasElement.ownerDocument.body);
        const tooltip = await docBody.findByRole('tooltip', {}, { timeout: 3000 });
        await expect(tooltip).toHaveTextContent('默认提示');
    },
};
