import React from 'react';
import { cn } from '../../utils/cn';

export type IconName =
    | 'icon-miles'
    | 'icon-camera'
    | 'icon-chat'
    | 'icon-critterpedia'
    | 'icon-design'
    | 'icon-diy'
    | 'icon-helicopter'
    | 'icon-map'
    | 'icon-shopping'
    | 'icon-variant';

// Item glyphs (Animal Crossing "Items" sheet) bundled from the upstream asset set.
// Eager URL glob: each PNG is emitted as a standalone file (not inlined) by the
// lib assets plugin, keyed by its numeric id (numbering has gaps, e.g. 487 → 490).
const itemModules = import.meta.glob<string>('../../assets/img/icons/items/item-*.png', {
    eager: true,
    query: '?url',
    import: 'default',
});

const ITEM_URL_MAP: Record<number, string> = {};
for (const path in itemModules) {
    const match = /item-(\d+)\.png$/.exec(path);
    if (match) ITEM_URL_MAP[Number(match[1])] = itemModules[path];
}

/** Available item ids, sorted ascending. */
export const ITEM_LIST: number[] = Object.keys(ITEM_URL_MAP)
    .map(Number)
    .sort((a, b) => a - b);

/** Count of bundled item glyphs. */
export const ITEM_COUNT = ITEM_LIST.length;

export interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
    /** Built-in named icon. Mutually exclusive with `item`. */
    name?: IconName;
    /** Item glyph id from the "Items" sheet (see ITEM_LIST). Mutually exclusive with `name`. */
    item?: number;
    size?: number | string;
    bounce?: boolean;
}

export const Icon = React.forwardRef<HTMLSpanElement, IconProps>(
    (
        {
            name,
            item,
            size = 24,
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
        // Icons are decorative by default; allow consumers to opt-in to an accessible name.
        const ariaHidden = ariaHiddenProp ?? (ariaLabel || ariaLabelledBy ? undefined : true);
        const itemUrl = typeof item === 'number' ? ITEM_URL_MAP[item] : undefined;

        return (
            <span
                ref={ref}
                className={cn(
                    'animal-icon',
                    name && `animal-${name}`,
                    bounce && 'animal-icon-bounce',
                    className
                )}
                aria-hidden={ariaHidden}
                style={{
                    width: size,
                    height: size,
                    ...(itemUrl ? { backgroundImage: `url(${itemUrl})` } : null),
                    ...style,
                }}
                {...rest}
            />
        );
    }
);

Icon.displayName = 'Icon';

export const ICON_LIST: { name: IconName; label: string }[] = [
    { name: 'icon-miles', label: 'NookMiles' },
    { name: 'icon-camera', label: 'Camera' },
    { name: 'icon-chat', label: 'Chat' },
    { name: 'icon-critterpedia', label: 'Critterpedia' },
    { name: 'icon-design', label: 'Design' },
    { name: 'icon-diy', label: 'DIY' },
    { name: 'icon-helicopter', label: 'Helicopter' },
    { name: 'icon-map', label: 'Map' },
    { name: 'icon-shopping', label: 'Shopping' },
    { name: 'icon-variant', label: 'Variant' },
];
