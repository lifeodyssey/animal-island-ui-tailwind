import React from 'react';
import * as NAIVE from './src';
import type { IconName, IconComponent } from './src/types';
import { cn } from '../../utils/cn';

/** Built-in icon registry: key is the name without the "Icon" suffix (e.g. "Flower"). */
const ICONS: Record<IconName, IconComponent> = Object.fromEntries(
    Object.entries(NAIVE)
        .filter(([, value]) => typeof value === 'function')
        .map(([cmpName, value]) => [cmpName.replace(/Icon$/, ''), value])
) as Record<IconName, IconComponent>;

export interface IconProps extends Omit<React.HTMLAttributes<HTMLElement>, 'color'> {
    /** Built-in icon name (one of 101, e.g. Heart / Flower). Mutually exclusive with icon / src. */
    name?: IconName;
    /** Any built-in icon component. Takes priority over name. Mutually exclusive with name / src. */
    icon?: IconComponent;
    /** Custom icon resource URL, for bitmaps etc. Mutually exclusive with name / icon. */
    src?: string;
    size?: number | string;
    /** Stroke color (SVG mode), defaults to inherited currentColor. */
    color?: string;
    /** Stroke width (SVG mode), defaults to 3.5. */
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

export type { IconName, IconComponent } from './src/types';

/** All 101 built-in icons in registry order, for display use. */
export const ICON_LIST = (Object.entries(ICONS) as Array<[IconName, IconComponent]>).map(([name]) => ({
    name,
    label: name,
})) as ReadonlyArray<{ name: IconName; label: string }>;
