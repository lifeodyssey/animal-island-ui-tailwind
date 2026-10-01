import { test, expect } from '@playwright/test';

const baseUrl = 'http://localhost:6006';
const defaultStoryUrl = `${baseUrl}/iframe.html?id=components-upload--default&viewMode=story`;
const dragStoryUrl = `${baseUrl}/iframe.html?id=components-upload--drag&viewMode=story`;
const pictureCardUrl = `${baseUrl}/iframe.html?id=components-upload--picture-card&viewMode=story`;
const disabledUrl = `${baseUrl}/iframe.html?id=components-upload--disabled&viewMode=story`;
const withFilesUrl = `${baseUrl}/iframe.html?id=components-upload--with-existing-files&viewMode=story`;

test.describe('Upload component', () => {
    test('renders default trigger button', async ({ page }) => {
        await page.goto(defaultStoryUrl);
        const upload = page.locator('.animal-upload');
        await expect(upload).toBeVisible();
        const trigger = upload.locator('.animal-upload-trigger');
        await expect(trigger).toBeVisible();
        await expect(trigger).toContainText('点击上传');
    });

    test('trigger button is accessible', async ({ page }) => {
        await page.goto(defaultStoryUrl);
        const trigger = page.locator('.animal-upload-trigger');
        await expect(trigger).toHaveAttribute('type', 'button');
        await expect(trigger).toHaveAttribute('aria-label', '上传文件');
    });

    test('hidden input is not visible', async ({ page }) => {
        await page.goto(defaultStoryUrl);
        const input = page.locator('.animal-upload-hidden-input');
        await expect(input).toBeAttached();
        await expect(input).toBeHidden();
    });

    test('renders drag zone in drag mode', async ({ page }) => {
        await page.goto(dragStoryUrl);
        const dragZone = page.locator('.animal-upload-drag-zone');
        await expect(dragZone).toBeVisible();
        await expect(dragZone).toContainText('点击或拖拽文件到这里');
        await expect(dragZone).toHaveAttribute('role', 'button');
    });

    test('renders picture-card add button', async ({ page }) => {
        await page.goto(pictureCardUrl);
        const cardList = page.locator('.animal-upload-card-list');
        await expect(cardList).toBeVisible();
        const addBtn = page.locator('.animal-upload-card-add-btn');
        await expect(addBtn).toBeVisible();
    });

    test('disabled state disables trigger', async ({ page }) => {
        await page.goto(disabledUrl);
        const upload = page.locator('.animal-upload');
        await expect(upload).toHaveClass(/animal-upload-disabled/);
        const trigger = upload.locator('.animal-upload-trigger');
        await expect(trigger).toBeDisabled();
    });

    test('renders existing file list', async ({ page }) => {
        await page.goto(withFilesUrl);
        const list = page.locator('.animal-upload-text-list');
        await expect(list).toBeVisible();
        const items = list.locator('.animal-upload-text-item');
        await expect(items).toHaveCount(3);
    });

    test('done status item has check icon class', async ({ page }) => {
        await page.goto(withFilesUrl);
        const doneItems = page.locator('.animal-upload-status-done');
        await expect(doneItems).toHaveCount(1);
    });

    test('error status item has error class', async ({ page }) => {
        await page.goto(withFilesUrl);
        const errorItems = page.locator('.animal-upload-text-item-error');
        await expect(errorItems).toHaveCount(1);
    });

    test('uploading item shows spinner', async ({ page }) => {
        await page.goto(withFilesUrl);
        const spinner = page.locator('.animal-upload-spinner').first();
        await expect(spinner).toBeVisible();
    });

    test('file names are shown in list items', async ({ page }) => {
        await page.goto(withFilesUrl);
        const items = page.locator('.animal-upload-text-item');
        await expect(items.first()).toContainText('annual-report.pdf');
    });

    test('delete buttons are rendered for list items', async ({ page }) => {
        await page.goto(withFilesUrl);
        const removeButtons = page.locator('.animal-upload-remove-btn');
        await expect(removeButtons).toHaveCount(3);
        const firstRemove = removeButtons.first();
        await expect(firstRemove).toHaveAttribute('type', 'button');
    });

    test('keyboard: drag zone is focusable with Tab', async ({ page }) => {
        await page.goto(dragStoryUrl);
        await page.keyboard.press('Tab');
        const dragZone = page.locator('.animal-upload-drag-zone');
        await expect(dragZone).toBeFocused();
    });
});
