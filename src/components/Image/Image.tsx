import React, { useCallback, useEffect, useRef, useState, useId } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../utils/cn';

const BrokenImageIcon: React.FC<{ size?: number }> = ({ size = 32 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
        <circle cx="12" cy="13" r="4" />
    </svg>
);

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
    /** 背景颜色（仅 variant='bordered' 时生效） */
    color?: ImageColor;
    /** 相框类型：'default' 大阴影+大圆角（默认），'bordered' 边框柔和阴影+小圆角，'stamp' 邮票齿孔边框 */
    variant?: 'default' | 'bordered' | 'stamp';
    /** 邮票变体下的发行年份，印在右上角；留空不显示 */
    stampYear?: string;
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
    variant = 'default',
    stampYear,
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
                    variant === 'default' && 'animal-image-variant-default',
                    variant === 'stamp' && 'animal-image-variant-stamp',
                    variant === 'bordered' && color !== 'white' && `animal-image-${color}`,
                    'animal-image-error',
                    className
                )}
                style={{ width, height, ...style }}
                role="img"
                aria-label={alt || '图片加载失败'}
            >
                <BrokenImageIcon size={32} />
                <span>图片加载失败</span>
            </span>
        );
    }

    const frameCls = cn(
        'animal-image',
        variant === 'default' && 'animal-image-variant-default',
        variant === 'stamp' && 'animal-image-variant-stamp',
        variant === 'bordered' && color !== 'white' && `animal-image-${color}`,
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

    const stampExtra = variant === 'stamp' && stampYear && (
        <span className="animal-image-stamp-year">{stampYear}</span>
    );

    if (preview) {
        return (
            <>
                <button type="button" className={frameCls} style={frameStyle} onClick={openPreview}>
                    {content}
                    {stampExtra}
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
            {stampExtra}
        </span>
    );
};

Image.displayName = 'Image';
