import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import { cn } from '../../utils/cn';

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

const ISLAND_CLIP_PATH =
    'M0.501,0.005 L0.501,0.005 L0.523,0.005 L0.549,0.006 C0.704,0.01,0.796,0.017,0.825,0.027 L0.827,0.028 C0.872,0.045,0.939,0.044,0.978,0.17 C1,0.254,1,0.365,0.99,0.505 L0.988,0.513 C0.979,0.558,0.971,0.598,0.965,0.633 C0.956,0.689,0.979,0.77,0.964,0.865 C0.953,0.928,0.921,0.966,0.869,0.979 C0.821,0.986,0.773,0.992,0.726,0.995 L0.712,0.996 L0.694,0.997 C0.648,1,0.586,1,0.507,1 L0.501,1 L0.464,1 C0.385,1,0.325,0.998,0.283,0.995 C0.234,0.992,0.184,0.987,0.133,0.979 C0.081,0.966,0.05,0.928,0.039,0.865 C0.023,0.77,0.047,0.689,0.037,0.633 C0.031,0.595,0.023,0.552,0.013,0.505 C-0.006,0.365,-0.002,0.254,0.024,0.17 C0.064,0.045,0.13,0.045,0.174,0.028 L0.175,0.028 C0.204,0.017,0.303,0.009,0.474,0.005 L0.501,0.005';

const ISLAND_BG = 'rgb(247, 243, 223)';
const ISLAND_STROKE = '#c4b89e';

const IslandClipDef = ({ id }: { id: string }) => (
    <svg style={{ position: 'absolute', width: 0, height: 0 }} aria-hidden>
        <clipPath id={id} clipPathUnits="objectBoundingBox">
            <path d={ISLAND_CLIP_PATH} />
        </clipPath>
    </svg>
);

const IslandShapeSvg = () => (
    <svg className="animal-tooltip-island-svg" viewBox="0 0 1 1" preserveAspectRatio="none" aria-hidden>
        <path
            d={ISLAND_CLIP_PATH}
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
    const [visible, setVisible] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const uid = useId().replace(/:/g, '');
    const clipId = `animal-tooltip-clip-${uid}`;
    const tooltipId = `animal-tooltip-${uid}`;

    const clearTimer = useCallback(() => {
        if (!timerRef.current) return;
        clearTimeout(timerRef.current);
        timerRef.current = null;
    }, []);

    const show = useCallback(() => {
        clearTimer();
        setVisible(true);
    }, [clearTimer]);

    const hide = useCallback(() => {
        clearTimer();
        timerRef.current = setTimeout(() => {
            setVisible(false);
            timerRef.current = null;
        }, 100);
    }, [clearTimer]);

    useEffect(() => () => clearTimer(), [clearTimer]);

    const child = React.Children.only(children);
    const childProps = child.props as Record<string, unknown>;
    const triggerProps: Record<string, unknown> = {};

    if (trigger === 'hover') {
        triggerProps.onMouseEnter = (event: React.MouseEvent) => {
            show();
            (childProps.onMouseEnter as ((event: React.MouseEvent) => void) | undefined)?.(event);
        };
        triggerProps.onMouseLeave = (event: React.MouseEvent) => {
            hide();
            (childProps.onMouseLeave as ((event: React.MouseEvent) => void) | undefined)?.(event);
        };
    } else if (trigger === 'focus') {
        triggerProps.onFocus = (event: React.FocusEvent) => {
            show();
            (childProps.onFocus as ((event: React.FocusEvent) => void) | undefined)?.(event);
        };
        triggerProps.onBlur = (event: React.FocusEvent) => {
            hide();
            (childProps.onBlur as ((event: React.FocusEvent) => void) | undefined)?.(event);
        };
    } else {
        triggerProps.onClick = (event: React.MouseEvent) => {
            setVisible((current) => !current);
            (childProps.onClick as ((event: React.MouseEvent) => void) | undefined)?.(event);
        };
    }

    const isIsland = variant === 'island';

    if (visible) {
        triggerProps['aria-describedby'] = tooltipId;
    }

    return (
        <div className={cn('animal-tooltip-wrapper', className)} style={style}>
            {React.cloneElement(child, triggerProps)}
            <div
                id={tooltipId}
                role="tooltip"
                aria-hidden={!visible}
                className={cn(
                    'animal-tooltip',
                    `animal-tooltip-${placement}`,
                    isIsland && 'animal-tooltip-island',
                    bordered ? 'animal-tooltip-bordered' : 'animal-tooltip-borderless',
                    visible && 'animal-tooltip-visible',
                )}
                onMouseEnter={trigger === 'hover' ? show : undefined}
                onMouseLeave={trigger === 'hover' ? hide : undefined}
            >
                {isIsland ? (
                    <>
                        <div className="animal-tooltip-island-body">
                            <IslandClipDef id={clipId} />
                            {bordered && <IslandShapeSvg />}
                            <div className="animal-tooltip-island-content" style={{ clipPath: `url(#${clipId})` }}>
                                <div className="animal-tooltip-content">{title}</div>
                            </div>
                        </div>
                        <span className="animal-tooltip-tail" aria-hidden />
                    </>
                ) : (
                    <div className="animal-tooltip-content">{title}</div>
                )}
            </div>
        </div>
    );
};

Tooltip.displayName = 'Tooltip';
