// Ported by hand from apps/ui-storybook-e2e/src/integration/button-group/button-group.cy.ts.
// These tests loop over the buttons (`.each` or a for loop) or scope their queries with `.within`,
// which the transform does not convert. Titles match the originals so the transform leaves them
// out of button-group.spec.ts.
import type { Page } from '@playwright/test';
import { expect, gotoStory, test } from '../support';

test.describe('button-group', () => {
	const verifyButtonInteraction = async (page: Page, buttonIndex: number, expectedText: string) => {
		await expect(page.locator('[hlmButtonGroup] button').nth(buttonIndex)).toContainText(expectedText);
		await expect(page.locator('[hlmButtonGroup] button').nth(buttonIndex)).not.toBeDisabled();
		await page.locator('[hlmButtonGroup] button').nth(buttonIndex).click();
		// Verify button can be focused and activated
		await expect(page.locator('[hlmButtonGroup] button').nth(buttonIndex)).toBeFocused();
	};

	/** `cy.get(selector).each(...)`: waits for at least one match, then runs `check` on each. */
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
				// Note: The actual variant attribute might not be directly visible in DOM,
				// but we can verify the buttons have the expected styling
			});
		});

		test('should have separator between buttons', async ({ page }) => {
			// Check that separator is positioned between buttons
			// `.within` needs exactly one element to search in.
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
			// Test each button in nested groups
			for (let i = 0; i < 4; i++) {
				await verifyButtonInteraction(page, i, `Button ${i + 1}`);
			}
		});

		test('should maintain proper keyboard navigation in nested structure', async ({ page }) => {
			// Focus first button
			await page.locator('[hlmButtonGroup] button').first().focus();

			// Navigate through all buttons
			for (let i = 1; i < 4; i++) {
				await page.keyboard.press('Tab');
				await expect(page.locator('[hlmButtonGroup] button').nth(i)).toBeFocused();
			}
		});

		test('should maintain proper grouping semantics', async ({ page }) => {
			// Verify that nested groups maintain their individual identity
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

			// First nested group should have buttons
			await expect(outer.locator('[hlmButtonGroup]').first().locator('button')).toHaveCount(2);

			// Separator should exist
			await expect(outer.locator('hlm-button-group-separator')).not.toHaveCount(0);

			// Second nested group should have text
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
			// Verify buttons are visually grouped together
			await expect(page.locator('[hlmButtonGroup]')).toBeVisible();

			// Check that buttons appear as a cohesive group
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
				// Verify focus is visible (this would typically check for focus ring styles)
				await expect(button).toBeFocused();
			});
		});
	});
});
