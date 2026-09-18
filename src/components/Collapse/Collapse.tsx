import React, { useState } from 'react';
import * as RadixAccordion from '@radix-ui/react-accordion';
import { cn } from '../../utils/cn';

const COLLAPSE_ITEM_VALUE = 'item';

export interface CollapseProps
    extends Omit<
        React.ComponentPropsWithoutRef<typeof RadixAccordion.Root>,
        'type' | 'value' | 'defaultValue' | 'onValueChange' | 'onChange'
    > {
    /** 问题标题 */
    question: React.ReactNode;
    /** 答案内容 */
    answer: React.ReactNode;
    /** 是否默认展开 */
    defaultExpanded?: boolean;
    /** 是否展开（受控模式） */
    expanded?: boolean;
    /** 展开状态变化回调 */
    onChange?: (expanded: boolean) => void;
    /** 是否禁用 */
    disabled?: boolean;
}

export const Collapse = React.forwardRef<HTMLDivElement, CollapseProps>(
    (
        {
            question,
            answer,
            defaultExpanded = false,
            expanded,
            onChange,
            disabled = false,
            className,
            style,
            ...rest
        },
        ref
    ) => {
        const isControlled = expanded !== undefined;
        const [innerExpanded, setInnerExpanded] = useState(defaultExpanded);
        const currentExpanded = isControlled ? expanded : innerExpanded;

        const handleValueChange = (value: string) => {
            const nextExpanded = value === COLLAPSE_ITEM_VALUE;
            if (!isControlled) {
                setInnerExpanded(nextExpanded);
            }
            onChange?.(nextExpanded);
        };
        const rootValueProps = isControlled
            ? { value: currentExpanded ? COLLAPSE_ITEM_VALUE : '' }
            : { defaultValue: defaultExpanded ? COLLAPSE_ITEM_VALUE : undefined };

        return (
            <RadixAccordion.Root
                ref={ref}
                type="single"
                collapsible
                onValueChange={handleValueChange}
                className={cn(
                    'animal-collapse',
                    disabled && 'animal-collapse-disabled',
                    className
                )}
                style={style}
                {...rootValueProps}
                {...rest}
            >
                <RadixAccordion.Item value={COLLAPSE_ITEM_VALUE} disabled={disabled}>
                    <RadixAccordion.Header className="animal-collapse-heading">
                        <RadixAccordion.Trigger className="animal-collapse-header">
                            <span className="animal-collapse-icon">
                                {currentExpanded ? '−' : '+'}
                            </span>
                            <span className="animal-collapse-title">{question}</span>
                            <span className="animal-collapse-leaf">
                                <svg
                                    viewBox="0 0 48 48"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={3.5}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    aria-hidden
                                >
                                    <path d="M6 24 C 8 14 22 10 30 14 C 38 18 38 30 30 34 C 22 38 8 34 6 24 Z" fill="#2A9D8F" />
                                    <path d="M30 24 L42 14 L42 34 Z" fill="#E76F51" />
                                    <circle cx="14" cy="22" r="2" fill="#FFFFFF" />
                                    <circle cx="14" cy="22" r="1" fill="#2A2A2A" />
                                </svg>
                            </span>
                        </RadixAccordion.Trigger>
                    </RadixAccordion.Header>
                    <RadixAccordion.Content className="animal-collapse-content">
                        <div className="animal-collapse-content-inner">{answer}</div>
                    </RadixAccordion.Content>
                </RadixAccordion.Item>
            </RadixAccordion.Root>
        );
    }
);

Collapse.displayName = 'Collapse';
