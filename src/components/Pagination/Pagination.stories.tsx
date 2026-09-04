import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Pagination } from './Pagination';

const meta = {
    component: Pagination,
    tags: ['ai-generated'],
    argTypes: {
        total: { control: 'number', description: '数据总数' },
        variant: { control: 'radio', options: ['orange', 'teal'], description: '配色方案' },
        showSizeChanger: { control: 'boolean', description: '显示每页条数切换器' },
        showQuickJumper: { control: 'boolean', description: '显示快速跳转' },
        showTotal: { control: 'boolean', description: '显示总条数' },
        disabled: { control: 'boolean', description: '禁用状态' },
    },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        total: 50,
        defaultCurrent: 1,
        defaultPageSize: 10,
    },
};

export const TealVariant: Story = {
    args: {
        total: 50,
        defaultCurrent: 1,
        defaultPageSize: 10,
        variant: 'teal',
    },
};

export const WithSizeChangerAndJumper: Story = {
    args: {
        total: 100,
        defaultCurrent: 1,
        defaultPageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: true,
        pageSizeOptions: [10, 20, 50],
    },
};

export const ManyPages: Story = {
    args: {
        total: 200,
        defaultCurrent: 5,
        defaultPageSize: 10,
    },
};

export const Disabled: Story = {
    args: {
        total: 50,
        defaultCurrent: 2,
        defaultPageSize: 10,
        disabled: true,
        showSizeChanger: true,
        showQuickJumper: true,
    },
};

export const Controlled: Story = {
    args: { total: 100, showSizeChanger: true, showQuickJumper: true, showTotal: true },
    render: (args) => {
        const [page, setPage] = React.useState(1);
        const [pageSize, setPageSize] = React.useState(10);
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ fontFamily: 'Nunito, sans-serif', fontSize: 13, color: '#725d42' }}>
                    当前页: {page} / 每页: {pageSize}
                </div>
                <Pagination
                    {...args}
                    current={page}
                    pageSize={pageSize}
                    pageSizeOptions={[10, 20, 50]}
                    onChange={(p, ps) => { setPage(p); setPageSize(ps); }}
                    onShowSizeChange={(p, ps) => { setPage(p); setPageSize(ps); }}
                />
            </div>
        );
    },
};
