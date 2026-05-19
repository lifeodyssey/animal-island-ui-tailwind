import React from 'react';
import { cn } from '../../utils/cn';

type TableRecord = Record<string, unknown>;

export interface TableColumn<T extends TableRecord = TableRecord> {
    title: React.ReactNode;
    dataIndex?: keyof T;
    render?: (value: unknown, record: T, index: number) => React.ReactNode;
    width?: string | number;
    align?: 'left' | 'center' | 'right';
    fixed?: 'left' | 'right';
    style?: React.CSSProperties;
}

export interface TableProps<T extends TableRecord = TableRecord> extends React.HTMLAttributes<HTMLDivElement> {
    columns?: Array<TableColumn<T>>;
    dataSource?: T[];
    rowKey?: keyof T | ((record: T) => string);
    striped?: boolean;
    showHeader?: boolean;
    rowClassName?: string | ((record: T, index: number) => string);
    onRow?: (record: T, index: number) => React.HTMLAttributes<HTMLTableRowElement>;
    loading?: boolean;
    emptyText?: React.ReactNode;
    scroll?: {
        x?: number | string;
        y?: number | string;
    };
}

const TableInner = <T extends TableRecord>(
    {
        columns = [],
        dataSource = [],
        rowKey = 'key',
        striped = true,
        showHeader = true,
        rowClassName,
        onRow,
        loading = false,
        emptyText = '暂无数据',
        scroll,
        className,
        style,
        ...rest
    }: TableProps<T>,
    ref: React.ForwardedRef<HTMLDivElement>,
) => {
    const getRowKey = (record: T, index: number): string => {
        if (typeof rowKey === 'function') {
            return rowKey(record);
        }
        const keyValue = record[rowKey];
        return keyValue == null ? String(index) : String(keyValue);
    };

    const getRowClassName = (record: T, index: number) => {
        const extra =
            typeof rowClassName === 'function'
                ? rowClassName(record, index)
                : rowClassName;

        return cn(
            'animal-table-row',
            striped && index % 2 === 1 && 'animal-table-row-striped',
            extra,
        );
    };

    const renderCell = (column: TableColumn<T>, record: T, index: number) => {
        const value = column.dataIndex ? record[column.dataIndex] : undefined;
        if (column.render) {
            return column.render(value, record, index);
        }
        return value as React.ReactNode;
    };

    const wrapperStyle: React.CSSProperties = {
        ...style,
        ...(scroll?.x || scroll?.y
            ? {
                overflowX: scroll?.x ? 'auto' : undefined,
                overflowY: scroll?.y ? 'auto' : undefined,
                maxHeight: scroll?.y,
            }
            : null),
    };

    const tableStyle: React.CSSProperties = {
        minWidth: scroll?.x,
    };

    return (
        <div
            ref={ref}
            className={cn(
                'animal-table-wrapper',
                (scroll?.x || scroll?.y) && 'animal-table-scrollable',
                className,
            )}
            style={wrapperStyle}
            {...rest}
        >
            <table className={cn('animal-table', loading && 'animal-table-loading')} style={tableStyle} aria-busy={loading || undefined}>
                {showHeader && (
                    <thead className="animal-table-head">
                        <tr className="animal-table-head-row">
                            {columns.map((column, index) => (
                                <th
                                    key={index}
                                    className="animal-table-head-cell"
                                    style={{
                                        width: column.width,
                                        textAlign: column.align ?? 'left',
                                        ...column.style,
                                    }}
                                >
                                    {column.title}
                                </th>
                            ))}
                        </tr>
                    </thead>
                )}
                <tbody className="animal-table-body">
                    {dataSource.length === 0 ? (
                        <tr>
                            <td colSpan={Math.max(columns.length, 1)} className="animal-table-empty-cell">
                                <div className="animal-table-empty-content">
                                    <svg
                                        className="animal-table-empty-icon"
                                        viewBox="0 0 24 24"
                                        width="48"
                                        height="48"
                                        aria-hidden="true"
                                    >
                                        <path
                                            fill="currentColor"
                                            d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM7 10h2v7H7zm4-3h2v10h-2zm4 6h2v4h-2z"
                                        />
                                    </svg>
                                    <span>{emptyText}</span>
                                </div>
                            </td>
                        </tr>
                    ) : (
                        dataSource.map((record, index) => (
                            <tr
                                key={getRowKey(record, index)}
                                className={getRowClassName(record, index)}
                                {...onRow?.(record, index)}
                            >
                                {columns.map((column, columnIndex) => (
                                    <td
                                        key={columnIndex}
                                        className="animal-table-cell"
                                        style={{
                                            textAlign: column.align ?? 'left',
                                            ...column.style,
                                        }}
                                    >
                                        {renderCell(column, record, index)}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {loading && (
                <div className="animal-table-loading-overlay">
                    <div className="animal-table-loading-spinner" aria-label="loading">
                        <svg viewBox="0 0 50 50" width="40" height="40" aria-hidden="true">
                            <circle
                                cx="25"
                                cy="25"
                                r="20"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="4"
                                strokeLinecap="round"
                                strokeDasharray="31.4 31.4"
                            />
                        </svg>
                    </div>
                </div>
            )}
        </div>
    );
};

type TableComponent = <T extends TableRecord = TableRecord>(
    props: TableProps<T> & React.RefAttributes<HTMLDivElement>,
) => React.ReactElement | null;

const TableForward = React.forwardRef(TableInner);
TableForward.displayName = 'Table';

export const Table = TableForward as TableComponent;
