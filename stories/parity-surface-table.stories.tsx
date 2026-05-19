import type { Meta, StoryObj } from '@storybook/react-vite';
import type { CSSProperties } from 'react';
import { useMemo, useState } from 'react';
import { expect, userEvent } from 'storybook/test';
import { Button, Table } from '../src';
import type { TableColumn } from '../src';

type Islander = {
    key: string;
    name: string;
    age: number;
    island: string;
    fruit: string;
    hobby: string;
};

const meta = {
    title: 'Regression/Parity/Surface Table',
    parameters: {
        layout: 'padded',
    },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

const sectionStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
    maxWidth: 980,
    fontFamily: 'var(--animal-font-family)',
} satisfies CSSProperties;

const rowStyle = {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
} satisfies CSSProperties;

const panelStyle = {
    background: '#faf8f3',
    border: '1px solid #e8e2d6',
    borderRadius: 12,
    padding: 16,
} satisfies CSSProperties;

const labelStyle = {
    color: '#a0936e',
    fontSize: 14,
    fontWeight: 700,
} satisfies CSSProperties;

const islanders: Islander[] = [
    { key: '1', name: '豆狸', age: 26, island: '彩虹岛', fruit: '苹果', hobby: '音乐' },
    { key: '2', name: '粒狸', age: 24, island: '彩虹岛', fruit: '橘子', hobby: '运动' },
    { key: '3', name: '西施惠', age: 28, island: '好评岛', fruit: '樱桃', hobby: '唱歌' },
    { key: '4', name: '喻哥', age: 30, island: '无人岛', fruit: '梨', hobby: '钓鱼' },
    { key: '5', name: '小润', age: 22, island: '摸鱼岛', fruit: '桃子', hobby: '画画' },
];

const hobbyTag = (hobby: string) => (
    <span
        style={{
            padding: '4px 10px',
            borderRadius: 20,
            background: 'rgba(25, 200, 185, 0.15)',
            color: '#19c8b9',
            fontSize: 12,
            fontWeight: 700,
        }}
    >
        {hobby}
    </span>
);

const columns: TableColumn<Islander>[] = [
    { title: '岛民', dataIndex: 'name', width: 120 },
    { title: '年龄', dataIndex: 'age', width: 80, align: 'center' },
    { title: '岛屿', dataIndex: 'island' },
    { title: '喜欢的水果', dataIndex: 'fruit' },
    { title: '爱好', dataIndex: 'hobby', render: (value) => hobbyTag(String(value ?? '')) },
];

const TableParityScene = () => {
    const [striped, setStriped] = useState(true);
    const [loading, setLoading] = useState(false);
    const [showHeader, setShowHeader] = useState(true);

    const tableData = useMemo(() => islanders, []);

    return (
        <section data-testid="table-parity-region" style={sectionStyle}>
            <div style={labelStyle}>Table basic parity</div>
            <div style={rowStyle}>
                <Button type={striped ? 'primary' : 'default'} onClick={() => setStriped((value) => !value)}>
                    Toggle striped
                </Button>
                <Button type={showHeader ? 'primary' : 'default'} onClick={() => setShowHeader((value) => !value)}>
                    Toggle header
                </Button>
                <Button
                    type="primary"
                    disabled={loading}
                    onClick={() => {
                        setLoading(true);
                        window.setTimeout(() => setLoading(false), 700);
                    }}
                >
                    Show loading
                </Button>
            </div>
            <div style={panelStyle}>
                <Table
                    columns={columns}
                    dataSource={tableData}
                    striped={striped}
                    showHeader={showHeader}
                    loading={loading}
                />
            </div>
        </section>
    );
};

const TableEmptyScene = () => (
    <section data-testid="table-empty-region" style={sectionStyle}>
        <div style={labelStyle}>Table empty + custom empty text</div>
        <div style={panelStyle}>
            <Table
                columns={columns}
                dataSource={[]}
                emptyText="暂时没有岛民数据"
                showHeader
            />
        </div>
    </section>
);

export const TableParity: Story = {
    render: () => <TableParityScene />,
    play: async ({ canvas }) => {
        await expect(canvas.getByTestId('table-parity-region')).toBeVisible();
        await expect(canvas.getByRole('columnheader', { name: '岛民' })).toBeVisible();
        await expect(canvas.getByText('豆狸')).toBeVisible();

        await userEvent.click(canvas.getByRole('button', { name: 'Toggle striped' }));
        await expect(canvas.getByRole('row', { name: /粒狸/ })).toBeVisible();

        await userEvent.click(canvas.getByRole('button', { name: 'Show loading' }));
        await expect(canvas.getByRole('button', { name: 'Show loading' })).toBeDisabled();

        await userEvent.click(canvas.getByRole('button', { name: 'Toggle header' }));
        await expect(canvas.queryByRole('columnheader', { name: '岛民' })).not.toBeInTheDocument();
    },
};

export const TableStable: Story = {
    render: () => <TableParityScene />,
};

export const TableEmptyStable: Story = {
    render: () => <TableEmptyScene />,
};
