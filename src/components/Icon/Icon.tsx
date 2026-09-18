import React from 'react';
import * as NAIVE from './src';
import type { IconName, IconComponent } from './src/types';
import { cn } from '../../utils/cn';

/** Built-in cute icon registry: key is the name without the "Icon" suffix (e.g. "Flower") */
const ICONS: Record<IconName, IconComponent> = Object.fromEntries(
    Object.entries(NAIVE)
        .filter(([, value]) => typeof value === 'function')
        .map(([cmpName, value]) => [cmpName.replace(/Icon$/, ''), value])
) as Record<IconName, IconComponent>;

export interface IconProps extends Omit<React.HTMLAttributes<HTMLElement>, 'color'> {
    /** Built-in icon name (101 available, e.g. Heart / Flower). Mutually exclusive with `icon` / `src`. */
    name?: IconName;
    /** Any built-in icon component (e.g. `import { HeartIcon } from 'animal-island-ui-tailwind'`). Mutually exclusive with `name` / `src`, takes priority over `name`. */
    icon?: IconComponent;
    /** Custom icon resource URL for bitmaps / non-vector cases. Mutually exclusive with `name` / `icon`. */
    src?: string;
    size?: number | string;
    /** Stroke color in SVG mode; defaults to currentColor. */
    color?: string;
    /** Stroke width in SVG mode; defaults to 3.5 (relative to 48×48 canvas). */
    strokeWidth?: number | string;
    bounce?: boolean;
}

export const Icon: React.FC<IconProps> = ({
    name,
    icon,
    src,
    size = 24,
    color,
    strokeWidth,
    className,
    style,
    bounce = false,
    ...rest
}) => {
    const cls = cn('animal-icon', bounce && 'animal-icon-bounce', className);

    const IconCmp = icon ?? (name ? ICONS[name] : undefined);

    if (IconCmp) {
        const labeled = Boolean(rest['aria-label']);
        const passthrough: Record<string, unknown> = { ...(rest as object) };
        // Naive icon defaults: stroke="#2A2A2A" strokeWidth={3.5}; only override when explicitly provided
        if (color !== undefined) passthrough.stroke = color;
        if (strokeWidth !== undefined) passthrough.strokeWidth = strokeWidth;
        return (
            <IconCmp
                className={cls}
                style={{ width: size, height: size, ...style }}
                aria-hidden={labeled ? undefined : true}
                role={labeled ? 'img' : undefined}
                {...(passthrough as React.SVGProps<SVGSVGElement>)}
            />
        );
    }

    return (
        <span
            className={cls}
            style={{
                width: size,
                height: size,
                ...(src ? { backgroundImage: `url(${src})` } : null),
                ...style,
            }}
            {...rest}
        />
    );
};

Icon.displayName = 'Icon';

export const ICON_LIST = (Object.entries(ICONS) as Array<[IconName, IconComponent]>).map(([name]) => ({
    name,
    label: name,
}));

export type { IconName, IconComponent } from './src/types';
