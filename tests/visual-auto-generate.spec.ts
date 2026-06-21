import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import { disableMotion } from './visual-helpers';

// One pixel-exact screenshot per component story (enumerated from Storybook's
// index — see scripts/gen-story-ids note). Regression/parity stories are covered
// by the dedicated visual-*.spec.ts files and excluded here.
const storyIds: string[] = JSON.parse(
    readFileSync(new URL('./story-ids.json', import.meta.url), 'utf8')
);

// Inherently NON-deterministic stories (JS-driven animation / per-frame state)
// that cannot be pinned pixel-exact without a dedicated frozen no-play story.
// Tracked here explicitly (no silent cap) — to be replaced by frozen variants.
const DENYLIST = new Set<string>([]);

// typewriter = JS char reveal; loading = GSAP island; cursor = some stories render
// a zero-size root. All need dedicated frozen/sized no-play stories to pin (follow-up).
const isAnimated = (id: string) =>
    id.startsWith('components-typewriter--') ||
    id.startsWith('components-loading--') ||
    id.startsWith('components-cursor--');

// Freeze Date so clock/time-based stories (Time) render deterministically.
const FREEZE_CLOCK = `(() => {
    const fixed = new Date('2024-08-15T13:45:00').getTime();
    const RealDate = Date;
    class MockDate extends RealDate {
        constructor(...args) { super(...(args.length ? args : [fixed])); }
        static now() { return fixed; }
    }
    MockDate.UTC = RealDate.UTC; MockDate.parse = RealDate.parse;
    // @ts-expect-error override
    window.Date = MockDate;
})();`;

test.describe('auto visual parity (per story)', () => {
    for (const id of storyIds) {
        const skip = DENYLIST.has(id) || isAnimated(id);
        // eslint-disable-next-line playwright/no-skipped-test
        (skip ? test.skip : test)(`story ${id}`, async ({ page }) => {
            await page.addInitScript(FREEZE_CLOCK);
            await page.goto(`/iframe.html?id=${id}&viewMode=story`);
            await disableMotion(page);
            await page.evaluate(() => {
                const g = (window as Window & { gsap?: { globalTimeline?: { pause: (t?: number) => void } } }).gsap;
                g?.globalTimeline?.pause(0);
            });
            const root = page.locator('#storybook-root');
            await expect(root).toBeVisible();
            await expect(root).toHaveScreenshot(`${id}.png`);
        });
    }
});
