import React, { useState } from 'react';
import * as RadixAccordion from '@radix-ui/react-accordion';
import { cn } from '../../utils/cn';
import { Icon } from '../Icon';

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
                                <Icon name="Fish" size={20} color="currentColor" />
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
