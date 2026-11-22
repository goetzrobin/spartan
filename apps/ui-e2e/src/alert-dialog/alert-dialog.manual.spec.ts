import type { Page } from '@playwright/test';
import { STORY_ROOT, byText, checkA11y, expect, gotoStory, test } from '../support';

test.describe('alert-dialog', () => {
	test.describe('default', () => {
		test.beforeEach(async ({ page }) => {
			await gotoStory(page, 'alert-dialog--default');
		});

		const opensAndCloses =
			(key: 'Enter' | 'Space') =>
			async ({ page }: { page: Page }) => {
				await checkA11y(page, STORY_ROOT, {
					rules: {
						'page-has-heading-one': { enabled: false },
						'landmark-one-main': { enabled: false },
					},
				});

				const trigger = page.locator('#delete-account');
				const dialog = page.getByRole('alertdialog');

				await expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
				await page.keyboard.press('Tab');
				await page.keyboard.press(key);

				await expect(byText(page, /are you absolutely sure/i)).toHaveCount(1);
				await expect(dialog).toHaveAttribute('aria-labelledby', 'brn-dialog-title-1');
				await expect(dialog).toHaveAttribute('aria-modal', 'true');
				await expect(dialog).toHaveAttribute('tabindex', '-1');

				await expect(dialog.getByRole('button', { name: 'Cancel' })).toBeFocused();
				await page.keyboard.press(key);
				await expect(dialog).toHaveCount(0);
				await expect(trigger).toBeFocused();

				await page.keyboard.press(key);
				await expect(dialog).toHaveCount(1);
				await expect(dialog.getByRole('button', { name: 'Cancel' })).toBeFocused();

				await page.keyboard.press('Escape');
				await expect(dialog).toHaveCount(0);
				await expect(trigger).toBeFocused();
			};

		test(
			'tab and enter on trigger should open, enter on cancel should close, escape should not close',
			opensAndCloses('Enter'),
		);
		test(
			'tab and space on trigger should open, tabs should wrap, space on cancel should close',
			opensAndCloses('Space'),
		);
	});
});
