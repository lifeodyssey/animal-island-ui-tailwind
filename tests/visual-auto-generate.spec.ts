import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import { disableMotion } from './visual-helpers';

// One pixel-exact screenshot per component story (enumerated from Storybook's
// index — see scripts/gen-story-ids note). Regression/parity stories are covered
// by the dedicated visual-*.spec.ts files and excluded here.
const storyIds: string[] = JSON.parse(
    readFileSync(new URL('./story-ids.json', import.meta.url), 'utf8')
);

// The only stories with no stable frame: the Loading island runs an infinite GSAP
// timeline (irreducible animation per the design). Every other animated story
// (Typewriter typing-out, Cursor, Loading toggle) settles and IS pinned. Tracked
// explicitly here — no silent cap.
const DENYLIST = new Set<string>([
    'components-loading--active',
    'components-loading--inactive',
]);

const isAnimated = (_id: string) => false;

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
            await expect(root).toBeAttached();
            // toHaveScreenshot polls until two consecutive shots match, so finite
            // animations (Typewriter typing out, paused GSAP) settle to a stable frame.
            await expect(root).toHaveScreenshot(`${id}.png`, { timeout: 15_000 });
        });
    }
});
