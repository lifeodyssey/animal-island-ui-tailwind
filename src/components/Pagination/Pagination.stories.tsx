import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Pagination } from './Pagination';

const meta = {
    component: Pagination,
    tags: ['ai-generated'],
    argTypes: {
        total: { control: 'number', description: '数据总数' },
        current: { control: 'number', description: '当前页（受控）' },
        defaultCurrent: { control: 'number', description: '默认当前页' },
        pageSize: { control: 'number', description: '每页条数（受控）' },
        defaultPageSize: { control: 'number', description: '默认每页条数' },
        showSizeChanger: { control: 'boolean', description: '显示每页条数切换器' },
        showQuickJumper: { control: 'boolean', description: '显示快速跳转' },
        showTotal: { control: 'boolean', description: '显示总条数文本' },
        disabled: { control: 'boolean', description: '禁用' },
        variant: { control: 'select', options: ['orange', 'teal'], description: '配色' },
    },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        total: 100,
        defaultCurrent: 1,
        pageSize: 10,
    },
};

export const Orange: Story = {
    args: {
        total: 100,
        defaultCurrent: 3,
        pageSize: 10,
        variant: 'orange',
    },
};

export const Teal: Story = {
    args: {
        total: 100,
        defaultCurrent: 3,
        pageSize: 10,
        variant: 'teal',
    },
};

export const FewPages: Story = {
    args: {
        total: 30,
        defaultCurrent: 2,
        pageSize: 10,
    },
};

export const ManyPages: Story = {
    args: {
        total: 500,
        defaultCurrent: 5,
        pageSize: 10,
    },
};

export const WithSizeChanger: Story = {
    args: {
        total: 200,
        defaultCurrent: 1,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: [10, 20, 50, 100],
    },
};

export const WithQuickJumper: Story = {
    args: {
        total: 200,
        defaultCurrent: 1,
        pageSize: 10,
        showQuickJumper: true,
    },
};

export const WithTotal: Story = {
    args: {
        total: 178,
        defaultCurrent: 1,
        pageSize: 10,
        showTotal: true,
    },
};

export const FullFeatured: Story = {
    args: {
        total: 500,
        defaultCurrent: 6,
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: true,
    },
};

export const Disabled: Story = {
    args: {
        total: 100,
        defaultCurrent: 3,
        pageSize: 10,
        disabled: true,
    },
};

export const Controlled: Story = {
    args: { total: 200 },
    render: () => {
        const [page, setPage] = useState(1);
        const [pageSize, setPageSize] = useState(10);
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <p style={{ margin: 0, color: '#725d42', fontWeight: 600 }}>
                    当前第 {page} 页，每页 {pageSize} 条
                </p>
                <Pagination
                    total={200}
                    current={page}
                    pageSize={pageSize}
                    showSizeChanger
                    showQuickJumper
                    showTotal
                    onChange={(p, s) => {
                        setPage(p);
                        setPageSize(s);
                    }}
                    onShowSizeChange={(p, s) => {
                        setPage(p);
                        setPageSize(s);
                    }}
                />
            </div>
        );
    },
};

export const NavigationInteraction: Story = {
    args: {
        total: 50,
        defaultCurrent: 1,
        pageSize: 10,
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        const page1 = canvas.getByRole('button', { name: '1' });
        expect(page1).toHaveAttribute('aria-current', 'page');

        const nextBtn = canvas.getByRole('button', { name: '下一页' });
        await userEvent.click(nextBtn);

        const page2 = canvas.getByRole('button', { name: '2' });
        expect(page2).toHaveAttribute('aria-current', 'page');

        const prevBtn = canvas.getByRole('button', { name: '上一页' });
        await userEvent.click(prevBtn);

        expect(canvas.getByRole('button', { name: '1' })).toHaveAttribute('aria-current', 'page');
    },
};
