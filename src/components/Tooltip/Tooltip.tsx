import React, { useState } from 'react';
import * as RadixTooltip from '@radix-ui/react-tooltip';
import { cn } from '../../utils/cn';
import { useSafeId } from '../../utils/useSafeId';
import { ISLAND_BLOB_PATH } from '../../utils/shapes';

export type TooltipPlacement =
    | 'top'
    | 'top-start'
    | 'top-end'
    | 'bottom'
    | 'bottom-start'
    | 'bottom-end'
    | 'left'
    | 'left-start'
    | 'left-end'
    | 'right'
    | 'right-start'
    | 'right-end';

export type TooltipTrigger = 'hover' | 'focus' | 'click';
export type TooltipVariant = 'default' | 'island';

const ISLAND_BG = 'rgb(247, 243, 223)';
const ISLAND_STROKE = '#c4b89e';

const IslandClipDef = ({ id }: { id: string }) => (
    <svg style={{ position: 'absolute', width: 0, height: 0 }} aria-hidden>
        <clipPath id={id} clipPathUnits="objectBoundingBox">
            <path d={ISLAND_BLOB_PATH} />
        </clipPath>
    </svg>
);

const IslandShapeSvg = () => (
    <svg className="animal-tooltip-island-svg" viewBox="0 0 1 1" preserveAspectRatio="none" aria-hidden>
        <path
            d={ISLAND_BLOB_PATH}
            fill={ISLAND_BG}
            stroke={ISLAND_STROKE}
            strokeWidth={2}
            vectorEffect="non-scaling-stroke"
            strokeLinejoin="round"
        />
    </svg>
);

export interface TooltipProps {
    /** 提示内容，支持多行（可用 \n 或 <br/> 换行） */
    title: React.ReactNode;
    /** 位置 */
    placement?: TooltipPlacement;
    /** 触发方式 */
    trigger?: TooltipTrigger;
    /** 视觉风格 */
    variant?: TooltipVariant;
    /** 是否显示边框 */
    bordered?: boolean;
    /** 子元素（触发器） */
    children: React.ReactElement;
    /** 自定义类名 */
    className?: string;
    /** 自定义样式 */
    style?: React.CSSProperties;
}

const placementToSide = (p: TooltipPlacement): 'top' | 'bottom' | 'left' | 'right' =>
    p.split('-')[0] as 'top' | 'bottom' | 'left' | 'right';

const placementToAlign = (p: TooltipPlacement): 'start' | 'center' | 'end' => {
    const part = p.split('-')[1];
    if (part === 'start') return 'start';
    if (part === 'end') return 'end';
    return 'center';
};

export const Tooltip: React.FC<TooltipProps> = ({
    title,
    placement = 'top',
    trigger = 'hover',
    variant = 'default',
    bordered = true,
    children,
    className,
    style,
}) => {
    const [clickOpen, setClickOpen] = useState(false);
    const isClick = trigger === 'click';
    const isIsland = variant === 'island';
    const uid = useSafeId();
    const clipId = `animal-tooltip-clip-${uid}`;

    const child = React.Children.only(children);
    const triggerNode = isClick
        ? React.cloneElement(child, {
              onClick: (event: React.MouseEvent) => {
                  setClickOpen((current) => !current);
                  (
                      child.props as { onClick?: (event: React.MouseEvent) => void }
                  ).onClick?.(event);
              },
          } as React.HTMLAttributes<HTMLElement>)
        : child;

    return (
        <RadixTooltip.Provider delayDuration={0} disableHoverableContent={trigger === 'focus'}>
            <RadixTooltip.Root
                open={isClick ? clickOpen : undefined}
                onOpenChange={isClick ? setClickOpen : undefined}
            >
                <RadixTooltip.Trigger asChild>{triggerNode}</RadixTooltip.Trigger>
                <RadixTooltip.Portal>
                    <RadixTooltip.Content
                        side={placementToSide(placement)}
                        align={placementToAlign(placement)}
                        sideOffset={6}
                        className={cn(
                            'animal-tooltip',
                            `animal-tooltip-${placement}`,
                            isIsland && 'animal-tooltip-island',
                            bordered ? 'animal-tooltip-bordered' : 'animal-tooltip-borderless',
                            'animal-tooltip-visible',
                            className,
                        )}
                        style={style}
                    >
                        {isIsland ? (
                            <>
                                <div className="animal-tooltip-island-body">
                                    <IslandClipDef id={clipId} />
                                    {bordered && <IslandShapeSvg />}
                                    <div
                                        className="animal-tooltip-island-content"
                                        style={{ clipPath: `url(#${clipId})` }}
                                    >
                                        <div className="animal-tooltip-content">{title}</div>
                                    </div>
                                </div>
                                <span className="animal-tooltip-tail" aria-hidden />
                            </>
                        ) : (
                            <div className="animal-tooltip-content">{title}</div>
                        )}
                    </RadixTooltip.Content>
                </RadixTooltip.Portal>
            </RadixTooltip.Root>
        </RadixTooltip.Provider>
    );
};

Tooltip.displayName = 'Tooltip';
