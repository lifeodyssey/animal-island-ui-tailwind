import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { cn } from '../../utils/cn';
import { User as UserIcon } from 'lucide-react';

export type AvatarShape = 'circle' | 'square';

export type AvatarSize = 'small' | 'middle' | 'large';

const PRESET_SIZE: Record<AvatarSize, number> = {
    small: 32,
    middle: 40,
    large: 48,
};

const PRESET_FONT: Record<AvatarSize, number> = {
    small: 14,
    middle: 16,
    large: 20,
};

export interface AvatarProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'onError'> {
    shape?: AvatarShape;
    size?: number | AvatarSize;
    src?: string;
    alt?: string;
    icon?: React.ReactNode;
    gap?: number;
    onError?: () => boolean;
    children?: React.ReactNode;
}

export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
    maxCount?: number;
    maxStyle?: React.CSSProperties;
    size?: number | AvatarSize;
    shape?: AvatarShape;
    gap?: number;
    children?: React.ReactNode;
}

export const Avatar: React.FC<AvatarProps> & { Group: React.FC<AvatarGroupProps> } = ({
    shape = 'circle',
    size = 'middle',
    src,
    alt,
    icon,
    gap = 4,
    onError,
    children,
    className,
    style,
    ...rest
}) => {
    const [isImgLoaded, setIsImgLoaded] = useState(!!src && typeof src !== 'string');
    const [scale, setScale] = useState(1);
    const textRef = useRef<HTMLSpanElement | null>(null);

    useEffect(() => {
        setIsImgLoaded(!!src);
    }, [src]);

    const handleImgError = useCallback(() => {
        const canRetry = onError?.();
        if (canRetry !== false) {
            setIsImgLoaded(false);
        }
    }, [onError]);

    const px = typeof size === 'number' ? size : PRESET_SIZE[size];
    const fontPx = typeof size === 'number' ? Math.max(12, Math.round(px * 0.4)) : PRESET_FONT[size];

    useLayoutEffect(() => {
        const el = textRef.current;
        if (!el) return;
        const textWidth = el.offsetWidth;
        const available = px - gap * 2;
        setScale(textWidth > available && available > 0 ? available / textWidth : 1);
    }, [children, icon, gap, px]);

    const hasImage = !!src && isImgLoaded;
    const firstChild = React.Children.toArray(children)[0];
    const isIconChild = React.isValidElement(firstChild) && typeof firstChild.type === 'function';
    const hasTextContent = React.Children.count(children) > 0 && !isIconChild;

    const cls = cn(
        'animal-avatar',
        shape === 'square' && 'animal-avatar-shape-square',
        !hasImage && 'animal-avatar-placeholder',
        className
    );

    const sizeStyle: React.CSSProperties = {
        width: px,
        height: px,
        fontSize: fontPx,
    };

    if (hasImage) {
        return (
            <span role="img" aria-label={alt ?? 'avatar'} className={cls} style={{ ...sizeStyle, ...style }} {...rest}>
                <img
                    className="animal-avatar-img"
                    src={src}
                    alt=""
                    aria-hidden="true"
                    onError={handleImgError}
                />
            </span>
        );
    }

    const placeholderIcon = icon ?? <UserIcon aria-hidden="true" />;

    if (hasTextContent) {
        return (
            <span role="img" aria-label="avatar" className={cls} style={{ ...sizeStyle, ...style }} {...rest}>
                <span
                    ref={textRef}
                    className="animal-avatar-string"
                    style={scale !== 1 ? { fontSize: fontPx * scale, transform: `scale(${scale})` } : undefined}
                >
                    {children}
                </span>
            </span>
        );
    }

    if (isIconChild) {
        return (
            <span role="img" aria-label="avatar" className={cls} style={{ ...sizeStyle, ...style }} {...rest}>
                <span className="animal-avatar-icon-wrap">
                    {children}
                </span>
            </span>
        );
    }

    return (
        <span role="img" aria-label="avatar" className={cls} style={{ ...sizeStyle, ...style }} {...rest}>
            {placeholderIcon}
        </span>
    );
};

Avatar.displayName = 'Avatar';

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
    maxCount,
    maxStyle,
    size,
    shape,
    gap = 8,
    className,
    children,
    style,
    ...rest
}) => {
    const kids = React.Children.toArray(children) as React.ReactElement[];

    let shown = kids;
    let restCount = 0;
    if (maxCount && maxCount > 0 && kids.length > maxCount) {
        shown = kids.slice(0, maxCount);
        restCount = kids.length - maxCount;
    }

    const decorated = shown.map((kid) => {
        if (!React.isValidElement(kid)) return kid;
        const props = kid.props as Partial<AvatarProps>;
        const cloneProps: Partial<AvatarProps> = {};
        if (size !== undefined && props.size === undefined) cloneProps.size = size;
        if (shape !== undefined && props.shape === undefined) cloneProps.shape = shape;
        return Object.keys(cloneProps).length ? React.cloneElement(kid, cloneProps) : kid;
    });

    return (
        <div
            className={cn('animal-avatar-group', className)}
            style={{ '--avatar-group-gap': `${gap}px`, ...style } as React.CSSProperties}
            {...rest}
        >
            {decorated}
            {restCount > 0 && (
                <span
                    className={cn('animal-avatar', 'animal-avatar-placeholder', 'animal-avatar-group-more')}
                    style={maxStyle}
                >
                    +{restCount}
                </span>
            )}
        </div>
    );
};

AvatarGroup.displayName = 'AvatarGroup';

Avatar.Group = AvatarGroup;
