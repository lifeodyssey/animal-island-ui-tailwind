import type { Page } from '@playwright/test';

/**
 * Deterministic prep for pixel-exact (maxDiffPixels:0) screenshots.
 * Font-load anti-aliasing races and in-flight animations are the #1 source of
 * false positives at zero tolerance, so we: force every animation/transition to
 * complete instantly, hide the caret/outline, normalize font smoothing, then
 * wait for fonts + network to settle before any screenshot is taken.
 */
export const disableMotion = async (page: Page): Promise<void> => {
    await page.addStyleTag({
        content: `*, *::before, *::after {
            animation: none !important;
            animation-duration: 0s !important;
            animation-delay: 0s !important;
            transition: none !important;
            transition-duration: 0s !important;
            caret-color: transparent !important;
            outline: none !important;
            -webkit-font-smoothing: antialiased !important;
            -moz-osx-font-smoothing: grayscale !important;
        }`,
    });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForLoadState('networkidle');
};
