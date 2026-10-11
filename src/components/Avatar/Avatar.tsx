import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { cn } from '../../utils/cn';

export type AvatarShape = 'circle' | 'square';
export type AvatarSize = 'small' | 'middle' | 'large';

const PRESET_SIZE: Record<AvatarSize, number> = { small: 32, middle: 40, large: 48 };
const PRESET_FONT: Record<AvatarSize, number> = { small: 14, middle: 16, large: 20 };

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
        if (canRetry !== false) setIsImgLoaded(false);
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
        shape === 'square' && 'animal-avatar-square',
        !hasImage && 'animal-avatar-placeholder',
        className
    );

    const sizeStyle: React.CSSProperties = {
        width: px,
        height: px,
        lineHeight: `${px}px`,
        fontSize: scale > 1 ? undefined : fontPx,
        ...style,
    };

    let content: React.ReactNode;
    if (hasImage) {
        content = <img className="animal-avatar-img" src={src} alt={alt ?? ''} onError={handleImgError} />;
    } else if (icon || isIconChild || !hasTextContent) {
        const defaultIcon = (
            <svg viewBox="0 0 24 24" width={Math.round(px * 0.5)} height={Math.round(px * 0.5)} aria-hidden="true" fill="currentColor">
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
            </svg>
        );
        const iconNode = icon ?? (isIconChild ? firstChild : null) ?? defaultIcon;
        content = <span className="animal-avatar-string">{iconNode}</span>;
    } else {
        content = (
            <span
                className="animal-avatar-string"
                ref={textRef}
                style={scale > 1 ? { fontSize: fontPx * scale } : undefined}
            >
                {children}
            </span>
        );
    }

    return (
        <span
            className={cls}
            style={sizeStyle}
            role={!hasImage && !hasTextContent ? 'img' : undefined}
            aria-label={!hasImage && !hasTextContent ? 'avatar' : undefined}
            {...rest}
        >
            {content}
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
                    className="animal-avatar animal-avatar-placeholder animal-avatar-group-more"
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
