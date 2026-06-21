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
        // "Effectively pixel-perfect" gate. Absolute maxDiffPixels:0 is not stable
        // on macOS Chromium — subpixel font AA jitters by ≤20px between runs even
        // with deterministic font flags. threshold:0.15 ignores faint AA color
        // jitter; maxDiffPixels:50 caps residual jitter while staying orders of
        // magnitude below any REAL style change (which moves hundreds+ of pixels).
        toHaveScreenshot: {
            maxDiffPixels: 50,
            threshold: 0.15,
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
