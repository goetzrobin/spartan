// Two tests from apps/ui-storybook-e2e/src/integration/alert-dialog/alert-dialog.cy.ts, corrected
// by hand. Titles match the originals so the transform leaves them out of alert-dialog.spec.ts.
//
// The originals end with: press Escape, then expect the dialog text to still be there, with the
// comment "escape is disabled for alert dialogs, so it should stay open". That is not what
// happens. Escape closes an alert dialog (as it does in Radix and Base UI; only a click outside is
// ignored). The Cypress assertions ran in the instant before the closing animation removed the
// dialog, so they passed without checking what the comment says.
//
// These versions assert what the component does: Escape closes it and focus returns to the trigger.
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

				// Cancel has focus when the dialog opens, so the same key closes it again.
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
