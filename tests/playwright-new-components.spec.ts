import { expect, test } from '@playwright/test';

const baseUrl = '/iframe.html?id=regression-parity-new-components';

const tagUrl = `${baseUrl}--tag-story&viewMode=story`;
const progressUrl = `${baseUrl}--progress-story&viewMode=story`;
const skeletonUrl = `${baseUrl}--skeleton-story&viewMode=story`;
const notificationUrl = `${baseUrl}--notification-story&viewMode=story`;
const drawerUrl = `${baseUrl}--drawer-story&viewMode=story`;

test.describe('Tag', () => {
    test('renders variant and size tags', async ({ page }) => {
        await page.goto(tagUrl);
        const tags = page.locator('.animal-tag');
        await expect(tags.first()).toBeVisible();
        await expect(tags.first()).toHaveClass(/animal-tag/);
    });

    test('closable tag has close button', async ({ page }) => {
        await page.goto(tagUrl);
        const closeButtons = page.locator('.animal-tag-close');
        await expect(closeButtons.first()).toBeVisible();
    });

    test('disabled tag has disabled class', async ({ page }) => {
        await page.goto(tagUrl);
        const disabledTags = page.locator('.animal-tag-disabled');
        await expect(disabledTags.first()).toBeVisible();
    });
});

test.describe('Progress', () => {
    test('renders progress bar with progressbar role', async ({ page }) => {
        await page.goto(progressUrl);
        const progressBars = page.locator('[role="progressbar"]');
        await expect(progressBars.first()).toBeVisible();
    });

    test('track and fill elements are present', async ({ page }) => {
        await page.goto(progressUrl);
        await expect(page.locator('.animal-progress-track').first()).toBeVisible();
        await expect(page.locator('.animal-progress-fill').first()).toBeVisible();
    });

    test('aria-valuenow reflects percent', async ({ page }) => {
        await page.goto(progressUrl);
        const firstBar = page.locator('[role="progressbar"]').first();
        await expect(firstBar).toHaveAttribute('aria-valuenow', '30');
    });
});

test.describe('Skeleton', () => {
    test('renders skeleton elements', async ({ page }) => {
        await page.goto(skeletonUrl);
        await expect(page.locator('.animal-skeleton').first()).toBeVisible();
    });

    test('paragraph skeleton renders multiple rows', async ({ page }) => {
        await page.goto(skeletonUrl);
        const lines = page.locator('.animal-skeleton-line');
        await expect(lines).toHaveCount(4);
    });

    test('active skeleton has shimmer class', async ({ page }) => {
        await page.goto(skeletonUrl);
        const skeleton = page.locator('.animal-skeleton-active').first();
        await expect(skeleton).toBeVisible();
    });
});

test.describe('Notification', () => {
    test('notification triggers on button click', async ({ page }) => {
        await page.goto(notificationUrl);
        await page.click('button:has-text("Success")');
        await expect(page.locator('.animal-notification').first()).toBeVisible();
    });

    test('notification has correct type class', async ({ page }) => {
        await page.goto(notificationUrl);
        await page.click('button:has-text("Error")');
        await expect(page.locator('.animal-notification-type-error').first()).toBeVisible();
    });

    test('notification close button works', async ({ page }) => {
        await page.goto(notificationUrl);
        await page.click('button:has-text("Info")');
        const notification = page.locator('.animal-notification').first();
        await expect(notification).toBeVisible();
        await notification.locator('.animal-notification-close').click();
        await expect(notification).not.toBeVisible({ timeout: 2000 });
    });
});

test.describe('Drawer', () => {
    test('drawer is not visible by default', async ({ page }) => {
        await page.goto(drawerUrl);
        const panel = page.locator('.animal-drawer-panel');
        // Panel exists in DOM but is off-screen via transform
        await expect(panel).not.toHaveClass(/animal-drawer-panel-open/);
    });

    test('drawer opens and shows content', async ({ page }) => {
        await page.goto(drawerUrl);
        await page.click('button:has-text("right")');
        const panel = page.locator('.animal-drawer-panel');
        await expect(panel).toHaveClass(/animal-drawer-panel-open/);
        await expect(page.locator('.animal-drawer-title')).toBeVisible();
    });

    test('mask click closes drawer', async ({ page }) => {
        await page.goto(drawerUrl);
        await page.click('button:has-text("right")');
        await expect(page.locator('.animal-drawer-panel')).toHaveClass(/animal-drawer-panel-open/);
        await page.locator('.animal-drawer-mask').click({ position: { x: 10, y: 10 } });
        await expect(page.locator('.animal-drawer-panel')).not.toHaveClass(/animal-drawer-panel-open/);
    });
});
