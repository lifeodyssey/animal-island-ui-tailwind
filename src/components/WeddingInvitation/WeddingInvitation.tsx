import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import iconMap from '../../assets/img/icons/icon-map.svg';
import { cn } from '../../utils/cn';
import brideAndGroomImg from './img/brideandgroom.png';
import weddingTitleImg from './img/wedding.png';
import { injectWeddingFonts, prepareWeddingFontsForExport } from './fonts';

export interface WeddingInvitationProps {
    groomName?: string;
    brideName?: string;
    date?: string;
    weekday?: string;
    time?: string;
    venue?: string;
    address?: string;
    title?: React.ReactNode;
    subtitle?: React.ReactNode;
    message?: React.ReactNode;
    showLotteryNumber?: boolean;
    lotteryNumber?: string;
    lotteryLabel?: React.ReactNode;
    lotteryHint?: React.ReactNode;
    /** 自定义新郎新娘合照图片，不传则使用内置默认图 */
    brideAndGroomImage?: string;
    className?: string;
    style?: React.CSSProperties;
}

export interface WeddingInvitationRef {
    exportAsImage: (filename?: string) => Promise<void>;
    getElement: () => HTMLDivElement | null;
}

const Leaf: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 64 64" width="56" height="56" aria-hidden>
        <path
            d="M8 56 C 8 24, 32 4, 60 6 C 58 36, 38 58, 8 56 Z"
            fill="#8ac68a"
            stroke="#3d5a1a"
            strokeWidth="2.5"
            strokeLinejoin="round"
        />
        <path d="M14 50 C 26 40, 40 26, 56 12" stroke="#3d5a1a" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M22 42 C 28 38, 32 34, 36 30" stroke="#3d5a1a" strokeWidth="1.4" fill="none" strokeLinecap="round" />
        <path d="M30 48 C 34 44, 38 40, 42 36" stroke="#3d5a1a" strokeWidth="1.4" fill="none" strokeLinecap="round" />
    </svg>
);

const Flower: React.FC<{ color?: string; center?: string; size?: number }> = ({
    color = '#f8a6b2',
    center = '#f7cd67',
    size = 28,
}) => (
    <svg viewBox="0 0 32 32" width={size} height={size} aria-hidden>
        {[0, 72, 144, 216, 288].map((angle) => (
            <ellipse
                key={angle}
                cx="16"
                cy="8"
                rx="5"
                ry="7"
                fill={color}
                stroke="#725d42"
                strokeWidth="1.2"
                transform={`rotate(${angle} 16 16)`}
            />
        ))}
        <circle cx="16" cy="16" r="3.5" fill={center} stroke="#725d42" strokeWidth="1.2" />
    </svg>
);

const Heart: React.FC<{ size?: number }> = ({ size = 64 }) => (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden>
        <path
            d="M32 56 C 8 40, 4 22, 16 14 C 24 9, 30 14, 32 20 C 34 14, 40 9, 48 14 C 60 22, 56 40, 32 56 Z"
            fill="#fc736d"
            stroke="#725d42"
            strokeWidth="2.5"
            strokeLinejoin="round"
        />
        <ellipse cx="22" cy="22" rx="3.5" ry="5" fill="#fff" opacity="0.7" transform="rotate(-25 22 22)" />
    </svg>
);

const Star: React.FC<{ size?: number; color?: string }> = ({ size = 18, color = '#f7cd67' }) => (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden>
        <path
            d="M12 2 L14.5 9 L22 9.5 L16 14.5 L18 22 L12 17.5 L6 22 L8 14.5 L2 9.5 L9.5 9 Z"
            fill={color}
            stroke="#725d42"
            strokeWidth="1.4"
            strokeLinejoin="round"
        />
    </svg>
);

const ScissorsIcon: React.FC = () => (
    <svg viewBox="0 0 24 24" width="11" height="11" aria-hidden>
        <g fill="none" stroke="#725d42" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="6" cy="6" r="2.4" />
            <circle cx="6" cy="18" r="2.4" />
            <path d="M8 7.5 L21 17 M8 16.5 L21 7" />
        </g>
    </svg>
);

const DownloadIcon: React.FC = () => (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden>
        <path
            d="M12 3v12m0 0l-5-5m5 5l5-5M4 17v3a1 1 0 001 1h14a1 1 0 001-1v-3"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
        />
    </svg>
);

const NOTCH_RADIUS = 14;
const LOTTERY_HEIGHT = 160;

const renderNodeToCanvas = async (node: HTMLElement, scale: number, fontCssText: string): Promise<HTMLCanvasElement> => {
    const rect = node.getBoundingClientRect();
    const width = Math.max(1, Math.ceil(rect.width));
    const height = Math.max(1, Math.ceil(rect.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.ceil(width * scale);
    canvas.height = Math.ceil(height * scale);

    const clonedNode = node.cloneNode(true) as HTMLElement;
    const fontStyleEl = document.createElement('style');
    fontStyleEl.textContent = fontCssText;
    clonedNode.insertBefore(fontStyleEl, clonedNode.firstChild);

    const serialized = new XMLSerializer().serializeToString(clonedNode);
    const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  <foreignObject width="100%" height="100%">${serialized}</foreignObject>
</svg>`;
    const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    try {
        const image = await new Promise<HTMLImageElement>((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error('failed to render invitation SVG snapshot'));
            img.src = url;
        });
        const context = canvas.getContext('2d');
        if (!context) {
            throw new Error('failed to get canvas context');
        }
        context.setTransform(scale, 0, 0, scale, 0, 0);
        context.drawImage(image, 0, 0, width, height);
        return canvas;
    } finally {
        URL.revokeObjectURL(url);
    }
};

const exportNodeAsPng = async (node: HTMLElement, filename: string, scale = 2): Promise<void> => {
    const fontCssText = await prepareWeddingFontsForExport();

    const previousMask = node.style.maskImage;
    const previousWebkitMask = node.style.webkitMaskImage;
    node.style.maskImage = 'none';
    node.style.webkitMaskImage = 'none';

    const fontStyleEl = document.createElement('style');
    fontStyleEl.setAttribute('data-wedding-export-fonts', '');
    fontStyleEl.textContent = fontCssText;
    node.insertBefore(fontStyleEl, node.firstChild);

    try {
        const canvas = await renderNodeToCanvas(node, scale, fontCssText);

        const context = canvas.getContext('2d');
        if (context) {
            const radius = NOTCH_RADIUS * scale;
            const y = canvas.height - LOTTERY_HEIGHT * scale;
            context.save();
            context.globalCompositeOperation = 'destination-out';
            for (const x of [0, canvas.width]) {
                context.beginPath();
                context.arc(x, y, radius, 0, Math.PI * 2);
                context.fill();
            }
            context.restore();
        }

        const dataUrl = canvas.toDataURL('image/png');
        if (!dataUrl || dataUrl === 'data:,') {
            throw new Error('exported image data is empty');
        }

        const anchor = document.createElement('a');
        anchor.href = dataUrl;
        anchor.download = filename.endsWith('.png') ? filename : `${filename}.png`;
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
    } finally {
        fontStyleEl.remove();
        node.style.maskImage = previousMask;
        node.style.webkitMaskImage = previousWebkitMask;
    }
};

export const WeddingInvitation = forwardRef<WeddingInvitationRef, WeddingInvitationProps>(
    (
        {
            groomName = '小狸',
            brideName = '小兔',
            date = '2026.06.15',
            weekday = '星期六',
            time = '10:00 AM',
            venue = '彩虹岛 · 樱花广场',
            address = '动物之森 · 无人岛 · K.K. 演奏台前',
            title = 'Wedding Invitation',
            subtitle = <img src={weddingTitleImg} alt="集合啦 婚礼森友会" />,
            message = '哎呀，恭喜恭喜！我们要在小岛上举办婚礼啦~ 诚挚邀请您一同前来见证这个被花瓣和音符包围的日子！',
            showLotteryNumber = true,
            lotteryNumber = '0001',
            lotteryLabel = 'LUCKY NUMBER',
            lotteryHint = '凭此号码参与现场抽奖 · Keep this stub for the lucky draw',
            brideAndGroomImage,
            className,
            style,
        },
        ref,
    ) => {
        const rootRef = useRef<HTMLDivElement>(null);

        // Inject the wedding @font-face rules on mount (idempotent + SSR-safe)
        // instead of at module import time, so importing this component has no
        // side effects (better tree-shaking / SSR). The export path has its own
        // independent font handling via prepareWeddingFontsForExport().
        React.useEffect(() => {
            injectWeddingFonts();
        }, []);

        const exportAsImage = React.useCallback(async (filename = 'wedding-invitation') => {
            if (!rootRef.current) {
                return;
            }
            await exportNodeAsPng(rootRef.current, filename);
        }, []);

        useImperativeHandle(
            ref,
            () => ({
                exportAsImage,
                getElement: () => rootRef.current,
            }),
            [exportAsImage],
        );

        return (
            <div
                ref={rootRef}
                className={cn('animal-wedding-invitation', !showLotteryNumber && 'animal-wedding-no-lottery', className)}
                style={style}
            >
                <Leaf className="animal-wedding-corner-leaf animal-wedding-corner-tl" />
                <Leaf className="animal-wedding-corner-leaf animal-wedding-corner-tr" />
                <Leaf className="animal-wedding-corner-leaf animal-wedding-corner-bl" />
                <Leaf className="animal-wedding-corner-leaf animal-wedding-corner-br" />

                <span className="animal-wedding-float-item animal-wedding-float-f1"><Flower color="#f8a6b2" /></span>
                <span className="animal-wedding-float-item animal-wedding-float-f2"><Flower color="#ecdf52" center="#e59266" size={22} /></span>
                <span className="animal-wedding-float-item animal-wedding-float-f3"><Flower color="#b77dee" size={20} /></span>
                <span className="animal-wedding-float-item animal-wedding-float-s1"><Star color="#f7cd67" /></span>
                <span className="animal-wedding-float-item animal-wedding-float-s2"><Star color="#82d5bb" size={14} /></span>

                <div className="animal-wedding-banner">
                    <span className="animal-wedding-banner-line" />
                    <Star size={16} color="#f7cd67" />
                    <span className="animal-wedding-banner-line" />
                </div>

                <div className="animal-wedding-title-en">{title}</div>
                <div className="animal-wedding-title-zh">{subtitle}</div>

                <div className="animal-wedding-couple-image">
                    <img src={brideAndGroomImage ?? brideAndGroomImg} alt="bride and groom" />
                </div>

                <div className="animal-wedding-couple-row">
                    <div className="animal-wedding-mascot">
                        <div className="animal-wedding-name">{brideName}</div>
                    </div>
                    <div className="animal-wedding-heart-col">
                        <Heart size={30} />
                    </div>
                    <div className="animal-wedding-mascot">
                        <div className="animal-wedding-name">{groomName}</div>
                    </div>
                </div>

                <div className="animal-wedding-date-card">
                    <div className="animal-wedding-date-label">婚礼时间</div>
                    <div className="animal-wedding-date-value">{date}</div>
                    <div className="animal-wedding-date-meta">
                        <span>{weekday}</span>
                        <span className="animal-wedding-dot">·</span>
                        <span>{time}</span>
                    </div>
                </div>

                <div className="animal-wedding-venue-card">
                    <span className="animal-wedding-venue-icon">
                        <img src={iconMap} alt="venue" width={26} height={26} />
                    </span>
                    <div className="animal-wedding-venue-text">
                        <div className="animal-wedding-venue-name">{venue}</div>
                        <div className="animal-wedding-venue-addr">{address}</div>
                    </div>
                </div>

                <div className="animal-wedding-message">{message}</div>

                {showLotteryNumber && (
                    <div className="animal-wedding-signature-lottery">
                        <span>抽奖码</span>
                        <span className="animal-wedding-signature-lottery-no">
                            <span className="animal-wedding-lottery-hash">NO.</span>
                            {lotteryNumber}
                        </span>
                    </div>
                )}

                {showLotteryNumber && (
                    <div className="animal-wedding-lottery">
                        <span className="animal-wedding-tear-hint">
                            <ScissorsIcon />
                            <span>沿虚线剪开</span>
                            <ScissorsIcon />
                        </span>
                        <div className="animal-wedding-lottery-title">婚礼抽奖券</div>
                        <div className="animal-wedding-lottery-label">
                            <Star size={12} color="#f7cd67" />
                            <span>{lotteryLabel}</span>
                            <Star size={12} color="#f7cd67" />
                        </div>
                        <div className="animal-wedding-lottery-number">
                            <span className="animal-wedding-lottery-hash">NO.</span>
                            {lotteryNumber}
                        </div>
                        {lotteryHint && <div className="animal-wedding-lottery-hint">{lotteryHint}</div>}
                    </div>
                )}
            </div>
        );
    },
);

WeddingInvitation.displayName = 'WeddingInvitation';

export interface WeddingInvitationExportButtonProps {
    targetRef: React.RefObject<WeddingInvitationRef | null>;
    filename?: string;
    children?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}

export const WeddingInvitationExportButton: React.FC<WeddingInvitationExportButtonProps> = ({
    targetRef,
    filename = 'wedding-invitation',
    children = '保存为图片',
    className,
    style,
}) => {
    const [exporting, setExporting] = React.useState(false);

    const handleClick = async () => {
        if (exporting) {
            return;
        }

        setExporting(true);
        try {
            await targetRef.current?.exportAsImage(filename);
        } catch (error) {
            console.error(
                `[WeddingInvitation] export failed: ${error instanceof Error ? error.message : String(error)}`,
                error,
            );
        } finally {
            setExporting(false);
        }
    };

    return (
        <button
            type="button"
            className={cn('animal-wedding-export-btn', className)}
            style={style}
            onClick={handleClick}
            disabled={exporting}
        >
            <DownloadIcon />
            {exporting ? '生成中…' : children}
        </button>
    );
};

WeddingInvitationExportButton.displayName = 'WeddingInvitationExportButton';
