import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import libAssetsPlugin from '@laynezh/vite-plugin-lib-assets';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Split the aggregated index.css into three files:
 *   - index.css  — full stylesheet (tokens + fonts)  — kept as-is
 *   - core.css   — everything except @font-face blocks (tokens only)
 *   - fonts.css  — only @font-face blocks
 *
 * Consumers who want to supply their own fonts can import
 * `animal-island-ui-tailwind/style/core` instead of the default
 * `animal-island-ui-tailwind/style`.
 */
function splitFontCssPlugin(): Plugin {
    return {
        name: 'split-font-css',
        enforce: 'post',
        generateBundle(_, bundle) {
            // Find the emitted index.css asset
            const cssKey = Object.keys(bundle).find(
                (k) => bundle[k].type === 'asset' && k === 'index.css',
            );
            if (!cssKey) return;

            const asset = bundle[cssKey];
            if (asset.type !== 'asset') return;

            const fullCss =
                typeof asset.source === 'string'
                    ? asset.source
                    : new TextDecoder().decode(asset.source);

            // Extract @font-face blocks (including preceding comments).
            // Pattern: optional comment + @font-face { ... }
            const fontFaceRegex =
                /(?:\/\*[^]*?\*\/\s*)?@font-face\s*\{[^}]*\}/g;
            const fontBlocks: string[] = [];
            const coreCss = fullCss.replace(fontFaceRegex, (match) => {
                fontBlocks.push(match);
                return '';
            });

            // Emit core.css (no font-faces, trimmed of excess blank lines)
            this.emitFile({
                type: 'asset',
                fileName: 'core.css',
                source: coreCss.replace(/\n{3,}/g, '\n\n').trim() + '\n',
            });

            // Emit fonts.css (font-face blocks only)
            if (fontBlocks.length > 0) {
                this.emitFile({
                    type: 'asset',
                    fileName: 'fonts.css',
                    source: fontBlocks.join('\n') + '\n',
                });
            }
        },
    };
}

/**
 * 去掉 fontsource CSS 里的 woff 备份，只保留 woff2。
 * 现代浏览器（Chrome 36+/Firefox 39+/Safari 10+/Edge 14+）100% 支持 woff2。
 * 产物 dist/files/ 体积可进一步降低 ~40%。
 */
function stripWoffFallbackPlugin(): Plugin {
    return {
        name: 'strip-woff-fallback',
        enforce: 'pre',
        transform(code, id) {
            if (!id.includes('@fontsource')) return null;
            if (!id.endsWith('.css') && !/\.css\?/.test(id)) return null;
            const transformed = code.replace(
                /,\s*url\([^)]+\.woff\)\s*format\(['"]woff['"]\)/g,
                '',
            );
            return transformed === code ? null : { code: transformed, map: null };
        },
        // libAssetsPlugin 会独立扫描源 CSS 并 emit 所有 url() 引用的文件（包括被我们剥掉的 woff），
        // 在 bundle 阶段删除未被最终 CSS 引用的 woff 孤儿文件。
        generateBundle(_, bundle) {
            for (const key of Object.keys(bundle)) {
                const asset = bundle[key];
                if (asset.type === 'asset' && /\.woff$/i.test(key)) {
                    delete bundle[key];
                }
            }
        },
    };
}

export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        stripWoffFallbackPlugin(),
        splitFontCssPlugin(),
        // lib 模式下 Vite 会强制内联所有资源，本插件绕过该限制，把字体/图片等作为独立文件输出
        libAssetsPlugin({
            outputPath: 'files',
            name: '[name].[contenthash:8].[ext]',
            limit: 0,
        }),
    ],
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'),
        },
    },
    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
        },
        rollupOptions: {
            external: [
                'react',
                'react-dom',
                'react/jsx-runtime',
                /^@radix-ui\//,
                'gsap',
                'gsap/MotionPathPlugin',
            ],
            output: [
                {
                    format: 'es',
                    dir: 'dist',
                    entryFileNames: 'es/[name].js',
                    chunkFileNames: 'es/[name].js',
                    preserveModules: true,
                    preserveModulesRoot: 'src',
                    assetFileNames: (assetInfo) => {
                        if (assetInfo.name?.endsWith('.css'))
                            return 'index.css';
                        return assetInfo.name ?? '[asset]';
                    },
                },
                {
                    format: 'cjs',
                    dir: 'dist',
                    entryFileNames: 'cjs/[name].cjs',
                    chunkFileNames: 'cjs/[name].cjs',
                    globals: {
                        react: 'React',
                        'react-dom': 'ReactDOM',
                    },
                    assetFileNames: (assetInfo) => {
                        if (assetInfo.name?.endsWith('.css'))
                            return 'index.css';
                        return assetInfo.name ?? '[asset]';
                    },
                },
            ],
        },
        emptyOutDir: true,
        cssCodeSplit: false,
        // Don't copy public/ into the library dist. public/ holds Storybook-site
        // assets (msw worker, robots.txt, sitemap.xml, llms.txt, .well-known) that
        // are served via Storybook's staticDirs — they must not ship in the npm
        // package. Runtime component assets are bundled into dist/files instead.
        copyPublicDir: false,
    },
});
