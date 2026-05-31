import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Tabs } from './Tabs';
import type { TabItem } from './Tabs';

const items: TabItem[] = [
    { key: 'fish', label: '鱼类', children: <p>鲈鱼、鲷鱼…</p> },
    { key: 'bugs', label: '昆虫', children: <p>蝴蝶、瓢虫…</p> },
    { key: 'sea', label: '海洋生物', children: <p>海星、珊瑚…</p> },
];

const meta = {
    component: Tabs,
    tags: ['ai-generated'],
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { items, defaultActiveKey: 'fish' } };
export const NoShadow: Story = { args: { items, defaultActiveKey: 'fish', shadow: false } };
export const NoLeafAnimation: Story = {
    args: { items, defaultActiveKey: 'fish', leafAnimation: false },
};

export const TabChange: Story = {
    args: { items, defaultActiveKey: 'fish' },
    play: async ({ canvas, userEvent }) => {
        const bugsTab = canvas.getByRole('tab', { name: /昆虫/ });
        await expect(bugsTab).toHaveAttribute('aria-selected', 'false');
        await userEvent.click(bugsTab);
        await expect(bugsTab).toHaveAttribute('aria-selected', 'true');
    },
};
