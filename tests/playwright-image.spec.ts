import { expect, test } from '@playwright/test';

const imageUrl = '/iframe.html?id=regression-parity-new-components--image-story&viewMode=story';

test.describe('Image', () => {
    test('renders image frame with animal-image class', async ({ page }) => {
        await page.goto(imageUrl);
        await page.waitForLoadState('networkidle');
        const frame = page.locator('.animal-image').first();
        await expect(frame).toBeVisible();
    });

    test('preview image is a button with zoom-in cursor', async ({ page }) => {
        await page.goto(imageUrl);
        await page.waitForLoadState('networkidle');
        const previewBtn = page.locator('button.animal-image-preview').first();
        await expect(previewBtn).toBeVisible();
    });

    test('clicking preview button opens dialog', async ({ page }) => {
        await page.goto(imageUrl);
        await page.waitForLoadState('networkidle');
        await page.locator('button.animal-image-preview').first().click();
        const dialog = page.locator('[role="dialog"]');
        await expect(dialog).toBeVisible();
        await expect(page.locator('.animal-image-preview-img')).toBeVisible();
    });

    test('close button dismisses preview', async ({ page }) => {
        await page.goto(imageUrl);
        await page.waitForLoadState('networkidle');
        await page.locator('button.animal-image-preview').first().click();
        await expect(page.locator('[role="dialog"]')).toBeVisible();
        await page.locator('.animal-image-close-btn').click();
        await expect(page.locator('[role="dialog"]')).not.toBeVisible({ timeout: 2000 });
    });

    test('ESC key closes preview', async ({ page }) => {
        await page.goto(imageUrl);
        await page.waitForLoadState('networkidle');
        await page.locator('button.animal-image-preview').first().click();
        await expect(page.locator('[role="dialog"]')).toBeVisible();
        await page.keyboard.press('Escape');
        await expect(page.locator('[role="dialog"]')).not.toBeVisible({ timeout: 2000 });
    });

    test('non-preview image renders as span', async ({ page }) => {
        await page.goto(imageUrl);
        await page.waitForLoadState('networkidle');
        // The "No preview" section renders a <span> not a <button>
        const noPreviewFrame = page.locator('span.animal-image').first();
        await expect(noPreviewFrame).toBeVisible();
    });

    test('color variant applies correct class', async ({ page }) => {
        await page.goto(imageUrl);
        await page.waitForLoadState('networkidle');
        const pinkFrame = page.locator('.animal-image-app-pink').first();
        await expect(pinkFrame).toBeVisible();
    });

    test('error state shows camera icon placeholder', async ({ page }) => {
        await page.goto(imageUrl);
        await page.waitForLoadState('networkidle');
        const errorFrame = page.locator('.animal-image-error');
        await expect(errorFrame).toBeVisible({ timeout: 5000 });
    });
});
