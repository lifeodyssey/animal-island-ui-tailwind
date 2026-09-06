import React from 'react';
import {
    BookOpen,
    Camera,
    ChevronLeft,
    ChevronRight,
    FileText,
    Hammer,
    Map,
    MapPin,
    MessageCircle,
    Palette,
    Shuffle,
    ShoppingCart,
    Wifi,
    type LucideIcon,
} from 'lucide-react';
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
    | 'icon-camera';

/** Built-in named icons, all rendered as lucide-react vectors (https://lucide.dev/icons/). */
const BUILTIN_ICONS: Record<IconName, LucideIcon> = {
    'icon-left': ChevronLeft,
    'icon-right': ChevronRight,
    location: MapPin,
    page: FileText,
    wifi: Wifi,
    'icon-shopping': ShoppingCart,
    'icon-chat': MessageCircle,
    'icon-variant': Shuffle,
    'icon-encyclopedia': BookOpen,
    'icon-design': Palette,
    'icon-map': Map,
    'icon-diy': Hammer,
    'icon-camera': Camera,
};

export interface IconProps extends Omit<React.HTMLAttributes<HTMLElement>, 'color'> {
    /** Built-in named icon. Mutually exclusive with `icon` / `src`. */
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
];
