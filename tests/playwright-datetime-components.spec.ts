import { expect, test } from '@playwright/test';

const timePickerUrl = '/iframe.html?id=regression-parity-datetime-components--time-picker-stable&viewMode=story';
const datePickerUrl = '/iframe.html?id=regression-parity-datetime-components--date-picker-stable&viewMode=story';
const countdownUrl = '/iframe.html?id=regression-parity-datetime-components--countdown-stable&viewMode=story';
const carouselUrl = '/iframe.html?id=regression-parity-datetime-components--carousel-stable&viewMode=story';

test.describe('TimePicker', () => {
    test('renders trigger and opens panel on click', async ({ page }) => {
        await page.goto(timePickerUrl);
        const trigger = page.locator('.animal-time-picker-trigger');
        await expect(trigger).toBeVisible();
        await trigger.click();
        await expect(page.locator('.animal-time-picker-panel')).toBeVisible();
    });

    test('shows hour/minute/second columns', async ({ page }) => {
        await page.goto(timePickerUrl);
        await page.locator('.animal-time-picker-trigger').click();
        await expect(page.locator('.animal-time-picker-column')).toHaveCount(3);
    });

    test('closes panel on Escape', async ({ page }) => {
        await page.goto(timePickerUrl);
        await page.locator('.animal-time-picker-trigger').click();
        await expect(page.locator('.animal-time-picker-panel')).toBeVisible();
        await page.keyboard.press('Escape');
        await expect(page.locator('.animal-time-picker-panel')).not.toBeVisible({ timeout: 3000 });
    });
});

test.describe('DatePicker', () => {
    test('renders trigger and opens panel on click', async ({ page }) => {
        await page.goto(datePickerUrl);
        const trigger = page.locator('.animal-date-picker-trigger');
        await expect(trigger).toBeVisible();
        await trigger.click();
        await expect(page.locator('.animal-date-picker-panel')).toBeVisible();
    });

    test('shows week header and day grid', async ({ page }) => {
        await page.goto(datePickerUrl);
        await page.locator('.animal-date-picker-trigger').click();
        await expect(page.locator('.animal-date-picker-week-row')).toBeVisible();
        await expect(page.locator('.animal-date-picker-grid')).toBeVisible();
    });

    test('closes panel on Escape', async ({ page }) => {
        await page.goto(datePickerUrl);
        await page.locator('.animal-date-picker-trigger').click();
        await expect(page.locator('.animal-date-picker-panel')).toBeVisible();
        await page.keyboard.press('Escape');
        await expect(page.locator('.animal-date-picker-panel')).not.toBeVisible({ timeout: 3000 });
    });
});

test.describe('Countdown', () => {
    test('renders timer with digit cells', async ({ page }) => {
        await page.goto(countdownUrl);
        await expect(page.locator('[role="timer"]')).toBeVisible();
        await expect(page.locator('.animal-countdown-digit-cell').first()).toBeVisible();
    });
});

test.describe('Carousel', () => {
    test('renders slides and navigation dots', async ({ page }) => {
        await page.goto(carouselUrl);
        await expect(page.locator('.animal-carousel')).toBeVisible();
        await expect(page.locator('.animal-carousel-dot')).toHaveCount(3);
    });

    test('navigates to next slide on arrow click', async ({ page }) => {
        await page.goto(carouselUrl);
        const nextBtn = page.locator('.animal-carousel-arrow-next');
        await expect(nextBtn).toBeVisible();
        await nextBtn.click();
        await expect(page.locator('.animal-carousel-dot-active').nth(0)).toBeVisible();
    });
});
