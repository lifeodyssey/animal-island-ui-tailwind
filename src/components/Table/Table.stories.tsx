import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Table } from './Table';
import type { TableColumn } from './Table';

const meta = {
    component: Table,
    tags: ['ai-generated'],
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

// ---------------------------------------------------------------------------
// Shared demo data — Animal Crossing flavour
// ---------------------------------------------------------------------------

interface Islander {
    [key: string]: unknown;
    key: string;
    name: string;
    species: string;
    personality: string;
    catchphrase: string;
    stars: number;
}

const islanders: Islander[] = [
    { key: '1', name: '喵喵', species: '猫咪', personality: '正常', catchphrase: '喵～', stars: 5 },
    { key: '2', name: '阿机', species: '松鼠', personality: '活泼', catchphrase: '噢耶', stars: 4 },
    { key: '3', name: '小布', species: '熊', personality: '懒散', catchphrase: '呼噜噜', stars: 3 },
    { key: '4', name: '帕奇', species: '狗狗', personality: '开朗', catchphrase: '汪汪', stars: 5 },
    { key: '5', name: '铃铛', species: '猫咪', personality: '傲娇', catchphrase: '哼哼', stars: 4 },
    { key: '6', name: '叶子', species: '兔子', personality: '正常', catchphrase: '跳跳', stars: 3 },
    { key: '7', name: '咕噜', species: '狐狸', personality: '狡猾', catchphrase: '嘿嘿', stars: 4 },
    { key: '8', name: '毛毛', species: '熊猫', personality: '憨厚', catchphrase: '哦哦', stars: 5 },
];

const baseColumns: TableColumn[] = [
    { title: '岛民名', dataIndex: 'name', width: 100 },
    { title: '物种', dataIndex: 'species', width: 80 },
    { title: '性格', dataIndex: 'personality', width: 80 },
    { title: '口头禅', dataIndex: 'catchphrase', width: 100 },
];

// ---------------------------------------------------------------------------
// Default — striped on, header on
// ---------------------------------------------------------------------------

export const Default: Story = {
    args: {
        columns: baseColumns,
        dataSource: islanders,
        rowKey: 'key',
    },
};

// ---------------------------------------------------------------------------
// Striped off
// ---------------------------------------------------------------------------

export const StripedOff: Story = {
    args: {
        columns: baseColumns,
        dataSource: islanders,
        rowKey: 'key',
        striped: false,
    },
};

// ---------------------------------------------------------------------------
// Striped on (explicit)
// ---------------------------------------------------------------------------

export const StripedOn: Story = {
    args: {
        columns: baseColumns,
        dataSource: islanders,
        rowKey: 'key',
        striped: true,
    },
};

// ---------------------------------------------------------------------------
// ShowHeader off
// ---------------------------------------------------------------------------

export const NoHeader: Story = {
    args: {
        columns: baseColumns,
        dataSource: islanders.slice(0, 4),
        rowKey: 'key',
        showHeader: false,
    },
};

// ---------------------------------------------------------------------------
// Loading state
// ---------------------------------------------------------------------------

export const Loading: Story = {
    args: {
        columns: baseColumns,
        dataSource: islanders,
        rowKey: 'key',
        loading: true,
    },
};

// ---------------------------------------------------------------------------
// Empty dataSource with custom emptyText
// ---------------------------------------------------------------------------

export const EmptyCustomText: Story = {
    args: {
        columns: baseColumns,
        dataSource: [],
        rowKey: 'key',
        emptyText: '🏝️ 小岛上还没有居民，赶快去招募吧！',
    },
};

// ---------------------------------------------------------------------------
// Empty dataSource — default emptyText
// ---------------------------------------------------------------------------

export const EmptyDefault: Story = {
    args: {
        columns: baseColumns,
        dataSource: [],
        rowKey: 'key',
    },
};

// ---------------------------------------------------------------------------
// Column.align — left / center / right in one story
// ---------------------------------------------------------------------------

export const ColumnAlign: Story = {
    render: () => {
        const alignColumns: Array<TableColumn<Islander>> = [
            { title: '左对齐 (left)', dataIndex: 'name', align: 'left', width: 160 },
            { title: '居中 (center)', dataIndex: 'species', align: 'center', width: 160 },
            { title: '右对齐 (right)', dataIndex: 'stars', align: 'right', width: 160 },
        ];
        return (
            <Table
                columns={alignColumns}
                dataSource={islanders.slice(0, 3)}
                rowKey="key"
            />
        );
    },
};

// ---------------------------------------------------------------------------
// Column.width — mix of px numbers and string percentages
// ---------------------------------------------------------------------------

export const ColumnWidth: Story = {
    render: () => {
        const widthColumns: Array<TableColumn<Islander>> = [
            { title: '岛民名 (宽200px)', dataIndex: 'name', width: 200 },
            { title: '物种 (宽80px)', dataIndex: 'species', width: 80 },
            { title: '口头禅 (宽 30%)', dataIndex: 'catchphrase', width: '30%' },
            { title: '星级 (余下宽度)', dataIndex: 'stars' },
        ];
        return (
            <Table
                columns={widthColumns}
                dataSource={islanders.slice(0, 4)}
                rowKey="key"
            />
        );
    },
};

// ---------------------------------------------------------------------------
// Column.render — custom cell renderer
// ---------------------------------------------------------------------------

export const ColumnRender: Story = {
    render: () => {
        const renderColumns: Array<TableColumn<Islander>> = [
            { title: '岛民名', dataIndex: 'name' },
            { title: '物种', dataIndex: 'species' },
            {
                title: '星级',
                dataIndex: 'stars',
                align: 'center',
                render: (value) => {
                    const count = value as number;
                    return (
                        <span style={{ color: '#f59e0b', fontSize: '1.1em' }}>
                            {'★'.repeat(count)}{'☆'.repeat(5 - count)}
                        </span>
                    );
                },
            },
            {
                title: '操作',
                render: (_value, record) => (
                    <span
                        style={{
                            color: '#6ee7b7',
                            cursor: 'pointer',
                            fontWeight: 600,
                        }}
                    >
                        邀请 {(record as Islander).name} 来岛
                    </span>
                ),
            },
        ];
        return (
            <Table
                columns={renderColumns}
                dataSource={islanders.slice(0, 5)}
                rowKey="key"
            />
        );
    },
};

// ---------------------------------------------------------------------------
// Column.fixed left and right (requires scroll.x)
// ---------------------------------------------------------------------------

export const ColumnFixed: Story = {
    render: () => {
        const fixedColumns: Array<TableColumn<Islander>> = [
            { title: '岛民名', dataIndex: 'name', width: 120, fixed: 'left' },
            { title: '物种', dataIndex: 'species', width: 150 },
            { title: '性格', dataIndex: 'personality', width: 150 },
            { title: '口头禅', dataIndex: 'catchphrase', width: 150 },
            { title: '星级', dataIndex: 'stars', width: 150 },
            { title: '操作', width: 120, fixed: 'right', render: (_v, r) => <span style={{ color: '#6ee7b7' }}>查看 {(r as Islander).name}</span> },
        ];
        return (
            <Table
                columns={fixedColumns}
                dataSource={islanders}
                rowKey="key"
                scroll={{ x: 900 }}
            />
        );
    },
};

// ---------------------------------------------------------------------------
// Scroll — horizontal and vertical
// ---------------------------------------------------------------------------

export const ScrollXY: Story = {
    args: {
        columns: baseColumns,
        dataSource: islanders,
        rowKey: 'key',
        scroll: { x: 600, y: 200 },
    },
};

export const ScrollX: Story = {
    render: () => {
        const wideColumns: Array<TableColumn<Islander>> = [
            { title: '岛民名', dataIndex: 'name', width: 200 },
            { title: '物种', dataIndex: 'species', width: 200 },
            { title: '性格', dataIndex: 'personality', width: 200 },
            { title: '口头禅', dataIndex: 'catchphrase', width: 200 },
            { title: '星级', dataIndex: 'stars', width: 200 },
        ];
        return (
            <div style={{ width: 400 }}>
                <Table
                    columns={wideColumns}
                    dataSource={islanders.slice(0, 3)}
                    rowKey="key"
                    scroll={{ x: 1000 }}
                />
            </div>
        );
    },
};

export const ScrollY: Story = {
    args: {
        columns: baseColumns,
        dataSource: islanders,
        rowKey: 'key',
        scroll: { y: 180 },
    },
};

// ---------------------------------------------------------------------------
// rowClassName — string and function variants
// ---------------------------------------------------------------------------

export const RowClassNameString: Story = {
    args: {
        columns: baseColumns,
        dataSource: islanders.slice(0, 4),
        rowKey: 'key',
        rowClassName: 'font-bold',
        striped: false,
    },
};

export const RowClassNameFunction: Story = {
    render: () => {
        const styleTag = (
            <style>{`
                .island-vip { background: #fef3c7 !important; font-weight: 700; }
            `}</style>
        );
        return (
            <>
                {styleTag}
                <Table
                    columns={baseColumns}
                    dataSource={islanders.slice(0, 5)}
                    rowKey="key"
                    striped={false}
                    rowClassName={(_record, index) =>
                        index % 2 === 0 ? 'island-vip' : ''
                    }
                />
            </>
        );
    },
};

// ---------------------------------------------------------------------------
// onRow handlers — click and hover
// ---------------------------------------------------------------------------

export const OnRowHandlers: Story = {
    render: () => {
        const [selected, setSelected] = useState<string | null>(null);
        return (
            <div>
                <p style={{ marginBottom: 8, color: '#78716c' }}>
                    点击行选中：{selected ? `已选择 ${selected}` : '（未选择）'}
                </p>
                <Table
                    columns={baseColumns}
                    dataSource={islanders.slice(0, 5)}
                    rowKey="key"
                    onRow={(record) => ({
                        onClick: () => setSelected((record as Islander).name),
                        style: {
                            cursor: 'pointer',
                            background:
                                selected === (record as Islander).name
                                    ? '#d1fae5'
                                    : undefined,
                        },
                    })}
                />
            </div>
        );
    },
};

// ---------------------------------------------------------------------------
// Custom rowKey — function form
// ---------------------------------------------------------------------------

export const CustomRowKeyFunction: Story = {
    render: () => {
        const data = islanders.map(({ key: _k, ...rest }) => rest) as Array<
            Omit<Islander, 'key'>
        >;
        // rowKey as a function deriving the key from record fields
        return (
            <Table
                columns={baseColumns as Array<TableColumn<Record<string, unknown>>>}
                dataSource={data as Array<Record<string, unknown>>}
                rowKey={(record) =>
                    `${record['name'] as string}-${record['species'] as string}`
                }
            />
        );
    },
};

// ---------------------------------------------------------------------------
// Loading with no data (edge case)
// ---------------------------------------------------------------------------

export const LoadingEmpty: Story = {
    args: {
        columns: baseColumns,
        dataSource: [],
        rowKey: 'key',
        loading: true,
        emptyText: '集合啦！数据加载中……',
    },
};
