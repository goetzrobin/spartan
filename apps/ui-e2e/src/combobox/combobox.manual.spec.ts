import { byText, expect, gotoStory, test } from '../support';

test.describe('combobox--default', () => {
	test.describe('default', () => {
		test.beforeEach(async ({ page }) => {
			await gotoStory(page, 'combobox--default');
		});

		test('should open the framework dropdown, and the list should be scrollable', async ({ page }) => {
			await expect(byText(page, /Angular/i)).toHaveCount(0);
			await expect(page.locator('input[placeholder="Select framework..."]')).toBeVisible();
			await page.locator('input[placeholder="Select framework..."]').click({ force: true });
			const listbox = page.locator('[role="listbox"]').first();
			await expect(listbox).toBeAttached();
			await expect
				.poll(() => listbox.evaluate((element) => element.scrollHeight - element.clientHeight))
				.toBeGreaterThan(0);
		});

		test('clicking outside should close the content', async ({ page }) => {
			await expect(page.locator('input[placeholder="Select framework..."]')).toBeVisible();
			await page.locator('input[placeholder="Select framework..."]').click({ force: true });
			await expect(byText(page, 'Angular')).toBeVisible();
			await page.locator('body').click({ position: { x: 0, y: 0 }, force: true });
			await expect(byText(page, 'Angular')).toHaveCount(0);
		});
	});
});

test.describe('combobox--popup', () => {
	test.beforeEach(async ({ page }) => {
		await gotoStory(page, 'combobox--popup');
	});

	test('clicking outside should close the content', async ({ page }) => {
		await page.locator('hlm-combobox-trigger button').click({ force: true });
		await expect(byText(page, 'Angular')).toBeVisible();
		await page.locator('body').click({ position: { x: 0, y: 0 }, force: true });
		await expect(byText(page, 'Angular')).toHaveCount(0);
	});
});
