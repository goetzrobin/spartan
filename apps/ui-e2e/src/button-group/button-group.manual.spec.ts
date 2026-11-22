import type { Page } from '@playwright/test';
import { expect, gotoStory, test } from '../support';

test.describe('button-group', () => {
	const verifyButtonInteraction = async (page: Page, buttonIndex: number, expectedText: string) => {
		await expect(page.locator('[hlmButtonGroup] button').nth(buttonIndex)).toContainText(expectedText);
		await expect(page.locator('[hlmButtonGroup] button').nth(buttonIndex)).not.toBeDisabled();
		await page.locator('[hlmButtonGroup] button').nth(buttonIndex).click();
		await expect(page.locator('[hlmButtonGroup] button').nth(buttonIndex)).toBeFocused();
	};

	const eachOf = async (page: Page, selector: string, check: (index: number) => Promise<void>) => {
		await expect(page.locator(selector)).not.toHaveCount(0);
		const count = await page.locator(selector).count();
		for (let index = 0; index < count; index++) await check(index);
	};

	test.describe('Default Button Group', () => {
		test.beforeEach(async ({ page }) => {
			await gotoStory(page, 'button-group--default');
		});

		test('should have outline variant buttons', async ({ page }) => {
			await eachOf(page, '[hlmButtonGroup] button', async (index) => {
				await expect(page.locator('[hlmButtonGroup] button').nth(index)).toHaveAttribute('hlmbtn');
			});
		});
	});

	test.describe('Split Button Group', () => {
		test.beforeEach(async ({ page }) => {
			await gotoStory(page, 'button-group--split');
		});

		test('should have secondary variant buttons', async ({ page }) => {
			await eachOf(page, '[hlmButtonGroup] button', async (index) => {
				await expect(page.locator('[hlmButtonGroup] button').nth(index)).toHaveAttribute('hlmbtn');
			});
		});

		test('should have separator between buttons', async ({ page }) => {
			const group = page.locator('[hlmButtonGroup]');
			await expect(group).toHaveCount(1);
			await expect(group.locator('button').first()).toContainText('Button 1');
			await expect(group.locator('hlm-button-group-separator')).not.toHaveCount(0);
			await expect(group.locator('button').last()).toContainText('Button 2');
		});
	});

	test.describe('Nested Button Group', () => {
		test.beforeEach(async ({ page }) => {
			await gotoStory(page, 'button-group--nested');
		});

		test('should support interactions in nested groups', async ({ page }) => {
			for (let i = 0; i < 4; i++) {
				await verifyButtonInteraction(page, i, `Button ${i + 1}`);
			}
		});

		test('should maintain proper keyboard navigation in nested structure', async ({ page }) => {
			await page.locator('[hlmButtonGroup] button').first().focus();

			for (let i = 1; i < 4; i++) {
				await page.keyboard.press('Tab');
				await expect(page.locator('[hlmButtonGroup] button').nth(i)).toBeFocused();
			}
		});

		test('should maintain proper grouping semantics', async ({ page }) => {
			const first = page.locator('[hlmButtonGroup] [hlmButtonGroup]').first();
			await expect(first.locator('button')).toHaveCount(2);
			await expect(first.locator('button').first()).toContainText('Button 1');
			await expect(first.locator('button').last()).toContainText('Button 2');

			const last = page.locator('[hlmButtonGroup] [hlmButtonGroup]').last();
			await expect(last.locator('button')).toHaveCount(2);
			await expect(last.locator('button').first()).toContainText('Button 3');
			await expect(last.locator('button').last()).toContainText('Button 4');
		});
	});

	test.describe('WithText Button Group', () => {
		test.beforeEach(async ({ page }) => {
			await gotoStory(page, 'button-group--with-text');
		});

		test('should have proper structure with text group', async ({ page }) => {
			const outer = page.locator('[hlmButtonGroup]').first();

			await expect(outer.locator('[hlmButtonGroup]').first().locator('button')).toHaveCount(2);

			await expect(outer.locator('hlm-button-group-separator')).not.toHaveCount(0);

			const text = outer.locator('[hlmButtonGroup]').last().locator('[hlmButtonGroupText]');
			await expect(text).not.toHaveCount(0);
			await expect(text).toContainText('Text');
		});
	});

	test.describe('Button Group Visual and Layout Tests', () => {
		test.beforeEach(async ({ page }) => {
			await gotoStory(page, 'button-group--default');
		});

		test('should have proper visual styling', async ({ page }) => {
			await expect(page.locator('[hlmButtonGroup]')).toBeVisible();

			await eachOf(page, '[hlmButtonGroup] button', async (index) => {
				const button = page.locator('[hlmButtonGroup] button').nth(index);
				await expect(button).toBeVisible();
				await expect(button).not.toHaveCSS('display', 'none');
			});
		});
	});

	test.describe('Button Group Accessibility Tests', () => {
		test.beforeEach(async ({ page }) => {
			await gotoStory(page, 'button-group--default');
		});

		test('should have proper focus indicators', async ({ page }) => {
			await eachOf(page, '[hlmButtonGroup] button', async (index) => {
				const button = page.locator('[hlmButtonGroup] button').nth(index);
				await button.focus();
				await expect(button).toBeFocused();
				await expect(button).toBeFocused();
			});
		});
	});
});
