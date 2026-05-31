import nunito500 from '@fontsource/nunito/files/nunito-latin-500-normal.woff2?url';
import nunito700 from '@fontsource/nunito/files/nunito-latin-700-normal.woff2?url';
import nunito900 from '@fontsource/nunito/files/nunito-latin-900-normal.woff2?url';

import notoLatin400 from '@fontsource/noto-sans-sc/files/noto-sans-sc-latin-400-normal.woff2?url';
import notoLatin500 from '@fontsource/noto-sans-sc/files/noto-sans-sc-latin-500-normal.woff2?url';
import notoLatin700 from '@fontsource/noto-sans-sc/files/noto-sans-sc-latin-700-normal.woff2?url';
import notoCN400 from '@fontsource/noto-sans-sc/files/noto-sans-sc-chinese-simplified-400-normal.woff2?url';
import notoCN500 from '@fontsource/noto-sans-sc/files/noto-sans-sc-chinese-simplified-500-normal.woff2?url';
import notoCN700 from '@fontsource/noto-sans-sc/files/noto-sans-sc-chinese-simplified-700-normal.woff2?url';

import zenLatin500 from '@fontsource/zen-maru-gothic/files/zen-maru-gothic-latin-500-normal.woff2?url';
import zenLatin700 from '@fontsource/zen-maru-gothic/files/zen-maru-gothic-latin-700-normal.woff2?url';
import zenLatin900 from '@fontsource/zen-maru-gothic/files/zen-maru-gothic-latin-900-normal.woff2?url';
import zenJP500 from '@fontsource/zen-maru-gothic/files/zen-maru-gothic-japanese-500-normal.woff2?url';
import zenJP700 from '@fontsource/zen-maru-gothic/files/zen-maru-gothic-japanese-700-normal.woff2?url';
import zenJP900 from '@fontsource/zen-maru-gothic/files/zen-maru-gothic-japanese-900-normal.woff2?url';

interface FontDef {
    family: string;
    weight: number;
    url: string;
}

const WEDDING_FONTS: FontDef[] = [
    { family: 'Nunito', weight: 500, url: nunito500 },
    { family: 'Nunito', weight: 700, url: nunito700 },
    { family: 'Nunito', weight: 900, url: nunito900 },
    { family: 'Noto Sans SC', weight: 400, url: notoLatin400 },
    { family: 'Noto Sans SC', weight: 500, url: notoLatin500 },
    { family: 'Noto Sans SC', weight: 700, url: notoLatin700 },
    { family: 'Noto Sans SC', weight: 400, url: notoCN400 },
    { family: 'Noto Sans SC', weight: 500, url: notoCN500 },
    { family: 'Noto Sans SC', weight: 700, url: notoCN700 },
    { family: 'Zen Maru Gothic', weight: 500, url: zenLatin500 },
    { family: 'Zen Maru Gothic', weight: 700, url: zenLatin700 },
    { family: 'Zen Maru Gothic', weight: 900, url: zenLatin900 },
    { family: 'Zen Maru Gothic', weight: 500, url: zenJP500 },
    { family: 'Zen Maru Gothic', weight: 700, url: zenJP700 },
    { family: 'Zen Maru Gothic', weight: 900, url: zenJP900 },
];

const buildFontFaceCss = (urlResolver: (url: string) => string): string =>
    WEDDING_FONTS.map(
        ({ family, weight, url }) =>
            `@font-face{font-family:'${family}';font-style:normal;font-weight:${weight};font-display:swap;src:url('${urlResolver(url)}') format('woff2');}`,
    ).join('\n');

let injected = false;
export const injectWeddingFonts = (): void => {
    if (injected || typeof document === 'undefined') {
        return;
    }

    injected = true;
    const style = document.createElement('style');
    style.setAttribute('data-wedding-fonts', '');
    style.textContent = buildFontFaceCss((url) => url);
    document.head.appendChild(style);
};

let exportPrepPromise: Promise<string> | null = null;
export const prepareWeddingFontsForExport = (): Promise<string> => {
    if (exportPrepPromise) {
        return exportPrepPromise;
    }
    if (typeof document === 'undefined') {
        exportPrepPromise = Promise.resolve('');
        return exportPrepPromise;
    }

    exportPrepPromise = (async () => {
        const dataUrlMap = new Map<string, string>();

        await Promise.all(
            WEDDING_FONTS.map(async ({ family, weight, url }) => {
                try {
                    const response = await fetch(url, { mode: 'cors', credentials: 'omit' });
                    if (!response.ok) {
                        return;
                    }
                    const buffer = await response.arrayBuffer();

                    if (typeof FontFace !== 'undefined' && document.fonts) {
                        try {
                            const font = new FontFace(family, buffer, {
                                weight: String(weight),
                                style: 'normal',
                                display: 'swap',
                            });
                            await font.load();
                            document.fonts.add(font);
                        } catch {
                            // Ignore font registration failures and keep data URL fallback.
                        }
                    }

                    const blob = new Blob([buffer], { type: 'font/woff2' });
                    const dataUrl = await new Promise<string>((resolve) => {
                        const reader = new FileReader();
                        reader.onload = () => resolve(reader.result as string);
                        // Fall back to the original URL if reading the blob fails so the
                        // export pipeline never hangs on a stuck FileReader.
                        reader.onerror = () => resolve(url);
                        reader.readAsDataURL(blob);
                    });
                    dataUrlMap.set(url, dataUrl);
                } catch (error) {
                    console.warn('[WeddingInvitation] font fetch failed:', url, error);
                }
            }),
        );

        try {
            await document.fonts?.ready;
        } catch {
            // Ignore font readiness failures.
        }

        return buildFontFaceCss((url) => dataUrlMap.get(url) ?? url);
    })();

    return exportPrepPromise;
};
