import React from 'react';
import { ChevronLeft, ChevronRight, FileText, MapPin, ShoppingCart, Wifi, type LucideIcon } from 'lucide-react';
import { getArtworkStyle, type ArtworkName } from './artwork';
import { cn } from '../../utils/cn';

export type IconName =
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

const BUILTIN_ICONS: Partial<Record<IconName, LucideIcon>> = {
    'icon-left': ChevronLeft,
    'icon-right': ChevronRight,
    location: MapPin,
    page: FileText,
    wifi: Wifi,
    'icon-shopping': ShoppingCart,
};

const NAMED_ARTWORK: Partial<Record<IconName, ArtworkName>> = {
    'icon-camera': 'camera',
    'icon-travel': 'travel',
    'icon-encyclopedia': 'encyclopedia',
    'icon-diy': 'diy',
    'icon-design': 'design',
    'icon-map': 'map',
    'icon-variant': 'passport',
    'icon-passport': 'passport',
    'icon-helicopter': 'helicopter',
    'icon-chat': 'chat',
};

export interface IconProps extends Omit<React.HTMLAttributes<HTMLElement>, 'color'> {
    /** Built-in colored artwork or utility vector icon. Mutually exclusive with `icon` / `src`. */
    name?: IconName;
    /** Any lucide-react icon component (e.g. `import { Heart } from 'lucide-react'`). Mutually exclusive with `name` / `src`. */
    icon?: LucideIcon;
    /** Custom icon resource URL, for colored bitmaps and other non-vector cases. Mutually exclusive with `name` / `icon`. */
    src?: string;
    size?: number | string;
    /** Stroke color in lucide mode; defaults to currentColor. */
    color?: string;
    /** Stroke width in lucide mode; defaults to 2. */
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
        // Icons are decorative by default; allow consumers to opt-in to an accessible name.
        const labeled = Boolean(ariaLabel || ariaLabelledBy);
        const ariaHidden = ariaHiddenProp ?? (labeled ? undefined : true);
        const cls = cn('animal-icon', name && `animal-${name}`, bounce && 'animal-icon-bounce', className);

        const artwork = !icon && name ? NAMED_ARTWORK[name] : undefined;
        const LucideCmp = icon ?? (name ? BUILTIN_ICONS[name] : undefined);

        if (LucideCmp) {
            return (
                <LucideCmp
                    ref={ref as React.Ref<SVGSVGElement>}
                    className={cls}
                    color={color}
                    strokeWidth={strokeWidth}
                    style={{ width: size, height: size, ...style }}
                    aria-hidden={ariaHidden}
                    role={labeled ? 'img' : undefined}
                    aria-label={ariaLabel}
                    aria-labelledby={ariaLabelledBy}
                    {...(rest as React.SVGProps<SVGSVGElement>)}
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
                    ...(artwork ? getArtworkStyle(artwork) : src ? { backgroundImage: `url(${src})` } : null),
                    ...style,
                }}
                {...rest}
            />
        );
    }
);

Icon.displayName = 'Icon';

export const ICON_LIST: { name: IconName; label: string }[] = [
    { name: 'icon-left', label: 'Left' },
    { name: 'icon-right', label: 'Right' },
    { name: 'location', label: 'Location' },
    { name: 'page', label: 'Page' },
    { name: 'wifi', label: 'WiFi' },
    { name: 'icon-shopping', label: 'Shopping' },
    { name: 'icon-chat', label: 'Chat' },
    { name: 'icon-variant', label: 'Variant' },
    { name: 'icon-encyclopedia', label: 'Encyclopedia' },
    { name: 'icon-design', label: 'Design' },
    { name: 'icon-map', label: 'Map' },
    { name: 'icon-diy', label: 'DIY' },
    { name: 'icon-camera', label: 'Camera' },
    { name: 'icon-travel', label: 'Travel' },
    { name: 'icon-passport', label: 'Passport' },
    { name: 'icon-helicopter', label: 'Helicopter' },
];
