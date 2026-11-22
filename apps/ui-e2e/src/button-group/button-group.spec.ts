import type { Page } from '@playwright/test';
import { STORY_ROOT, checkA11y, expect, gotoStory, test } from '../support';

test.describe('button-group', () => {
	const verifyButtonGroupSetup = async (page: Page) => {
		await expect(page.locator('[hlmButtonGroup]')).not.toHaveCount(0);
	};

	const verifyButtonInteraction = async (page: Page, buttonIndex: number, expectedText: string) => {
		await expect(page.locator('[hlmButtonGroup] button').nth(buttonIndex)).toContainText(expectedText);
		await expect(page.locator('[hlmButtonGroup] button').nth(buttonIndex)).not.toBeDisabled();
		await page.locator('[hlmButtonGroup] button').nth(buttonIndex).click();
		await expect(page.locator('[hlmButtonGroup] button').nth(buttonIndex)).toBeFocused();
	};

	const testKeyboardNavigation = async (page: Page) => {
		await page.locator('[hlmButtonGroup] button').first().focus();
		await expect(page.locator('[hlmButtonGroup] button').first()).toBeFocused();

		await page.keyboard.press('Tab');
		await expect(page.locator('[hlmButtonGroup] button').nth(1)).toBeFocused();

		await page.keyboard.press('Enter');
		await expect(page.locator('[hlmButtonGroup] button').nth(1)).toBeFocused();

		await page.keyboard.press('Space');
		await expect(page.locator('[hlmButtonGroup] button').nth(1)).toBeFocused();
	};

	test.describe('Default Button Group', () => {
		test.beforeEach(async ({ page }) => {
			await gotoStory(page, 'button-group--default');
		});

		test('should render the default button group correctly', async ({ page }) => {
			await verifyButtonGroupSetup(page);

			await expect(
				page
					.locator('[hlmButtonGroup] button')
					.first()
					.getByText(/Button\s+1/)
					.first(),
			).not.toHaveCount(0);
			await expect(
				page
					.locator('[hlmButtonGroup] button')
					.last()
					.getByText(/Button\s+2/)
					.first(),
			).not.toHaveCount(0);
		});

		test('should support button interactions', async ({ page }) => {
			await verifyButtonInteraction(page, 0, 'Button 1');
			await verifyButtonInteraction(page, 1, 'Button 2');
		});

		test('should support keyboard navigation', async ({ page }) => {
			await testKeyboardNavigation(page);
		});

		test('should maintain proper focus management', async ({ page }) => {
			await page.locator('[hlmButtonGroup] button').first().focus();
			await page.keyboard.press('Tab');
			await expect(page.locator('[hlmButtonGroup] button').nth(1)).toBeFocused();

			await page.keyboard.press('Shift+Tab');
			await expect(page.locator('[hlmButtonGroup] button').first()).toBeFocused();
		});
	});

	test.describe('Split Button Group', () => {
		test.beforeEach(async ({ page }) => {
			await gotoStory(page, 'button-group--split');
		});

		test('should render the split button group correctly', async ({ page }) => {
			await verifyButtonGroupSetup(page);

			await expect(page.locator('hlm-button-group-separator')).not.toHaveCount(0);
			await expect(page.locator('hlm-button-group-separator')).toBeVisible();
		});

		test('should maintain accessibility with separator', async ({ page }) => {
			await checkA11y(page, STORY_ROOT, {
				rules: {
					'page-has-heading-one': { enabled: false },
					'landmark-one-main': { enabled: false },
				},
			});
		});
	});

	test.describe('Nested Button Group', () => {
		test.beforeEach(async ({ page }) => {
			await gotoStory(page, 'button-group--nested');
		});

		test('should render nested button groups correctly', async ({ page }) => {
			await verifyButtonGroupSetup(page);

			await expect(page.locator('[hlmButtonGroup]')).toHaveCount(3);
			await expect(page.locator('[hlmButtonGroup] [hlmButtonGroup]')).toHaveCount(2);
		});

		test('should have all buttons in nested groups', async ({ page }) => {
			await expect(page.locator('[hlmButtonGroup] button')).toHaveCount(4);

			await expect(page.locator('[hlmButtonGroup] button').nth(0)).toContainText('Button 1');
			await expect(page.locator('[hlmButtonGroup] button').nth(1)).toContainText('Button 2');
			await expect(page.locator('[hlmButtonGroup] button').nth(2)).toContainText('Button 3');
			await expect(page.locator('[hlmButtonGroup] button').nth(3)).toContainText('Button 4');
		});
	});

	test.describe('WithText Button Group', () => {
		test.beforeEach(async ({ page }) => {
			await gotoStory(page, 'button-group--with-text');
		});

		test('should render button group with text correctly', async ({ page }) => {
			await verifyButtonGroupSetup(page);

			await expect(page.locator('[hlmButtonGroup]')).toHaveCount(3);
			await expect(page.locator('[hlmButtonGroup] [hlmButtonGroup]')).toHaveCount(2);

			await expect(page.locator('[hlmButtonGroup] button')).toHaveCount(2);
			await expect(page.locator('[hlmButtonGroup] button').first()).toContainText('Button 1');
			await expect(page.locator('[hlmButtonGroup] button').last()).toContainText('Button 2');
		});

		test('should have separator and text element', async ({ page }) => {
			await expect(page.locator('hlm-button-group-separator')).not.toHaveCount(0);
			await expect(page.locator('hlm-button-group-separator')).toBeVisible();

			await expect(page.locator('[hlmButtonGroupText]')).not.toHaveCount(0);
			await expect(page.locator('[hlmButtonGroupText]')).toBeVisible();
			await expect(page.locator('[hlmButtonGroupText]').filter({ hasText: /Text/ })).not.toHaveCount(0);
		});

		test('should support button interactions with text element', async ({ page }) => {
			await verifyButtonInteraction(page, 0, 'Button 1');
			await verifyButtonInteraction(page, 1, 'Button 2');

			await expect(page.locator('[hlmButtonGroupText]').first()).not.toHaveAttribute('tabindex');
			await expect(page.locator('[hlmButtonGroupText]').first()).not.toHaveAttribute('role', 'button');
		});

		test('should maintain proper keyboard navigation with text', async ({ page }) => {
			await page.locator('[hlmButtonGroup] button').first().focus();
			await expect(page.locator('[hlmButtonGroup] button').first()).toBeFocused();

			await page.keyboard.press('Tab');
			await expect(page.locator('[hlmButtonGroup] button').last()).toBeFocused();

			await expect(page.locator('[hlmButtonGroupText]').and(page.locator(':focus'))).toHaveCount(0);
		});

		test('should maintain accessibility with text element', async ({ page }) => {
			await checkA11y(page, STORY_ROOT, {
				rules: {
					'page-has-heading-one': { enabled: false },
					'landmark-one-main': { enabled: false },
				},
			});

			await expect(page.locator('[hlmButtonGroupText]')).toBeVisible();
			await expect(page.locator('[hlmButtonGroupText]').first()).not.toHaveAttribute('aria-hidden', 'true');
		});
	});

	test.describe('Button Group Visual and Layout Tests', () => {
		test.beforeEach(async ({ page }) => {
			await gotoStory(page, 'button-group--default');
		});

		test('should be responsive', async ({ page }) => {
			await page.setViewportSize({ width: 1200, height: 800 });
			await expect(page.locator('[hlmButtonGroup]')).toBeVisible();
			await expect(page.locator('[hlmButtonGroup] button')).toHaveCount(2);

			await page.setViewportSize({ width: 768, height: 600 });
			await expect(page.locator('[hlmButtonGroup]')).toBeVisible();
			await expect(page.locator('[hlmButtonGroup] button')).toHaveCount(2);

			await page.setViewportSize({ width: 375, height: 667 });
			await expect(page.locator('[hlmButtonGroup]')).toBeVisible();
			await expect(page.locator('[hlmButtonGroup] button')).toHaveCount(2);
		});
	});

	test.describe('Button Group Accessibility Tests', () => {
		test.beforeEach(async ({ page }) => {
			await gotoStory(page, 'button-group--default');
		});

		test('should meet WCAG accessibility standards', async ({ page }) => {
			await checkA11y(page, STORY_ROOT, {
				rules: {
					'page-has-heading-one': { enabled: false },
					'landmark-one-main': { enabled: false },
				},
			});
		});
	});
});
