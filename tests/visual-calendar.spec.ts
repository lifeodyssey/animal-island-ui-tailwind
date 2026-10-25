import { expect, test } from '@playwright/test';
import { disableMotion } from './visual-helpers';

for (const story of ['stable', 'narrow']) {
    test(`calendar ${story} retains upstream event and month layout`, async ({ page }) => {
        await page.clock.setFixedTime(new Date('2026-08-15T12:00:00'));
        await page.goto(`/iframe.html?id=components-calendar--${story}&viewMode=story`);
        await disableMotion(page);
        const region = page.locator('.animal-calendar');
        await expect(region).toBeVisible();
        await expect(region.getByRole('gridcell')).toHaveCount(42);
        const eventText = region.locator('.animal-calendar-event-time').first();
        const eventTypography = await eventText.evaluate((node) => {
            const text = getComputedStyle(node);
            const bar = getComputedStyle(node.parentElement!);
            return { textSize: text.fontSize, barSize: bar.fontSize, textHeight: text.lineHeight, barHeight: bar.lineHeight };
        });
        expect(eventTypography.textSize).toBe(eventTypography.barSize);
        expect(eventTypography.textHeight).toBe(eventTypography.barHeight);
        await expect(region).toHaveScreenshot(`calendar-${story}.png`);
        const previousMonth = region.getByRole('button', { name: '上个月', exact: true });
        const navIcon = previousMonth.locator('.animal-calendar-nav-icon');
        await expect(navIcon).toHaveCSS('color', 'rgb(160, 147, 110)');
        await previousMonth.hover();
        await expect(navIcon).toHaveCSS('color', 'rgb(25, 200, 185)');
    });
}
