import { expect, test } from '@playwright/test';

const storyUrl = '/iframe.html?id=components-calendar--no-play-default&viewMode=story';

test.describe('Calendar', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(storyUrl);
        await expect(page.locator('.animal-calendar')).toBeVisible();
    });

    test('renders header with nav buttons and today button', async ({ page }) => {
        await expect(page.locator('.animal-calendar-nav-btn').first()).toBeVisible();
        await expect(page.locator('.animal-calendar-nav-btn').last()).toBeVisible();
        await expect(page.locator('.animal-calendar-today-btn')).toBeVisible();
        await expect(page.locator('.animal-calendar-month-label')).toBeVisible();
    });

    test('renders 7 weekday columns', async ({ page }) => {
        const weekCells = page.locator('.animal-calendar-week-cell');
        await expect(weekCells).toHaveCount(7);
    });

    test('renders day cells including today', async ({ page }) => {
        await expect(page.locator('.animal-calendar-cell-today')).toHaveCount(1);
    });

    test('clicking a cell selects it', async ({ page }) => {
        const cells = page.locator('.animal-calendar-cell:not(.animal-calendar-cell-outside)');
        const firstCell = cells.first();
        await firstCell.click();
        await expect(firstCell).toHaveClass(/animal-calendar-cell-selected/);
    });

    test('today button navigates to current month', async ({ page }) => {
        // Navigate forward one month
        await page.locator('.animal-calendar-nav-btn').last().click();
        // Click today
        await page.locator('.animal-calendar-today-btn').click();
        await expect(page.locator('.animal-calendar-cell-today')).toHaveCount(1);
    });

    test('prev/next nav buttons change the displayed month', async ({ page }) => {
        const labelBefore = await page.locator('.animal-calendar-month-label').textContent();
        await page.locator('.animal-calendar-nav-btn').last().click();
        const labelAfter = await page.locator('.animal-calendar-month-label').textContent();
        expect(labelBefore).not.toEqual(labelAfter);
    });

    test('events render as bars', async ({ page }) => {
        await expect(page.locator('.animal-calendar-event').first()).toBeVisible();
    });

    test('keyboard navigation moves focus between cells', async ({ page }) => {
        const firstCell = page.locator('.animal-calendar-cell:not(.animal-calendar-cell-outside)').first();
        await firstCell.focus();
        await page.keyboard.press('ArrowRight');
        // A second cell in the grid should gain focus
        const focused = page.locator('.animal-calendar-cell:focus');
        await expect(focused).toHaveCount(1);
    });
});
