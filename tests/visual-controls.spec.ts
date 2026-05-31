import { expect, test, type Page } from '@playwright/test';

const storyUrl = '/iframe.html?id=regression-parity-controls--controls-playwright-parity&viewMode=story';
const matrixStoryUrl = '/iframe.html?id=regression-parity-controls--controls-state-matrix-parity&viewMode=story';
const placementStoryUrl = '/iframe.html?id=regression-parity-controls--select-placement-parity&viewMode=story';
const emptyKeyStoryUrl = '/iframe.html?id=regression-parity-controls--select-empty-key-playwright-parity&viewMode=story';

const disableMotion = async (page: Page) => {
    await page.addStyleTag({
        content: `
            *, *::before, *::after { animation: none !important; transition: none !important; caret-color: transparent !important; outline: none !important; }
            [class*="dropdown"], .animal-select-content { opacity: 1 !important; animation: none !important; }
        `,
    });
};

test.describe('reference controls visual parity', () => {
    test('captures stable Switch, Checkbox, and Select regions', async ({ page }) => {
        await page.goto(storyUrl);
        await disableMotion(page);
        await expect(page.getByTestId('switch-parity-region')).toBeVisible();
        await expect(page.getByTestId('checkbox-parity-region')).toBeVisible();
        await expect(page.getByTestId('select-parity-region')).toBeVisible();
        await expect(page.getByTestId('radio-parity-region')).toBeVisible();
        await expect(page.getByTestId('tooltip-parity-region')).toBeVisible();

        await expect(page.getByTestId('switch-parity-region')).toHaveScreenshot('switch-parity-region.png', {
            animations: 'disabled',
        });
        await expect(page.getByTestId('checkbox-parity-region')).toHaveScreenshot('checkbox-parity-region.png', {
            animations: 'disabled',
        });
        await expect(page.getByTestId('select-parity-region')).toHaveScreenshot('select-parity-region.png', {
            animations: 'disabled',
        });
        await expect(page.getByTestId('radio-parity-region')).toHaveScreenshot('radio-parity-region.png', {
            animations: 'disabled',
        });
        await expect(page.getByTestId('tooltip-parity-region')).toHaveScreenshot('tooltip-parity-region.png', {
            animations: 'disabled',
        });

        await page.getByText('鲈鱼').first().click();
        await expect(page.locator('body')).toHaveScreenshot('select-open-parity.png', {
            animations: 'disabled',
            mask: [page.locator('#storybook-root').locator('section').nth(0), page.locator('#storybook-root').locator('section').nth(1)],
        });

        await page.getByRole('button', { name: 'hover default' }).hover();
        await expect(page.getByRole('tooltip', { name: '默认提示' })).toBeVisible();
        await expect(page.locator('body')).toHaveScreenshot('tooltip-open-parity.png', {
            animations: 'disabled',
            mask: [
                page.getByTestId('switch-parity-region'),
                page.getByTestId('checkbox-parity-region'),
                page.getByTestId('select-parity-region'),
                page.getByTestId('radio-parity-region'),
            ],
        });
    });

    test('captures controls matrix regions', async ({ page }) => {
        await page.goto(matrixStoryUrl);
        await disableMotion(page);
        await expect(page.getByTestId('switch-state-matrix-region')).toBeVisible();
        await expect(page.getByTestId('checkbox-state-matrix-region')).toBeVisible();
        await expect(page.getByTestId('select-state-matrix-region')).toBeVisible();

        await expect(page.getByTestId('switch-state-matrix-region')).toHaveScreenshot('switch-state-matrix-region.png', {
            animations: 'disabled',
        });
        await expect(page.getByTestId('checkbox-size-matrix')).toHaveScreenshot('checkbox-size-matrix-region.png', {
            animations: 'disabled',
        });
        await expect(page.getByTestId('checkbox-direction-disabled-matrix')).toHaveScreenshot('checkbox-direction-disabled-region.png', {
            animations: 'disabled',
        });
        await expect(page.getByTestId('select-state-matrix-region')).toHaveScreenshot('select-state-matrix-region.png', {
            animations: 'disabled',
        });
    });

    test('captures Select empty-key and placement open states', async ({ page }) => {
        await page.goto(emptyKeyStoryUrl);
        await disableMotion(page);
        await expect(page.getByTestId('select-empty-key-region')).toBeVisible();
        await expect(page.getByTestId('select-empty-key-region')).toHaveScreenshot('select-empty-key-region.png', {
            animations: 'disabled',
            maxDiffPixelRatio: 0.006,
        });

        await page.goto(placementStoryUrl);
        await disableMotion(page);
        await expect(page.getByTestId('select-placement-region')).toBeVisible();
        await page.getByTestId('select-placement-right').getByText('春樱').click();
        await expect(page.getByText('冬莓').last()).toBeVisible();
        await expect(page.locator('[class*="dropdown"], .animal-select-content').last()).toHaveScreenshot('select-open-right-dropdown-parity.png', {
            animations: 'disabled',
        });
        await page.mouse.click(4, 4);
        await page.getByTestId('select-placement-left').getByText('夏葵').click();
        await expect(page.getByText('秋菊').last()).toBeVisible();
        await expect(page.locator('[class*="dropdown"], .animal-select-content').last()).toHaveScreenshot('select-open-left-dropdown-parity.png', {
            animations: 'disabled',
        });
    });
});
