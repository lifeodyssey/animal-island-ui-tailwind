import React, { useState } from 'react';
import * as RadixTabs from '@radix-ui/react-tabs';
import { cn } from '../../utils/cn';

export interface TabItem {
    key: string;
    label: React.ReactNode;
    children: React.ReactNode;
}

export interface TabsProps
    extends Omit<
        React.ComponentPropsWithoutRef<typeof RadixTabs.Root>,
        'value' | 'defaultValue' | 'onValueChange' | 'onChange'
    > {
    items: TabItem[];
    defaultActiveKey?: string;
    activeKey?: string;
    onChange?: (key: string) => void;
    leafAnimation?: boolean;
    shadow?: boolean;
    /** Accessible label forwarded to the tab list */
    'aria-label'?: string;
}

export const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
    (
        {
            items,
            defaultActiveKey,
            activeKey,
            onChange,
            className,
            style,
            leafAnimation = true,
            shadow = true,
            'aria-label': ariaLabel,
            ...rest
        },
        ref
    ) => {
        const isControlled = activeKey !== undefined;

        // Track the active key for leaf animation styling.
        // In controlled mode this is always `activeKey`.
        // In uncontrolled mode we mirror what Radix tracks via onValueChange.
        const [innerKey, setInnerKey] = useState(
            defaultActiveKey ?? items[0]?.key
        );
        const currentActiveKey = isControlled ? activeKey : innerKey;

        const handleValueChange = (key: string) => {
            if (!isControlled) {
                setInnerKey(key);
            }
            onChange?.(key);
        };

        // Build props for RadixTabs.Root depending on controlled vs uncontrolled
        const rootProps = isControlled
            ? { value: activeKey, onValueChange: handleValueChange }
            : {
                  defaultValue: defaultActiveKey ?? items[0]?.key,
                  onValueChange: handleValueChange,
              };

        return (
            <RadixTabs.Root
                ref={ref}
                className={cn('animal-tabs', className)}
                style={style}
                {...rootProps}
                {...rest}
            >
                <RadixTabs.List className="animal-tabs-list" aria-label={ariaLabel}>
                    {items.map((item) => {
                        const isActive = item.key === currentActiveKey;
                        return (
                            <RadixTabs.Trigger
                                key={item.key}
                                value={item.key}
                                className={cn(
                                    'animal-tab-trigger',
                                    isActive && shadow && 'animal-tab-shadow'
                                )}
                            >
                                <span className="animal-tab-icon">
                                    {isActive ? '●' : '○'}
                                </span>
                                <span className="animal-tab-label">{item.label}</span>
                                {isActive && (
                                    <svg
                                        viewBox="0 0 24 24"
                                        aria-hidden="true"
                                        className={cn(
                                            'animal-tab-leaf',
                                            !leafAnimation && 'animal-tab-leaf-static'
                                        )}
                                    >
                                        {/* 原创叶子：椭圆叶片 + 中脉，非素材文件 */}
                                        <path
                                            d="M12 3C7.5 7 5.5 11 5.5 14.5A6.5 6.5 0 0 0 18.5 14.5C18.5 11 16.5 7 12 3z"
                                            fill="#7bc47f"
                                            stroke="#57a05c"
                                            strokeWidth="1.5"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M12 6.5v12"
                                            stroke="#57a05c"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                )}
                            </RadixTabs.Trigger>
                        );
                    })}
                </RadixTabs.List>
                {items.map((item) => (
                    <RadixTabs.Content
                        key={item.key}
                        value={item.key}
                        className="animal-tab-content"
                    >
                        <div className="animal-tab-content-inner">
                            {item.children}
                        </div>
                    </RadixTabs.Content>
                ))}
            </RadixTabs.Root>
        );
    }
);

Tabs.displayName = 'Tabs';
