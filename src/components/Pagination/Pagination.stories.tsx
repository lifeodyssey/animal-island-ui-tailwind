import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Pagination } from './Pagination';

const meta = {
    component: Pagination,
    tags: ['ai-generated'],
    argTypes: {
        total: { control: { type: 'number' }, description: 'Total item count' },
        variant: { control: { type: 'radio' }, options: ['orange', 'teal'], description: 'Color variant' },
        disabled: { control: 'boolean' },
        showSizeChanger: { control: 'boolean' },
        showQuickJumper: { control: 'boolean' },
        showTotal: { control: 'boolean' },
    },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { total: 100 },
};

export const TealVariant: Story = {
    args: { total: 100, variant: 'teal' },
};

export const WithSizeChanger: Story = {
    args: { total: 250, showSizeChanger: true, showTotal: true },
};

export const WithQuickJumper: Story = {
    args: { total: 500, showSizeChanger: true, showQuickJumper: true, showTotal: true },
};

export const FewPages: Story = {
    args: { total: 30 },
};

export const Disabled: Story = {
    args: { total: 100, disabled: true },
};

export const Controlled: Story = {
    render: (args) => {
        const [page, setPage] = React.useState(1);
        const [size, setSize] = React.useState(10);
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <span style={{ fontSize: 13, color: '#725d42' }}>第 {page} 页 · 每页 {size} 条</span>
                <Pagination
                    {...args}
                    total={250}
                    current={page}
                    pageSize={size}
                    showSizeChanger
                    showQuickJumper
                    showTotal
                    onChange={(p, s) => { setPage(p); setSize(s); }}
                />
            </div>
        );
    },
    args: { total: 250 },
};
