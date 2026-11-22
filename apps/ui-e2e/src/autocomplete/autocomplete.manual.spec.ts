import type { Page } from '@playwright/test';
import { caretToEnd, expect, gotoStory, test } from '../support';

async function typeIntoInput(page: Page, text: string): Promise<void> {
	const input = page.locator('input[hlmInputGroupInput]');
	await input.click();
	await caretToEnd(input);
	await input.pressSequentially(text);
}

test.describe('autocomplete', () => {
	test.describe('Default', () => {
		test.beforeEach(async ({ page }) => {
			await gotoStory(page, 'autocomplete--default');
		});

		test('should close popup when tabbing out', async ({ page }) => {
			await typeIntoInput(page, 'Mar');
			await expect(page.locator('hlm-autocomplete-content')).not.toHaveCount(0);
			await page.keyboard.press('Tab');
			await expect(page.locator('hlm-autocomplete-content')).toHaveCount(0);
		});

		test('should not select the highlighted option on tab out', async ({ page }) => {
			await typeIntoInput(page, 'Mar');
			await expect.poll(() => page.locator('hlm-autocomplete-item').count()).toBeGreaterThan(1);
			await page.keyboard.press('ArrowDown');
			await page.keyboard.press('Tab');
			await expect(page.locator('hlm-autocomplete-content')).toHaveCount(0);
			await expect(page.locator('input[hlmInputGroupInput]').first()).toHaveValue('Mar');
		});

		test('should select highlighted option on enter', async ({ page }) => {
			await typeIntoInput(page, 'Mar');
			await expect.poll(() => page.locator('hlm-autocomplete-item').count()).toBeGreaterThan(1);
			await page.keyboard.press('ArrowDown');
			await page.keyboard.press('Enter');
			await expect(page.locator('hlm-autocomplete-content')).toHaveCount(0);
			await expect(page.locator('input[hlmInputGroupInput]').first()).toHaveValue('Marty McFly');
		});
	});
});
