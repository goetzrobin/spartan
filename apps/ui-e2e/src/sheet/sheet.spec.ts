import { STORY_ROOT, byText, checkA11y, expect, forceClick, gotoStory, test } from '../support';

test.describe('sheet--default', () => {
	test.describe('default', () => {
		test.beforeEach(async ({ page }) => {
			await gotoStory(page, 'sheet--default');
		});

		test('click on trigger should open, click on close should close, click outside should close', async ({ page }) => {
			await checkA11y(page, STORY_ROOT, {
				rules: {
					'page-has-heading-one': { enabled: false },
					'landmark-one-main': { enabled: false },
				},
			});

			await expect(byText(page, /edit profile/i)).toHaveAttribute('aria-haspopup', 'dialog');
			await byText(page, /edit profile/i).click();

			await expect(byText(page, /edit profile/i)).toHaveCount(2);
			await expect(page.getByRole('dialog')).toHaveCount(1);
			await expect(page.getByRole('dialog')).toHaveAttribute('aria-labelledby', 'brn-dialog-title-1');
			await expect(page.getByRole('dialog')).toHaveAttribute('aria-labelledby', 'brn-dialog-title-1');
			await expect(page.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
			await expect(page.getByRole('dialog')).toHaveAttribute('tabindex', '-1');

			await page.locator('button[data-slot="sheet-close"]').click();
			await expect(byText(page, /edit profile/i)).toHaveCount(1);
			await expect(byText(page, /edit profile/i).and(page.locator(':focus'))).toHaveCount(1);
			await byText(page, /edit profile/i).click();

			// click outside of dialog
			await forceClick(page.locator('.cdk-overlay-backdrop'));
			await expect(byText(page, /edit profile/i)).toHaveCount(1);
			await expect(byText(page, /edit profile/i).and(page.locator(':focus'))).toHaveCount(1);
		});

		test('tab and enter on trigger should open, enter on close should close, escape should close', async ({ page }) => {
			await checkA11y(page, STORY_ROOT, {
				rules: {
					'page-has-heading-one': { enabled: false },
					'landmark-one-main': { enabled: false },
				},
			});

			await expect(byText(page, /edit profile/i)).toHaveAttribute('aria-haspopup', 'dialog');
			await page.keyboard.press('Tab');
			await page.keyboard.press('Enter');

			await expect(byText(page, /edit profile/i)).toHaveCount(2);
			await expect(page.getByRole('dialog')).toHaveCount(1);
			await expect(page.getByRole('dialog')).toHaveAttribute('aria-labelledby', 'brn-dialog-title-1');
			await expect(page.getByRole('dialog')).toHaveAttribute('aria-labelledby', 'brn-dialog-title-1');
			await expect(page.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
			await expect(page.getByRole('dialog')).toHaveAttribute('tabindex', '-1');

			await page.keyboard.press('Shift+Tab');
			await page.keyboard.press('Enter');
			await expect(byText(page, /edit profile/i)).toHaveCount(1);
			await expect(byText(page, /edit profile/i).and(page.locator(':focus'))).toHaveCount(1);
			await page.keyboard.press('Enter');

			// click escape when dialog open
			await page.keyboard.press('Escape');
			await expect(byText(page, /edit profile/i)).toHaveCount(1);
			await expect(byText(page, /edit profile/i).and(page.locator(':focus'))).toHaveCount(1);
		});

		test('tab and space on trigger should open, tabs should wrap, space on close should close', async ({ page }) => {
			await checkA11y(page, STORY_ROOT, {
				rules: {
					'page-has-heading-one': { enabled: false },
					'landmark-one-main': { enabled: false },
				},
			});

			await expect(byText(page, /edit profile/i)).toHaveAttribute('aria-haspopup', 'dialog');
			await page.keyboard.press('Tab');
			await page.keyboard.press('Space');

			await expect(byText(page, /edit profile/i)).toHaveCount(2);
			await expect(page.getByRole('dialog')).toHaveCount(1);
			await expect(page.getByRole('dialog')).toHaveAttribute('aria-labelledby', 'brn-dialog-title-1');
			await expect(page.getByRole('dialog')).toHaveAttribute('aria-labelledby', 'brn-dialog-title-1');
			await expect(page.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
			await expect(page.getByRole('dialog')).toHaveAttribute('tabindex', '-1');

			await page.keyboard.press('Tab');
			await page.keyboard.press('Tab');
			await page.keyboard.press('Tab');
			await page.keyboard.press('Space');
			await expect(byText(page, /edit profile/i)).toHaveCount(1);
			await expect(byText(page, /edit profile/i).and(page.locator(':focus'))).toHaveCount(1);
			await page.keyboard.press('Space');

			// click escape when dialog open
			await page.keyboard.press('Escape');
			await expect(byText(page, /edit profile/i)).toHaveCount(1);
			await expect(byText(page, /edit profile/i).and(page.locator(':focus'))).toHaveCount(1);
		});
	});
});
