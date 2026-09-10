import React from 'react';
import * as NAIVE from './src';
import type { IconName, IconComponent } from './src/types';
import { cn } from '../../utils/cn';

/** Built-in cute icon registry: key is the name without the Icon suffix (e.g. 'Flower'). 101 icons from src/components/Icon/src. */
const ICONS: Record<IconName, IconComponent> = Object.fromEntries(
    Object.entries(NAIVE)
        .filter(([, value]) => typeof value === 'function')
        .map(([cmpName, value]) => [cmpName.replace(/Icon$/, ''), value])
) as Record<IconName, IconComponent>;

export interface IconProps extends Omit<React.HTMLAttributes<HTMLElement>, 'color'> {
    /** Built-in cute icon name (101 total, e.g. Heart / Flower). Mutually exclusive with icon / src. */
    name?: IconName;
    /** Any built-in icon component (e.g. import { HeartIcon } from '...'). Mutually exclusive with name / src; takes precedence over name. */
    icon?: IconComponent;
    /** Custom icon resource URL, for colored bitmaps and other non-vector cases. Mutually exclusive with name / icon. */
    src?: string;
    size?: number | string;
    /** Stroke color (svg mode); defaults to currentColor. */
    color?: string;
    /** Stroke width (svg mode); defaults to 3.5. */
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
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-hidden': ariaHiddenProp,
    ...rest
}) => {
    const cls = cn('animal-icon', bounce && 'animal-icon-bounce', className);
    const labeled = Boolean(ariaLabel || ariaLabelledBy);
    const ariaHidden = ariaHiddenProp ?? (labeled ? undefined : true);

    const IconCmp = icon ?? (name ? ICONS[name] : undefined);

    if (IconCmp) {
        const passthrough: Record<string, unknown> = { ...rest };
        // Named icon components default stroke="#2A2A2A" strokeWidth={3.5}; only override when explicitly passed
        if (color !== undefined) passthrough.stroke = color;
        if (strokeWidth !== undefined) passthrough.strokeWidth = strokeWidth;
        return (
            <IconCmp
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
};

Icon.displayName = 'Icon';

export type { IconName, IconComponent } from './src/types';

/** Full built-in icon list for display purposes. */
export const ICON_LIST = (Object.entries(ICONS) as Array<[IconName, IconComponent]>).map(([name]) => ({
    name,
    label: name,
})) as ReadonlyArray<{ name: IconName; label: string }>;
