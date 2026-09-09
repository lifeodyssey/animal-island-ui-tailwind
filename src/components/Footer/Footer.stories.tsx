import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Footer } from './Footer';

const meta = {
    component: Footer,
    tags: ['ai-generated'],
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Sea: Story = {
    args: {
        type: 'sea',
        children: '🌊 欢迎来到动物岛 · 海边脚注',
    },
};

export const SeaSurfaces: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Compare the sea decoration at its natural 80px height on white, cream, and green page surfaces.',
            },
        },
    },
    render: () => (
        <div style={{ display: 'grid', gap: 24 }}>
            {['#ffffff', '#fff9ed', '#e8f0e9'].map((background) => (
                <div key={background} style={{ background, paddingTop: 24 }}>
                    <Footer type="sea" aria-hidden="true" />
                </div>
            ))}
        </div>
    ),
};

export const SeaWithoutRepeat: Story = {
    args: {
        type: 'sea',
        seamless: false,
    },
};

export const Tree: Story = {
    args: {
        type: 'tree',
        children: '🌳 欢迎来到动物岛 · 树林脚注',
    },
};

export const TreeSurfaces: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Compare the forest decoration at its natural 80px height. Windows and fruit cutouts reveal the page surface.',
            },
        },
    },
    render: () => (
        <div style={{ display: 'grid', gap: 24 }}>
            {['#ffffff', '#fff9ed', '#e8f0e9'].map((background) => (
                <div key={background} style={{ background, paddingTop: 24 }}>
                    <Footer type="tree" aria-hidden="true" />
                </div>
            ))}
        </div>
    ),
};

export const TreeWithoutRepeat: Story = {
    args: {
        type: 'tree',
        seamless: false,
    },
};

export const AllTypes: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {(['sea', 'tree'] as const).map((type) => (
                <Footer key={type} type={type}>
                    {type === 'sea'
                        ? '🌊 海边的岛民们在此休憩'
                        : '🌳 树林里的喵喵向你问好'}
                </Footer>
            ))}
        </div>
    ),
};
