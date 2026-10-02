import { expect, test } from '@playwright/test';

const storyUrl = '/iframe.html?id=regression-parity-new-components--upload-basic&viewMode=story';

test.describe('Upload component', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(storyUrl);
    });

    test('renders default trigger button with correct classes and label', async ({ page }) => {
        const trigger = page.getByRole('button', { name: '上传文件' }).first();
        await expect(trigger).toBeVisible();
        await expect(trigger).toHaveClass(/animal-upload-trigger/);
    });

    test('root element carries animal-upload class', async ({ page }) => {
        const upload = page.locator('.animal-upload').first();
        await expect(upload).toBeVisible();
    });

    test('disabled upload has animal-upload--disabled class', async ({ page }) => {
        const disabled = page.locator('[data-testid="upload-disabled"]');
        await expect(disabled).toHaveClass(/animal-upload--disabled/);
        const btn = disabled.getByRole('button').first();
        await expect(btn).toBeDisabled();
    });

    test('drag zone renders with correct class', async ({ page }) => {
        const dragZone = page.locator('.animal-upload-drag-zone');
        await expect(dragZone).toBeVisible();
    });

    test('picture-card add button renders', async ({ page }) => {
        const cardAddBtn = page.locator('.animal-upload-card-add-btn').first();
        await expect(cardAddBtn).toBeVisible();
    });

    test('CSS tokens are applied — teal primary color on spinner border-top', async ({ page }) => {
        // Inject a spinner into the page and verify the CSS custom property resolves
        const teal = await page.evaluate(() => {
            const el = document.createElement('div');
            el.className = 'animal-upload-spinner';
            el.style.position = 'fixed';
            el.style.left = '-9999px';
            document.body.appendChild(el);
            const color = getComputedStyle(el).borderTopColor;
            document.body.removeChild(el);
            return color;
        });
        // --animal-primary-color: #19c8b9 → rgb(25, 200, 185)
        expect(teal).toBe('rgb(25, 200, 185)');
    });
});
