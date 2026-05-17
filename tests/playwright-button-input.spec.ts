import { expect, test, type Locator } from '@playwright/test';

const storyUrl = '/iframe.html?id=regression-parity-button-input--button-input-parity&viewMode=story';
const buttonMatrixStoryUrl = '/iframe.html?id=regression-parity-button-input--button-matrix-parity&viewMode=story';
const inputMatrixStoryUrl = '/iframe.html?id=regression-parity-button-input--input-matrix-parity&viewMode=story';

const wrapperForInput = (input: Locator) => input.locator('xpath=..');

test.describe('reference Button/Input parity', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(storyUrl);
        await expect(page.getByTestId('button-parity-region')).toBeVisible();
        await expect(page.getByTestId('input-parity-region')).toBeVisible();
    });

    test('covers reference Button states and styles', async ({ page }) => {
        const defaultButton = page.getByRole('button', { name: 'Default', exact: true });
        const dashedButton = page.getByRole('button', { name: 'Dashed', exact: true });
        const disabledButton = page.getByRole('button', { name: 'Disabled', exact: true });

        await expect(page.getByRole('button', { name: 'Primary', exact: true })).toBeVisible();
        await expect(defaultButton).toBeVisible();
        await expect(dashedButton).toBeVisible();
        await expect(page.getByRole('button', { name: 'Ghost', exact: true })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Loading', exact: true })).toBeVisible();
        await expect(page.getByText('搜索')).toBeVisible();
        await expect(page.getByText('收藏')).toBeVisible();
        await expect(page.getByText('新增')).toBeVisible();
        await expect(page.getByRole('button', { name: 'Block Button', exact: true })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Default Danger', exact: true })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Dashed Danger', exact: true })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Text Danger', exact: true })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Link Danger', exact: true })).toBeVisible();

        await expect(defaultButton).toHaveCSS('border-color', 'rgb(170, 166, 157)');
        await expect(dashedButton).toHaveCSS('border-color', 'rgb(170, 166, 157)');

        for (const name of ['Small', 'Middle', 'Large']) {
            await expect(page.getByRole('button', { name, exact: true })).toHaveCSS(
                'box-shadow',
                'rgb(189, 174, 160) 0px 5px 0px 0px',
            );
        }

        await expect(disabledButton).toBeDisabled();
        await expect(disabledButton).toHaveCSS('background-color', 'rgb(248, 248, 240)');
    });

    test('covers reference Input states and clear behavior', async ({ page }) => {
        const noShadowInput = page.getByPlaceholder('No shadow (default)');
        const shadowInput = page.getByPlaceholder('With shadow');
        const disabledInput = page.getByPlaceholder('Disabled');
        const clearableInput = page.getByPlaceholder('With clear');

        await expect(page.getByPlaceholder('Basic input')).toBeVisible();
        await expect(page.getByPlaceholder('Prefix & Suffix')).toBeVisible();
        await expect(page.getByPlaceholder('Clear empty')).toBeVisible();
        await expect(page.getByPlaceholder('Small')).toBeVisible();
        await expect(page.getByPlaceholder('Middle (default)')).toBeVisible();
        await expect(page.getByPlaceholder('Large')).toBeVisible();
        await expect(page.getByPlaceholder('Error status')).toBeVisible();
        await expect(page.getByPlaceholder('Warning status')).toBeVisible();

        for (const input of await page.locator('input').all()) {
            await expect(wrapperForInput(input)).toHaveCSS('width', '360px');
        }

        await expect(wrapperForInput(noShadowInput)).toHaveCSS('box-shadow', 'none');
        await expect(wrapperForInput(shadowInput)).not.toHaveCSS('box-shadow', 'none');

        await expect(disabledInput).toBeDisabled();
        await expect(disabledInput).toHaveCSS('color', 'rgb(196, 184, 158)');

        await expect(clearableInput).toHaveValue('Island note');
        await page.getByRole('button', { name: '×' }).or(page.getByRole('button', { name: 'Clear input' })).first().click();
        await expect(clearableInput).toHaveValue('');
    });

    test('covers Button matrix combinations and native form behavior', async ({ page }) => {
        await page.goto(buttonMatrixStoryUrl);
        await expect(page.getByTestId('button-matrix-region')).toBeVisible();

        for (const size of ['small', 'middle', 'large']) {
            for (const type of ['primary', 'default', 'dashed', 'text', 'link']) {
                await expect(page.getByRole('button', { name: `${type}-${size}`, exact: true })).toBeVisible();
            }
        }

        const primarySmall = page.getByRole('button', { name: 'primary-small', exact: true });
        const primaryMiddle = page.getByRole('button', { name: 'primary-middle', exact: true });
        const primaryLarge = page.getByRole('button', { name: 'primary-large', exact: true });
        const ghostButton = page.getByRole('button', { name: 'primary-ghost', exact: true });
        const loadingButton = page.getByRole('button', { name: 'loading-hides-icon', exact: true });

        expect((await primarySmall.boundingBox())?.height).toBeLessThan((await primaryMiddle.boundingBox())?.height ?? 0);
        expect((await primaryLarge.boundingBox())?.height).toBeGreaterThan((await primaryMiddle.boundingBox())?.height ?? 0);
        await expect(ghostButton).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
        await expect(ghostButton).toHaveCSS('box-shadow', 'none');
        await expect(loadingButton).toHaveCSS('pointer-events', 'none');
        await expect(page.getByRole('button', { name: /disabled-icon/ })).toBeDisabled();

        await expect(page.getByRole('button', { name: 'submit-native' })).toHaveAttribute('type', 'submit');
        await expect(page.getByRole('button', { name: 'reset-native' })).toHaveAttribute('type', 'reset');
        await expect(page.getByRole('button', { name: 'button-native' })).toHaveAttribute('type', 'button');
        await page.getByRole('button', { name: 'button-native' }).click();
        await expect(page.getByTestId('button-form-action')).toHaveText('button-clicked');
        await page.getByRole('button', { name: 'submit-native' }).click();
        await expect(page.getByTestId('button-form-action')).toHaveText('submitted');
        await page.getByRole('button', { name: 'reset-native' }).click();
        await expect(page.getByTestId('button-form-action')).toHaveText('reset');
    });

    test('covers Input matrix native props, maxlength, and disabled clear behavior', async ({ page }) => {
        await page.goto(inputMatrixStoryUrl);
        await expect(page.getByTestId('input-matrix-region')).toBeVisible();

        const smallInput = page.getByPlaceholder('small-default');
        const middleErrorInput = page.getByPlaceholder('middle-error');
        const largeWarningInput = page.getByPlaceholder('large-warning');
        const emailInput = page.getByPlaceholder('Email input');
        const passwordInput = page.getByPlaceholder('Password input');
        const readOnlyInput = page.getByPlaceholder('Read only input');
        const controlledInput = page.getByPlaceholder('Controlled clear');
        const disabledClearInput = page.getByPlaceholder('Disabled clear');

        expect((await smallInput.boundingBox())?.height).toBeLessThan((await middleErrorInput.boundingBox())?.height ?? 0);
        expect((await largeWarningInput.boundingBox())?.height).toBeGreaterThan((await middleErrorInput.boundingBox())?.height ?? 0);
        await expect(wrapperForInput(middleErrorInput)).toHaveCSS('border-color', 'rgb(224, 90, 90)');
        await expect(wrapperForInput(largeWarningInput)).toHaveCSS('border-color', 'rgb(245, 195, 28)');
        await expect(emailInput).toHaveAttribute('type', 'email');
        await expect(emailInput).toHaveAttribute('name', 'islandEmail');
        await expect(emailInput).toHaveAttribute('required', '');
        await expect(passwordInput).toHaveAttribute('type', 'password');
        await expect(readOnlyInput).toHaveAttribute('readonly', '');
        await expect(disabledClearInput).toBeDisabled();
        await expect(wrapperForInput(disabledClearInput)).toHaveCSS('box-shadow', 'none');

        await controlledInput.fill('Controlled');
        await expect(controlledInput).toHaveAttribute('maxlength', '8');
        await controlledInput.fill('123456789');
        await expect(controlledInput).toHaveValue('12345678');
        await page.getByRole('button', { name: '×' }).or(page.getByRole('button', { name: 'Clear input' })).first().click();
        await expect(controlledInput).toHaveValue('');
        await expect(page.getByTestId('controlled-input-state')).toContainText('empty / clears:');
    });
});
