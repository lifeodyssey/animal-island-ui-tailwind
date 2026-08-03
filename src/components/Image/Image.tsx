import React, { useCallback, useEffect, useRef, useState, useId } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../utils/cn';
import { Icon } from '../Icon';

export type ImageColor =
    | 'white'
    | 'default'
    | 'app-pink'
    | 'purple'
    | 'app-blue'
    | 'app-yellow'
    | 'app-orange'
    | 'app-teal'
    | 'app-green'
    | 'app-red'
    | 'lime-green'
    | 'yellow-green'
    | 'brown'
    | 'warm-peach-pink';

export interface ImageProps extends Omit<
    React.ImgHTMLAttributes<HTMLImageElement>,
    'src' | 'alt' | 'width' | 'height' | 'onLoad' | 'onError'
> {
    src: string;
    alt?: string;
    width?: number | string;
    height?: number | string;
    color?: ImageColor;
    lazy?: boolean;
    preview?: boolean;
    onLoad?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
    onError?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
}

export const Image: React.FC<ImageProps> = ({
    src,
    alt = '',
    width,
    height,
    color = 'white',
    lazy = false,
    preview = true,
    className,
    style,
    onLoad,
    onError,
    ...rest
}) => {
    const [failed, setFailed] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [previewOpen, setPreviewOpen] = useState(false);
    const closeBtnRef = useRef<HTMLButtonElement | null>(null);
    const lastFocusedRef = useRef<HTMLElement | null>(null);
    const dialogLabelId = useId();

    useEffect(() => {
        setFailed(false);
        setLoaded(false);
    }, [src]);

    const handleLoad = useCallback(
        (e: React.SyntheticEvent<HTMLImageElement>) => {
            setLoaded(true);
            onLoad?.(e);
        },
        [onLoad]
    );

    const handleError = useCallback(
        (e: React.SyntheticEvent<HTMLImageElement>) => {
            setFailed(true);
            setLoaded(true);
            onError?.(e);
        },
        [onError]
    );

    useEffect(() => {
        if (!previewOpen) return;
        closeBtnRef.current?.focus();
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setPreviewOpen(false);
            } else if (e.key === 'Tab') {
                e.preventDefault();
                closeBtnRef.current?.focus();
            }
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [previewOpen]);

    useEffect(() => {
        if (!previewOpen) {
            lastFocusedRef.current?.focus();
            lastFocusedRef.current = null;
        }
    }, [previewOpen]);

    const openPreview = () => {
        lastFocusedRef.current = document.activeElement as HTMLElement | null;
        setPreviewOpen(true);
    };

    if (failed) {
        return (
            <span
                className={cn(
                    'animal-image',
                    color !== 'white' && `animal-image-${color}`,
                    'animal-image-error',
                    className
                )}
                style={{ width, height, ...style }}
                role="img"
                aria-label={alt || '图片加载失败'}
            >
                <Icon name="icon-camera" size={32} />
                <span>图片加载失败</span>
            </span>
        );
    }

    const frameCls = cn(
        'animal-image',
        color !== 'white' && `animal-image-${color}`,
        loaded && 'animal-image-loaded',
        preview && 'animal-image-preview',
        className
    );
    const frameStyle: React.CSSProperties = { width, height, ...style };

    const content = (
        <img
            src={src}
            alt={alt}
            loading={lazy ? 'lazy' : undefined}
            className="animal-image-img"
            onLoad={handleLoad}
            onError={handleError}
            {...rest}
        />
    );

    if (preview) {
        return (
            <>
                <button type="button" className={frameCls} style={frameStyle} onClick={openPreview}>
                    {content}
                </button>
                {typeof document !== 'undefined' && createPortal(
                    previewOpen ? (
                        <div className="animal-image-mask" onClick={() => setPreviewOpen(false)}>
                            <div
                                className="animal-image-dialog"
                                role="dialog"
                                aria-modal="true"
                                aria-labelledby={dialogLabelId}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <span id={dialogLabelId} className="animal-image-dialog-label">
                                    {alt ? `查看图片：${alt}` : '图片预览'}
                                </span>
                                <button
                                    type="button"
                                    ref={closeBtnRef}
                                    className="animal-image-close-btn"
                                    aria-label="关闭预览"
                                    onClick={() => setPreviewOpen(false)}
                                >
                                    <span className="animal-image-close-mark" />
                                </button>
                                <img src={src} alt={alt} className="animal-image-preview-img" />
                            </div>
                        </div>
                    ) : null,
                    document.body
                )}
            </>
        );
    }

    return (
        <span className={frameCls} style={frameStyle}>
            {content}
        </span>
    );
};

Image.displayName = 'Image';
