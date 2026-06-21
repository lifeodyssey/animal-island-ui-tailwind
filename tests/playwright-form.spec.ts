import { expect, test } from '@playwright/test';

// Drives the no-play parity story so this behavior spec doesn't race the
// interaction-test `play` functions on the other Form stories.
const formStoryUrl = '/iframe.html?id=components-form--playwright-parity&viewMode=story';

test.describe('Form behavior parity', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(formStoryUrl);
        await expect(page.getByTestId('form-parity-region')).toBeVisible();
    });

    test('required validation blocks submit and shows error', async ({ page }) => {
        const region = page.getByTestId('form-parity-region');
        await region.getByRole('button', { name: '提交' }).click();

        await expect(page.getByText('昵称必填')).toBeVisible();
        await expect(page.getByTestId('parity-failed')).toHaveText('failed');
        await expect(page.getByTestId('parity-submitted')).toHaveText('');
    });

    test('type=email validation reports a bad address', async ({ page }) => {
        const region = page.getByTestId('form-parity-region');
        await region.getByPlaceholder('昵称').fill('狸克');
        await region.getByPlaceholder('邮箱').fill('not-an-email');
        await region.getByRole('button', { name: '提交' }).click();

        await expect(page.getByText('邮箱格式不对')).toBeVisible();
        await expect(page.getByTestId('parity-failed')).toHaveText('failed');
    });

    test('valid input submits and reports onFinish values', async ({ page }) => {
        const region = page.getByTestId('form-parity-region');
        await region.getByPlaceholder('昵称').fill('狸克');
        await region.getByPlaceholder('邮箱').fill('tom@example.com');
        await region.getByRole('button', { name: '提交' }).click();

        await expect(page.getByTestId('parity-submitted')).toContainText('"name":"狸克"');
        await expect(page.getByTestId('parity-submitted')).toContainText('"email":"tom@example.com"');
        await expect(page.getByTestId('parity-failed')).toHaveText('');
    });

    test('reset restores fields and clears errors', async ({ page }) => {
        const region = page.getByTestId('form-parity-region');
        const nameInput = region.getByPlaceholder('昵称');

        await region.getByRole('button', { name: '提交' }).click();
        await expect(page.getByText('昵称必填')).toBeVisible();

        await nameInput.fill('狸克');
        await region.getByRole('button', { name: '重置' }).click();

        await expect(nameInput).toHaveValue('');
        await expect(page.getByText('昵称必填')).toHaveCount(0);
    });
});
