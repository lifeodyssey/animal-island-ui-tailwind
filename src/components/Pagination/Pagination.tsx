import React, { useEffect, useRef, useState } from 'react';
import { cn } from '../../utils/cn';

export type PaginationVariant = 'orange' | 'teal';

export interface PaginationProps {
    /** Total number of data items */
    total: number;
    /** Current page (controlled) */
    current?: number;
    /** Default current page */
    defaultCurrent?: number;
    /** Page size (controlled) */
    pageSize?: number;
    /** Default page size */
    defaultPageSize?: number;
    /** Called when page or pageSize changes */
    onChange?: (page: number, pageSize: number) => void;
    /** Called when pageSize changes */
    onShowSizeChange?: (current: number, size: number) => void;
    /** Whether to show page size changer */
    showSizeChanger?: boolean;
    /** Available page size options */
    pageSizeOptions?: number[];
    /** Whether to show quick jumper input */
    showQuickJumper?: boolean;
    /** Whether to show total count */
    showTotal?: boolean;
    /** Whether disabled */
    disabled?: boolean;
    /** Color variant: orange (default, DatePicker amber) / teal (DatePicker teal) */
    variant?: PaginationVariant;
    className?: string;
    style?: React.CSSProperties;
}

type PageItem = number | 'ellipsis-left' | 'ellipsis-right';

const getPageItems = (current: number, pageCount: number): PageItem[] => {
    if (pageCount <= 7) {
        return Array.from({ length: pageCount }, (_, i) => i + 1);
    }
    const items: PageItem[] = [1];
    if (current > 3) items.push('ellipsis-left');
    const start = Math.max(2, current - 1);
    const end = Math.min(pageCount - 1, current + 1);
    for (let i = start; i <= end; i += 1) items.push(i);
    if (current < pageCount - 2) items.push('ellipsis-right');
    items.push(pageCount);
    return items;
};

const ChevronLeft = () => (
    <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" focusable="false">
        <path
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 5l-7 7 7 7"
        />
    </svg>
);

const ChevronRight = () => (
    <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" focusable="false">
        <path
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 5l7 7-7 7"
        />
    </svg>
);

const CaretDown = () => (
    <svg viewBox="0 0 24 24" width="10" height="10" aria-hidden="true" focusable="false">
        <path fill="currentColor" d="M12 16.5L5.5 9h13z" />
    </svg>
);

const SizeChanger: React.FC<{
    value: number;
    options: number[];
    disabled?: boolean;
    onChange: (size: number) => void;
}> = ({ value, options, disabled, onChange }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return undefined;
        const handleMouseDown = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setOpen(false);
        };
        document.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [open]);

    return (
        <div className="animal-pagination-size-changer" ref={ref}>
            <button
                type="button"
                className={cn(
                    'animal-pagination-size-trigger',
                    open && 'animal-pagination-size-trigger-open',
                )}
                disabled={disabled}
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-label={`每页 ${value} 条`}
                onClick={() => setOpen((v) => !v)}
            >
                <span>{value} 条/页</span>
                <span className="animal-pagination-caret">
                    <CaretDown />
                </span>
            </button>
            {open && (
                <ul className="animal-pagination-size-list" role="listbox" aria-label="选择每页条数">
                    {options.map((opt) => (
                        <li
                            key={opt}
                            role="option"
                            aria-selected={opt === value}
                            className={cn(
                                'animal-pagination-size-option',
                                opt === value && 'animal-pagination-size-option-active',
                            )}
                            onClick={() => {
                                setOpen(false);
                                if (opt !== value) onChange(opt);
                            }}
                        >
                            {opt} 条/页
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

const QuickJumper: React.FC<{ disabled?: boolean; onJump: (page: number) => void }> = ({ disabled, onJump }) => {
    const [text, setText] = useState('');

    const jump = () => {
        const page = parseInt(text, 10);
        setText('');
        if (!Number.isNaN(page)) onJump(page);
    };

    return (
        <span className="animal-pagination-jumper">
            跳至
            <input
                className="animal-pagination-jumper-input"
                value={text}
                disabled={disabled}
                inputMode="numeric"
                aria-label="跳转到指定页"
                onChange={(e) => setText(e.target.value.replace(/[^\d]/g, ''))}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') jump();
                }}
                onBlur={jump}
            />
            页
        </span>
    );
};

export const Pagination: React.FC<PaginationProps> = ({
    total,
    current,
    defaultCurrent = 1,
    pageSize: pageSizeProp,
    defaultPageSize = 10,
    onChange,
    onShowSizeChange,
    showSizeChanger = false,
    pageSizeOptions,
    showQuickJumper = false,
    showTotal = false,
    disabled = false,
    variant = 'orange',
    className,
    style,
}) => {
    const [innerPage, setInnerPage] = useState(defaultCurrent);
    const [innerPageSize, setInnerPageSize] = useState(defaultPageSize);

    const pageSize = pageSizeProp ?? innerPageSize;
    const pageCount = Math.max(1, Math.ceil(Math.max(0, total) / pageSize));
    const page = Math.min(current ?? innerPage, pageCount);
    const items = getPageItems(page, pageCount);

    const changePage = (next: number) => {
        const target = Math.min(Math.max(1, next), pageCount);
        if (target === page) return;
        if (current === undefined) setInnerPage(target);
        onChange?.(target, pageSize);
    };

    const changePageSize = (size: number) => {
        const nextPageCount = Math.max(1, Math.ceil(Math.max(0, total) / size));
        const targetPage = Math.min(page, nextPageCount);
        if (pageSizeProp === undefined) setInnerPageSize(size);
        if (current === undefined) setInnerPage(targetPage);
        onShowSizeChange?.(targetPage, size);
        if (targetPage !== page || size !== pageSize) onChange?.(targetPage, size);
    };

    return (
        <nav
            className={cn(
                'animal-pagination',
                `animal-pagination-${variant}`,
                disabled && 'animal-pagination-disabled',
                className,
            )}
            style={style}
            aria-label="分页"
        >
            {showTotal && <span className="animal-pagination-total">共 {total} 条</span>}
            <button
                type="button"
                className="animal-pagination-item"
                disabled={disabled || page <= 1}
                aria-label="上一页"
                onClick={() => changePage(page - 1)}
            >
                <ChevronLeft />
            </button>
            {items.map((item) =>
                typeof item === 'number' ? (
                    <button
                        key={item}
                        type="button"
                        className={cn('animal-pagination-item', item === page && 'animal-pagination-item-active')}
                        disabled={disabled}
                        aria-current={item === page ? 'page' : undefined}
                        onClick={() => changePage(item)}
                    >
                        {item}
                    </button>
                ) : (
                    <span key={item} className="animal-pagination-ellipsis" aria-hidden="true">
                        ···
                    </span>
                )
            )}
            <button
                type="button"
                className="animal-pagination-item"
                disabled={disabled || page >= pageCount}
                aria-label="下一页"
                onClick={() => changePage(page + 1)}
            >
                <ChevronRight />
            </button>
            {showSizeChanger && (
                <SizeChanger
                    value={pageSize}
                    options={pageSizeOptions ?? [10, 20, 50, 100]}
                    disabled={disabled}
                    onChange={changePageSize}
                />
            )}
            {showQuickJumper && <QuickJumper disabled={disabled} onJump={changePage} />}
        </nav>
    );
};

Pagination.displayName = 'Pagination';
