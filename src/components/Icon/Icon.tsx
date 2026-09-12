import React from 'react';
import * as NAIVE from './src';
import type { IconName, IconComponent } from './src/types';
import { cn } from '../../utils/cn';

const ICONS: Record<IconName, IconComponent> = Object.fromEntries(
    Object.entries(NAIVE)
        .filter(([, value]) => typeof value === 'function')
        .map(([cmpName, value]) => [cmpName.replace(/Icon$/, ''), value])
) as Record<IconName, IconComponent>;

export interface IconProps extends Omit<React.HTMLAttributes<HTMLElement>, 'color'> {
    /** 内置可爱图标名（共 101 个，如 Heart / Flower）。与 icon / src 三选一 */
    name?: IconName;
    /** 任意内置图标组件（import { HeartIcon } from 'animal-island-ui'）。与 name / src 三选一，优先级高于 name */
    icon?: IconComponent;
    /** 自定义图标资源 URL。与 name / icon 三选一，用于彩色位图等非矢量场景 */
    src?: string;
    size?: number | string;
    /** 描边颜色（svg 模式），默认继承 currentColor */
    color?: string;
    /** 描边粗细（svg 模式），默认 3.5 */
    strokeWidth?: number | string;
    bounce?: boolean;
}

export const Icon = React.forwardRef<HTMLElement, IconProps>(
    (
        {
            name,
            icon,
            src,
            size = 24,
            color,
            strokeWidth,
            className,
            style,
            bounce = false,
            'aria-label': ariaLabel,
            'aria-labelledby': ariaLabelledBy,
            'aria-hidden': ariaHiddenProp,
            ...rest
        },
        ref
    ) => {
        const labeled = Boolean(ariaLabel || ariaLabelledBy);
        const ariaHidden = ariaHiddenProp ?? (labeled ? undefined : true);
        const cls = cn('animal-icon', bounce && 'animal-icon-bounce', className);

        const IconCmp = icon ?? (name ? ICONS[name] : undefined);

        if (IconCmp) {
            const passthrough: Record<string, unknown> = { ...(rest as object) };
            if (color !== undefined) passthrough.stroke = color;
            if (strokeWidth !== undefined) passthrough.strokeWidth = strokeWidth;
            return (
                <IconCmp
                    ref={ref as React.Ref<SVGSVGElement>}
                    className={cls}
                    style={{ width: size, height: size, ...style }}
                    aria-hidden={ariaHidden}
                    role={labeled ? 'img' : undefined}
                    aria-label={ariaLabel}
                    aria-labelledby={ariaLabelledBy}
                    {...(passthrough as React.SVGProps<SVGSVGElement>)}
                />
            );
        }

        return (
            <span
                ref={ref as React.Ref<HTMLSpanElement>}
                className={cls}
                aria-hidden={ariaHidden}
                role={labeled ? 'img' : undefined}
                aria-label={ariaLabel}
                aria-labelledby={ariaLabelledBy}
                style={{
                    width: size,
                    height: size,
                    ...(src ? { backgroundImage: `url(${src})` } : null),
                    ...style,
                }}
                {...rest}
            />
        );
    }
);

Icon.displayName = 'Icon';

export type { IconName, IconComponent } from './src/types';

export const ICON_LIST = (Object.entries(ICONS) as Array<[IconName, IconComponent]>).map(([name]) => ({
    name,
    label: name,
}));
