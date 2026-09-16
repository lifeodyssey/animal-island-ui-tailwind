import React from 'react';
import * as ICONS from './src';
import type { IconName as SvgIconName, IconComponent } from './src/types';
import { cn } from '../../utils/cn';

export type { IconComponent } from './src/types';
export type { IconName as SvgIconName } from './src/types';

/** @deprecated Use SvgIconName instead. Legacy string-key names from the lucide-react era. */
export type LegacyIconName =
    | 'icon-left'
    | 'icon-right'
    | 'location'
    | 'page'
    | 'wifi'
    | 'icon-shopping'
    | 'icon-chat'
    | 'icon-variant'
    | 'icon-encyclopedia'
    | 'icon-design'
    | 'icon-map'
    | 'icon-diy'
    | 'icon-camera'
    | 'icon-travel'
    | 'icon-passport'
    | 'icon-helicopter';

/** Icon name — either a new SVG registry name (e.g. 'Heart') or a legacy name. */
export type IconName = SvgIconName | LegacyIconName;

const LEGACY_MAP: Partial<Record<LegacyIconName, SvgIconName>> = {
    location: 'Location',
    wifi: 'Wifi',
    'icon-shopping': 'Cart',
    'icon-chat': 'Chat',
    'icon-camera': 'Camera',
    'icon-map': 'Map',
};

const SVG_ICONS: Record<SvgIconName, IconComponent> = Object.fromEntries(
    Object.entries(ICONS)
        .filter(([, v]) => typeof v === 'function')
        .map(([cmpName, v]) => [cmpName.replace(/Icon$/, ''), v])
) as Record<SvgIconName, IconComponent>;

export interface IconProps extends Omit<React.HTMLAttributes<HTMLElement>, 'color'> {
    /** Icon name from the built-in 101-icon registry (e.g. 'Heart', 'Fish'). */
    name?: IconName;
    /** Pass any IconComponent directly (e.g. `import { HeartIcon } from 'animal-island-ui-tailwind'`). */
    icon?: IconComponent;
    /** Custom icon URL for bitmap/raster use cases. */
    src?: string;
    size?: number | string;
    /** Stroke colour for SVG icons, defaults to currentColor (or icon's own default). */
    color?: string;
    /** Stroke width for SVG icons. */
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

    // Resolve SVG icon component: explicit `icon` prop > name lookup
    let IconCmp: IconComponent | undefined = icon;
    if (!IconCmp && name) {
        // Try direct registry hit (new-style names like 'Heart')
        const direct = SVG_ICONS[name as SvgIconName];
        if (direct) {
            IconCmp = direct;
        } else {
            // Fallback: legacy name → registry name mapping
            const mapped = LEGACY_MAP[name as LegacyIconName];
            if (mapped) IconCmp = SVG_ICONS[mapped];
        }
    }

    if (IconCmp) {
        const labeled = Boolean(rest['aria-label']);
        const svgProps: Record<string, unknown> = { ...(rest as object) };
        if (color !== undefined) svgProps.stroke = color;
        if (strokeWidth !== undefined) svgProps.strokeWidth = strokeWidth;
        return (
            <IconCmp
                className={cls}
                style={{ width: size, height: size, ...style }}
                aria-hidden={labeled ? undefined : true}
                role={labeled ? 'img' : undefined}
                {...(svgProps as React.SVGProps<SVGSVGElement>)}
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

/** All built-in icon names (101 entries). */
export const ICON_LIST = (Object.keys(SVG_ICONS) as SvgIconName[]).map((name) => ({ name }));
