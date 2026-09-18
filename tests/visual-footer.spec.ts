import { expect, test } from '@playwright/test';

// Footer is now a copyright bar (text + year props); the old image-based
// sea/tree decoration stories were removed in the upstream sync.
const stories = [
    { id: 'components-footer--default', name: 'default' },
    { id: 'components-footer--custom-year', name: 'custom-year' },
    { id: 'components-footer--minimal-text', name: 'minimal-text' },
] as const;

// Default year comes from the system clock — freeze it for stable baselines.
const FREEZE_CLOCK = `(() => {
    const fixed = new Date('2024-08-15T13:45:00').getTime();
    const RealDate = Date;
    class MockDate extends RealDate {
        constructor(...args) { super(...(args.length ? args : [fixed])); }
        static now() { return fixed; }
    }
    MockDate.UTC = RealDate.UTC; MockDate.parse = RealDate.parse;
    window.Date = MockDate;
})();`;

for (const width of [1280, 390]) {
    for (const story of stories) {
        test(`${story.name} footer copyright bar at ${width}px`, async ({ page }) => {
            await page.addInitScript(FREEZE_CLOCK);
            await page.setViewportSize({ width, height: 600 });
            await page.goto(`/iframe.html?id=${story.id}&viewMode=story`);
            const footer = page.locator('.animal-footer').first();
            await expect(footer).toBeVisible();
            await expect(page.locator('#storybook-root')).toHaveScreenshot(
                `footer-${story.name}-${width}.png`,
            );
        });
    }
}
