import { expect, test } from '@playwright/test';
import { disableMotion } from './visual-helpers';

const storyUrl = '/iframe.html?id=regression-parity-button-input--button-input-parity&viewMode=story';
const buttonMatrixStoryUrl = '/iframe.html?id=regression-parity-button-input--button-matrix-parity&viewMode=story';
const inputMatrixStoryUrl = '/iframe.html?id=regression-parity-button-input--input-matrix-parity&viewMode=story';

test.describe('reference Button/Input visual parity', () => {
    test('captures stable Button and Input regions', async ({ page }) => {
        await page.goto(storyUrl);
        await disableMotion(page);
        await expect(page.getByTestId('button-parity-region')).toBeVisible();
        await expect(page.getByTestId('input-parity-region')).toBeVisible();

        await expect(page.getByTestId('button-parity-region')).toHaveScreenshot('button-parity-region.png', {
            animations: 'disabled',
        });
        await expect(page.getByTestId('input-parity-region')).toHaveScreenshot('input-parity-region.png', {
            animations: 'disabled',
        });
    });

    test('captures Button matrix regions', async ({ page }) => {
        await page.goto(buttonMatrixStoryUrl);
        await disableMotion(page);
        await expect(page.getByTestId('button-matrix-region')).toBeVisible();

        await expect(page.getByTestId('button-type-size-matrix')).toHaveScreenshot('button-type-size-matrix-region.png', {
            animations: 'disabled',
        });
        await expect(page.getByTestId('button-state-matrix')).toHaveScreenshot('button-state-matrix-region.png', {
            animations: 'disabled',
        });
        await expect(page.getByTestId('button-htmltype-form')).toHaveScreenshot('button-htmltype-form-region.png', {
            animations: 'disabled',
        });
    });

    test('captures Input matrix regions', async ({ page }) => {
        await page.goto(inputMatrixStoryUrl);
        await disableMotion(page);
        await expect(page.getByTestId('input-matrix-region')).toBeVisible();

        await expect(page.getByTestId('input-size-status-matrix')).toHaveScreenshot('input-size-status-matrix-region.png', {
            animations: 'disabled',
        });
        await expect(page.getByTestId('input-native-matrix')).toHaveScreenshot('input-native-matrix-region.png', {
            animations: 'disabled',
        });
        await expect(page.getByTestId('input-clear-matrix')).toHaveScreenshot('input-clear-matrix-region.png', {
            animations: 'disabled',
        });
    });
});
