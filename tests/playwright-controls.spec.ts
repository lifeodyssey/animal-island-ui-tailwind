import { expect, test, type Locator, type Page } from '@playwright/test';

const storyUrl = '/iframe.html?id=regression-parity-controls--controls-playwright-parity&viewMode=story';
const matrixStoryUrl = '/iframe.html?id=regression-parity-controls--controls-state-matrix-stable&viewMode=story';
const placementStoryUrl = '/iframe.html?id=regression-parity-controls--select-placement-parity&viewMode=story';
const emptyKeyStoryUrl = '/iframe.html?id=regression-parity-controls--select-empty-key-playwright-parity&viewMode=story';

const checkboxGroup = (region: Locator, index = 0) => region.locator('.animal-checkbox-group').nth(index);
const checkboxItem = (scope: Locator, text: string) =>
    scope.locator('.animal-checkbox-item').filter({ hasText: text }).first();
const clickCheckboxLabel = async (item: Locator, { force = false }: { force?: boolean } = {}) => {
    await item.locator('label').first().click({ force });
};

const openRadixSelect = async ({
    page,
    trigger,
    dropdown,
}: {
    page: Page;
    trigger: Locator;
    dropdown: Locator;
}) => {
    // Opening Radix overlays inside Storybook can be flaky when the preview is still hydrating.
    // Prefer the documented keyboard interaction (`Space`) and fall back to click if needed.
    // Guard the flow with Radix's `data-state="open"` so we don't race the portal mount.
    await expect(async () => {
        await page.keyboard.press('Escape');
        await trigger.scrollIntoViewIfNeeded();
        await trigger.focus();
        await page.keyboard.press('Space');
        await expect(trigger).toHaveAttribute('data-state', 'open', { timeout: 1000 });
        await expect(dropdown).toBeVisible({ timeout: 1000 });
        await expect(dropdown.locator('[data-highlighted]')).toHaveCount(1, { timeout: 1000 });
    }).toPass({ timeout: 10_000 });
};

test.describe('reference controls parity', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(storyUrl);
        await expect(page.getByTestId('switch-parity-region')).toBeVisible();
        await expect(page.getByTestId('checkbox-parity-region')).toBeVisible();
        await expect(page.getByTestId('select-parity-region')).toBeVisible();
        await expect(page.getByTestId('radio-parity-region')).toBeVisible();
        await expect(page.getByTestId('tooltip-parity-region')).toBeVisible();
    });

    test('covers Switch interactions', async ({ page }) => {
        await expect(page.getByTestId('switch-state-label')).toHaveText('OFF');
        await page.getByRole('switch').first().click();
        await expect(page.getByTestId('switch-state-label')).toHaveText('ON');
        await expect(page.getByText('开')).toBeVisible();
    });

    test('covers Checkbox states and styles', async ({ page }) => {
        const region = page.getByTestId('checkbox-parity-region');
        // There are multiple Checkbox groups (controlled/uncontrolled/size matrix) on the same page.
        // Scope stateful assertions to the first (controlled) group to avoid clicking a later story variant.
        const controlledGroup = checkboxGroup(region, 0);
        const beachItem = checkboxItem(controlledGroup, '🌊 海滩');
        const forestItem = checkboxItem(controlledGroup, '🌳 森林');
        const crabItem = checkboxItem(region, '🦀 螃蟹');
        const checkedBox = beachItem.getByRole('checkbox');
        const disabledBox = crabItem.getByRole('checkbox');

        await expect(page.getByTestId('checkbox-selected-label')).toContainText('海滩');
        // `locator.setChecked()` can be flaky for custom ARIA checkboxes if the React state update is
        // not committed by the time Playwright validates the state change. Prefer a click +
        // web-first assertion on `aria-checked` so Playwright can auto-retry.
        const forestBox = forestItem.getByRole('checkbox');
        await clickCheckboxLabel(forestItem, { force: true });
        await expect(forestBox).toHaveAttribute('aria-checked', 'true');
        await expect(page.getByTestId('checkbox-selected-label')).toContainText('森林');

        await expect(checkedBox).toHaveCSS('width', '22px');
        await expect(checkedBox).toHaveCSS('height', '22px');
        await expect(checkedBox).toHaveCSS('border-radius', '14px');
        await expect(checkedBox).toHaveCSS('border-color', 'rgb(80, 185, 171)');

        await expect(disabledBox).toHaveAttribute('aria-checked', 'false');
        await clickCheckboxLabel(crabItem, { force: true });
        await expect(disabledBox).toHaveAttribute('aria-checked', 'false');
        await expect(crabItem.locator('.animal-checkbox-label').first()).toHaveCSS('color', 'rgb(196, 184, 158)');
    });

    test('covers Select states and styles', async ({ page }) => {
        const selectDefault = page.getByTestId('select-default');
        const selectedFish = selectDefault.getByText('鲈鱼').first();
        const trigger = selectDefault.locator('.animal-select-trigger');
        const triggerBox = await trigger.boundingBox();

        expect(triggerBox?.height).toBeGreaterThanOrEqual(40);
        expect(triggerBox?.height).toBeLessThanOrEqual(44);
        await expect(selectedFish).toHaveCSS('font-size', '14px');
        await expect(page.getByText('请选择花朵')).toBeVisible();
        await expect(page.getByText('请选择水果')).toBeVisible();
        await expect(page.getByText('玫瑰')).toBeVisible();

        const dropdown = page.locator('.animal-select-content');
        await openRadixSelect({ page, trigger, dropdown });
        await dropdown.locator('.animal-select-item').filter({ hasText: '鲷鱼' }).first().click({ force: true });
        await expect(page.getByText('当前选中: 鲷鱼')).toBeVisible();
    });

    test('covers Select option with an empty string key', async ({ page }) => {
        await page.goto(emptyKeyStoryUrl);
        await expect(page.getByTestId('select-empty-key-label')).toContainText('空键选项');
        const selectBox = page.getByTestId('select-empty-key');
        const trigger = selectBox.locator('.animal-select-trigger');
        const dropdown = page.locator('.animal-select-content');

        await openRadixSelect({ page, trigger, dropdown });
        await expect(dropdown.locator('.animal-select-item')).toHaveCount(2);
        await dropdown.locator('.animal-select-item').filter({ hasText: '普通选项' }).first().click({ force: true });
        await expect(page.getByTestId('select-empty-key-label')).toContainText('普通选项');

        // Re-open and select the first (empty key) option again.
        await openRadixSelect({ page, trigger, dropdown });
        await expect(dropdown.locator('.animal-select-item')).toHaveCount(2);
        await dropdown.locator('.animal-select-item').filter({ hasText: '空键选项' }).first().click({ force: true });
        await expect(page.getByTestId('select-empty-key-label')).toContainText('空键选项');
    });

    test('covers Radio states and keyboard navigation', async ({ page }) => {
        const region = page.getByTestId('radio-parity-region');
        await expect(page.getByTestId('radio-selected-label')).toContainText('春天');

        const summer = region.locator('.animal-radio-item').filter({ hasText: '☀️ 夏天' }).first();
        await summer.click();
        await expect(page.getByTestId('radio-selected-label')).toContainText('夏天');
        await expect(summer.getByRole('radio')).toHaveAttribute('aria-checked', 'true');

        const checkedCircle = region.locator('.animal-radio-item.animal-radio-checked .animal-radio-circle').first();
        await expect(checkedCircle).toHaveCSS('background-color', 'rgb(25, 200, 185)');

        const firstRadio = region.getByRole('radio').first();
        await firstRadio.focus();
        await page.keyboard.press('ArrowRight');
        await expect(page.getByTestId('radio-selected-label')).toContainText('夏天');

        const disabledPear = region.locator('.animal-radio-item').filter({ hasText: '🍐 梨子' }).first();
        await expect(disabledPear.getByRole('radio')).toBeDisabled();
        await disabledPear.click({ force: true });
        await expect(disabledPear.getByRole('radio')).toHaveAttribute('aria-checked', 'false');
    });

    test('covers Tooltip triggers and variants', async ({ page }) => {
        const region = page.getByTestId('tooltip-parity-region');
        const hoverButton = region.getByRole('button', { name: 'hover default' });
        await hoverButton.hover();
        await expect(page.getByRole('tooltip').first()).toContainText('默认提示');

        const clickButton = region.getByRole('button', { name: 'click trigger' });
        await clickButton.click();
        await expect(page.getByRole('tooltip').filter({ hasText: '点击提示' })).toBeVisible();

        const islandTooltip = page.locator('.animal-tooltip.animal-tooltip-island').first();
        await region.getByRole('button', { name: 'island', exact: true }).hover();
        await expect(islandTooltip).toBeVisible();
        await expect(islandTooltip).toHaveCSS('max-width', '280px');
    });

    test('covers Switch state matrix including disabled and loading states', async ({ page }) => {
        await page.goto(matrixStoryUrl);
        await expect(page.getByTestId('switch-state-matrix-region')).toBeVisible();

        const switches = page.getByRole('switch');
        await expect(page.getByTestId('switch-controlled-state')).toHaveText('OFF');
        await switches.nth(0).click();
        await expect(page.getByTestId('switch-controlled-state')).toHaveText('ON');
        await switches.nth(0).click();
        await expect(page.getByTestId('switch-controlled-state')).toHaveText('OFF');
        await expect(switches.nth(1)).toHaveAttribute('aria-checked', 'true');
        await expect(switches.nth(2)).toHaveAttribute('aria-checked', 'true');
        expect((await switches.nth(2).boundingBox())?.height).toBeLessThan((await switches.nth(1).boundingBox())?.height ?? 0);
        await expect(switches.nth(3)).toBeDisabled();
        await expect(switches.nth(4)).toBeDisabled();
        await expect(switches.nth(5)).toHaveCSS('pointer-events', 'none');
        await expect(switches.nth(5)).toHaveAttribute('aria-checked', 'false');
        await expect(switches.nth(6)).toHaveCSS('pointer-events', 'none');
        await expect(switches.nth(6)).toHaveAttribute('aria-checked', 'true');
    });

    test('covers Checkbox state matrix including size, direction, numeric values, and disabled groups', async ({ page }) => {
        await page.goto(matrixStoryUrl);
        await expect(page.getByTestId('checkbox-state-matrix-region')).toBeVisible();

        const smallBox = checkboxItem(page.getByTestId('checkbox-size-small'), '🌳 森林').getByRole('checkbox').first();
        const middleBox = checkboxItem(page.getByTestId('checkbox-size-middle'), '🌊 海滩').getByRole('checkbox').first();
        const largeBox = checkboxItem(page.getByTestId('checkbox-size-large'), '🌸 花园').getByRole('checkbox').first();
        expect((await smallBox.boundingBox())?.width).toBeLessThan((await middleBox.boundingBox())?.width ?? 0);
        expect((await largeBox.boundingBox())?.width).toBeGreaterThan((await middleBox.boundingBox())?.width ?? 0);

        await expect(checkboxItem(page.getByTestId('checkbox-direction-disabled-matrix'), '🦀 螃蟹').getByRole('checkbox')).toHaveAttribute('aria-checked', 'false');
        await clickCheckboxLabel(checkboxItem(page.getByTestId('checkbox-direction-disabled-matrix'), '🦀 螃蟹'), { force: true });
        await expect(checkboxItem(page.getByTestId('checkbox-direction-disabled-matrix'), '🦀 螃蟹').getByRole('checkbox')).toHaveAttribute('aria-checked', 'false');

        await expect(page.getByTestId('checkbox-numeric-state')).toHaveText('101');
        const alphaBox = checkboxItem(page.getByTestId('checkbox-keyboard-matrix'), '文字 alpha')
            .getByRole('checkbox')
            .first();
        await alphaBox.setChecked(true);
        await expect(page.getByTestId('checkbox-numeric-state')).toContainText('alpha');
        await alphaBox.setChecked(false);
        await expect(page.getByTestId('checkbox-numeric-state')).toHaveText('101');
    });

    test('covers Select matrix and placement stories', async ({ page }) => {
        await page.goto(matrixStoryUrl);
        await expect(page.getByTestId('select-state-matrix-region')).toBeVisible();

        await expect(page.getByTestId('select-placeholder-state')).toHaveText('empty');
        await page.getByTestId('select-selected-matrix').getByText('秋菊').first().click();
        await expect(page.getByText('春樱').last()).toBeVisible();
        // Prefer Escape over click-away: Radix Select temporarily disables outside pointer events.
        await page.keyboard.press('Escape');
        await expect(page.getByText('春樱').last()).toHaveCount(0);
        await page.getByTestId('select-disabled-matrix').getByText('冬莓').click({ force: true });
        await expect(page.getByText('冬莓')).toBeVisible();

        await page.goto(placementStoryUrl);
        await expect(page.getByTestId('select-placement-region')).toBeVisible();
        await page.getByTestId('select-placement-right').getByText('春樱').click();
        await expect(page.getByText('冬莓').last()).toBeVisible();
        await page.keyboard.press('Escape');
        await page.getByTestId('select-placement-left').getByText('夏葵').click();
        await expect(page.getByText('秋菊').last()).toBeVisible();
    });
});
