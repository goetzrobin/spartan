import { STORY_ROOT, byText, checkA11y, expect, forceClick, gotoStory, test } from '../support';

test.describe('alert-dialog', () => {
	test.describe('default', () => {
		test.beforeEach(async ({ page }) => {
			await gotoStory(page, 'alert-dialog--default');
		});

		test('click on trigger should open, click on close should close, click outside should close', async ({ page }) => {
			await checkA11y(page, STORY_ROOT, {
				rules: {
					'page-has-heading-one': { enabled: false },
					'landmark-one-main': { enabled: false },
				},
			});

			await expect(byText(page, /delete account/i)).toHaveAttribute('aria-haspopup', 'dialog');
			await byText(page, /delete account/i).click();

			await expect(byText(page, /are you absolutely sure/i)).toHaveCount(1);
			await expect(page.getByRole('alertdialog')).toHaveCount(1);
			await expect(page.getByRole('alertdialog')).toHaveAttribute('aria-labelledby', 'brn-dialog-title-1');
			await expect(page.getByRole('alertdialog')).toHaveAttribute('aria-labelledby', 'brn-dialog-title-1');
			await expect(page.getByRole('alertdialog')).toHaveAttribute('aria-modal', 'true');
			await expect(page.getByRole('alertdialog')).toHaveAttribute('tabindex', '-1');

			await byText(page.getByRole('alertdialog'), /cancel/i).click();
			await expect(byText(page, /delete account/i)).toHaveCount(1);
			await expect(byText(page, /delete account/i).and(page.locator(':focus'))).toHaveCount(1);
			await byText(page, /delete account/i).click();

			// click outside of dialog
			await forceClick(page.locator('.cdk-overlay-backdrop'));
			await expect(byText(page, /delete account/i)).toHaveCount(2);
			await expect(byText(page, /delete account/i).and(page.locator(':focus'))).toHaveCount(0);

			// click cancel button
			await byText(page, /cancel/i).click();
			await expect(byText(page, /delete account/i)).toHaveCount(1);
			await expect(byText(page, /delete account/i).and(page.locator(':focus'))).toHaveCount(1);
		});
	});
});
