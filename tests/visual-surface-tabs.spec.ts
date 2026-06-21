import { expect, test } from '@playwright/test';
import { disableMotion } from './visual-helpers';

const tabsStoryUrl = '/iframe.html?id=regression-parity-surface-tabs--tabs-parity&viewMode=story';
const surfaceStoryUrl = '/iframe.html?id=regression-parity-surface-tabs--surface-parity&viewMode=story';
const tabsMatrixStoryUrl = '/iframe.html?id=regression-parity-surface-tabs--tabs-matrix-parity&viewMode=story';
const surfaceEdgeStoryUrl = '/iframe.html?id=regression-parity-surface-tabs--surface-edge-parity&viewMode=story';

test.describe('reference surface/tabs visual parity', () => {
    test('captures stable Tabs region', async ({ page }) => {
        await page.goto(tabsStoryUrl);
        await disableMotion(page);
        await expect(page.getByTestId('tabs-parity-region')).toBeVisible();
        await expect(page.getByTestId('tabs-parity-region')).toHaveScreenshot('tabs-parity-region.png', {
            animations: 'disabled',
        });
    });

    test('captures Tabs matrix regions', async ({ page }) => {
        await page.goto(tabsMatrixStoryUrl);
        await disableMotion(page);
        await expect(page.getByTestId('tabs-matrix-region')).toBeVisible();

        await expect(page.getByTestId('tabs-matrix-region')).toHaveScreenshot('tabs-matrix-region.png', {
            animations: 'disabled',
        });
        await page.getByTestId('tabs-controlled-matrix').getByText('🏛 博物馆').click();
        await expect(page.getByTestId('tabs-matrix-selected-label')).toHaveText('selected: museum');
        await expect(page.getByTestId('tabs-controlled-matrix')).toHaveScreenshot('tabs-controlled-after-switch-region.png', {
            animations: 'disabled',
        });
    });

    test('captures stable surface regions and modal open state', async ({ page }) => {
        await page.goto(surfaceStoryUrl);
        await disableMotion(page);
        await expect(page.getByTestId('card-parity-region')).toBeVisible();
        await expect(page.getByTestId('collapse-parity-region')).toBeVisible();
        await expect(page.getByTestId('modal-parity-region')).toBeVisible();

        await expect(page.getByTestId('card-parity-region')).toHaveScreenshot('card-parity-region.png', {
            animations: 'disabled',
        });
        await expect(page.getByTestId('collapse-parity-region')).toHaveScreenshot('collapse-parity-region.png', {
            animations: 'disabled',
        });
        await expect(page.getByTestId('modal-parity-region')).toHaveScreenshot('modal-buttons-parity-region.png', {
            animations: 'disabled',
        });

        await page.getByRole('button', { name: '关闭打字机效果' }).click();
        await expect(page.getByRole('heading', { name: '天气预报' })).toBeVisible();
        await expect(page.getByRole('dialog')).toHaveScreenshot('modal-open-parity.png', {
            animations: 'disabled',
            maxDiffPixelRatio: 0.006,
        });
    });

    test('captures surface edge regions and modal edge states', async ({ page }) => {
        await page.goto(surfaceEdgeStoryUrl);
        await disableMotion(page);
        await expect(page.getByTestId('card-edge-region')).toBeVisible();
        await expect(page.getByTestId('collapse-rich-region')).toBeVisible();
        await expect(page.getByTestId('modal-edge-region')).toBeVisible();

        await expect(page.getByTestId('card-edge-region')).toHaveScreenshot('card-edge-region.png', {
            animations: 'disabled',
        });
        await expect(page.getByTestId('collapse-rich-region')).toHaveScreenshot('collapse-rich-open-region.png', {
            animations: 'disabled',
        });
        await expect(page.getByTestId('modal-edge-region')).toHaveScreenshot('modal-edge-buttons-region.png', {
            animations: 'disabled',
        });

        await page.getByRole('button', { name: 'footer null' }).click();
        await expect(page.getByRole('dialog')).toHaveScreenshot('modal-no-footer-parity.png', {
            animations: 'disabled',
            maxDiffPixelRatio: 0.006,
        });
        await page.keyboard.press('Escape');

        await page.getByRole('button', { name: 'mask locked' }).click();
        await expect(page.getByRole('dialog')).toHaveScreenshot('modal-mask-locked-parity.png', {
            animations: 'disabled',
            maxDiffPixelRatio: 0.006,
        });
        await page.keyboard.press('Escape');

        await page.getByRole('button', { name: 'narrow width' }).click();
        await expect(page.getByRole('dialog')).toHaveScreenshot('modal-narrow-width-parity.png', {
            animations: 'disabled',
            maxDiffPixelRatio: 0.006,
        });
    });
});
