import React, { useState } from 'react';
import * as RadixTabs from '@radix-ui/react-tabs';
import { cn } from '../../utils/cn';
import leafIcon from '../../assets/img/icons/icon-leaf.png';

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
                                    <img
                                        src={leafIcon}
                                        alt=""
                                        className={cn(
                                            'animal-tab-leaf',
                                            !leafAnimation && 'animal-tab-leaf-static'
                                        )}
                                    />
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
