import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Input } from './Input';

const meta = {
    component: Input,
    tags: ['ai-generated'],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = { args: { placeholder: 'Basic input' } };
export const WithPrefixSuffix: Story = {
    args: { placeholder: 'Search', prefix: '🔍', suffix: '⏎' },
};
export const ErrorStatus: Story = {
    args: { placeholder: 'Error', status: 'error', defaultValue: 'bad value' },
};

export const Typed: Story = {
    args: { placeholder: 'Type here' },
    play: async ({ canvas, userEvent }) => {
        const input = canvas.getByPlaceholderText('Type here') as HTMLInputElement;
        await userEvent.type(input, 'hello');
        await expect(input).toHaveValue('hello');
    },
};
