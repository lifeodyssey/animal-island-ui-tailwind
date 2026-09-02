import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Pagination } from './Pagination';

const meta = {
    component: Pagination,
    tags: ['ai-generated'],
    argTypes: {
        total: { control: 'number', description: 'Total number of data items' },
        current: { control: 'number', description: 'Current page (controlled)' },
        defaultCurrent: { control: 'number', description: 'Default current page' },
        pageSize: { control: 'number', description: 'Page size (controlled)' },
        defaultPageSize: { control: 'number', description: 'Default page size' },
        showSizeChanger: { control: 'boolean', description: 'Show page size changer' },
        showQuickJumper: { control: 'boolean', description: 'Show quick jumper input' },
        showTotal: { control: 'boolean', description: 'Show total count label' },
        disabled: { control: 'boolean', description: 'Disable all interactions' },
        variant: {
            control: 'radio',
            options: ['orange', 'teal'],
            description: 'Color variant',
        },
    },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

// ---------------------------------------------------------------------------
// Default — orange variant, 100 items, 10 per page
// ---------------------------------------------------------------------------
export const Default: Story = {
    args: {
        total: 100,
        defaultPageSize: 10,
    },
};

// ---------------------------------------------------------------------------
// Teal variant
// ---------------------------------------------------------------------------
export const Teal: Story = {
    args: {
        total: 100,
        defaultPageSize: 10,
        variant: 'teal',
    },
};

// ---------------------------------------------------------------------------
// Few pages — no ellipsis
// ---------------------------------------------------------------------------
export const FewPages: Story = {
    args: {
        total: 30,
        defaultPageSize: 10,
    },
};

// ---------------------------------------------------------------------------
// Single page
// ---------------------------------------------------------------------------
export const SinglePage: Story = {
    args: {
        total: 8,
        defaultPageSize: 10,
    },
};

// ---------------------------------------------------------------------------
// With size changer
// ---------------------------------------------------------------------------
export const WithSizeChanger: Story = {
    args: {
        total: 100,
        defaultPageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: [10, 20, 50, 100],
    },
};

// ---------------------------------------------------------------------------
// With quick jumper and total
// ---------------------------------------------------------------------------
export const WithJumperAndTotal: Story = {
    args: {
        total: 200,
        defaultPageSize: 10,
        showQuickJumper: true,
        showTotal: true,
    },
};

// ---------------------------------------------------------------------------
// Full features
// ---------------------------------------------------------------------------
export const FullFeatures: Story = {
    args: {
        total: 500,
        defaultPageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: true,
        pageSizeOptions: [10, 20, 50, 100],
    },
};

// ---------------------------------------------------------------------------
// Disabled
// ---------------------------------------------------------------------------
export const Disabled: Story = {
    args: {
        total: 100,
        defaultPageSize: 10,
        disabled: true,
    },
};

// ---------------------------------------------------------------------------
// Controlled — current page driven externally
// ---------------------------------------------------------------------------
export const Controlled: Story = {
    args: { total: 100 },
    render: () => {
        const [page, setPage] = useState(1);
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ color: '#725d42', fontSize: 14 }}>当前页：{page}</div>
                <Pagination
                    total={100}
                    current={page}
                    pageSize={10}
                    onChange={(p) => setPage(p)}
                />
                <div style={{ display: 'flex', gap: 8 }}>
                    <button
                        type="button"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        style={{ padding: '4px 12px', cursor: 'pointer' }}
                    >
                        上一页
                    </button>
                    <button
                        type="button"
                        onClick={() => setPage((p) => Math.min(10, p + 1))}
                        style={{ padding: '4px 12px', cursor: 'pointer' }}
                    >
                        下一页
                    </button>
                </div>
            </div>
        );
    },
};
