import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './tests',
    testMatch: '**/*.spec.ts',
    timeout: 30_000,
    workers: 1,
    retries: process.env.CI ? 2 : 1,
    snapshotPathTemplate: '{testDir}/{testFileDir}/{testFileName}-snapshots/{arg}{-projectName}{ext}',
    expect: {
        timeout: 10_000,
        // Pixel-exact gate: maxDiffPixels:0 (ZERO differing pixels allowed).
        // The per-pixel `threshold` (YIQ color distance) absorbs Chromium's faint
        // subpixel font-AA jitter so those pixels don't count as "different" —
        // giving a stable, literal maxDiffPixels:0 — while any REAL style change
        // (large per-pixel delta) still counts and fails the gate. Verified stable
        // across runs AND failing on a deliberate token change (primary→red).
        toHaveScreenshot: {
            maxDiffPixels: 0,
            threshold: 0.2,
            animations: 'disabled',
        },
    },
    use: {
        baseURL: 'http://127.0.0.1:6106',
        trace: 'retain-on-failure',
        deviceScaleFactor: 1, // lock DPI so subpixel AA is deterministic
    },
    webServer: {
        command: 'npm run storybook:test',
        url: 'http://127.0.0.1:6106',
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
    },
    projects: [
        {
            name: 'chromium',
            use: {
                ...devices['Desktop Chrome'],
                deviceScaleFactor: 1,
                // Deterministic text rasterization so maxDiffPixels:0 doesn't flap on
                // subpixel font anti-aliasing (LCD/hinting/GPU jitter on the same machine).
                launchOptions: {
                    args: [
                        '--font-render-hinting=none',
                        '--disable-lcd-text',
                        '--disable-gpu',
                        '--disable-skia-runtime-opts',
                        '--force-color-profile=srgb',
                        '--disable-font-subpixel-positioning',
                    ],
                },
            },
        },
    ],
});
