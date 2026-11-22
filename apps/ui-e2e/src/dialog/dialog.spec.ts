import { STORY_ROOT, byText, checkA11y, expect, forceClick, gotoStory, test } from '../support';

test.describe('dialog--default', () => {
	test.describe('default', () => {
		test.beforeEach(async ({ page }) => {
			await gotoStory(page, 'dialog--default');
		});

		test('click on trigger should open, click on close should close, click outside should close', async ({ page }) => {
			await checkA11y(page, STORY_ROOT, {
				rules: {
					'page-has-heading-one': { enabled: false },
					'landmark-one-main': { enabled: false },
				},
			});

			await expect(byText(page, /edit profile/i)).toHaveAttribute('aria-haspopup', 'dialog');
			await expect(byText(page, /edit profile/i)).toHaveAttribute('aria-expanded', 'false');
			await byText(page, /edit profile/i).click();

			await expect(byText(page, /edit profile/i)).toHaveCount(2);
			await expect(byText(page, /edit profile/i).first()).toHaveAttribute('aria-expanded', 'true');
			await expect(page.getByRole('dialog')).toHaveCount(1);
			await expect(page.getByRole('dialog')).toHaveAttribute('aria-labelledby', 'brn-dialog-title-1');
			await expect(page.getByRole('dialog')).toHaveAttribute('aria-labelledby', 'brn-dialog-title-1');
			await expect(page.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
			await expect(page.getByRole('dialog')).toHaveAttribute('tabindex', '-1');

			await page.locator('button[data-slot="dialog-close"]').click();
			await expect(byText(page, /edit profile/i)).toHaveCount(1);
			await expect(byText(page, /edit profile/i).and(page.locator(':focus'))).toHaveCount(1);
			await byText(page, /edit profile/i).click();

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

			await page.keyboard.press('Escape');
			await expect(byText(page, /edit profile/i)).toHaveCount(1);
			await expect(byText(page, /edit profile/i).and(page.locator(':focus'))).toHaveCount(1);
		});
	});

	test.describe('nested dialog', () => {
		test.beforeEach(async ({ page }) => {
			await gotoStory(page, 'dialog--nested-dialog');
		});

		test('click on trigger should open the first dialog, click on button inside first dialog should open a nested dialog, click on button inside nested dialog closes nested dialog', async ({
			page,
		}) => {
			await expect(byText(page, /open dialog/i)).toHaveAttribute('aria-haspopup', 'dialog');
			await byText(page, /open dialog/i).click();

			await expect(page.locator('#brn-dialog-1')).not.toHaveCount(0);
			await expect(page.locator('#brn-dialog-1')).toHaveAttribute('aria-labelledby', 'brn-dialog-title-1');
			await expect(page.locator('#brn-dialog-1')).toHaveAttribute('aria-labelledby', 'brn-dialog-title-1');
			await expect(page.locator('#brn-dialog-1')).toHaveAttribute('aria-modal', 'true');
			await expect(page.locator('#brn-dialog-1')).toHaveAttribute('tabindex', '-1');

			await expect(byText(page, /first dialog/i)).toHaveCount(1);
			await expect(byText(page, /open nested dialog/i)).toHaveAttribute('aria-haspopup', 'dialog');
			await byText(page, /open nested dialog/i).click();

			await expect(page.locator('#brn-dialog-2')).not.toHaveCount(0);
			await expect(page.locator('#brn-dialog-2')).toHaveAttribute('aria-labelledby', 'brn-dialog-title-2');
			await expect(page.locator('#brn-dialog-2')).toHaveAttribute('aria-labelledby', 'brn-dialog-title-2');
			await expect(page.locator('#brn-dialog-2')).toHaveAttribute('aria-modal', 'true');
			await expect(page.locator('#brn-dialog-2')).toHaveAttribute('tabindex', '-1');

			await byText(page.locator('#brn-dialog-2'), /close nested dialog/i).click();

			await expect(page.locator('.cdk-overlay-backdrop')).toHaveCount(1);
			await forceClick(page.locator('.cdk-overlay-backdrop'));

			await expect(byText(page, /open dialog/i)).toHaveCount(1);
			await expect(byText(page, /open dialog/i).and(page.locator(':focus'))).toHaveCount(1);
		});
	});

	test.describe('context menu', () => {
		test.beforeEach(async ({ page }) => {
			await gotoStory(page, 'dialog--context-menu');
			await page.setViewportSize({ width: 1000, height: 1000 });
		});

		test('opens and renders dialog content when launched from a context menu item', async ({ page }) => {
			await checkA11y(page, STORY_ROOT, {
				rules: {
					'page-has-heading-one': { enabled: false },
					'landmark-one-main': { enabled: false },
				},
			});

			await byText(page, /right click here/i).click({ button: 'right', force: true });
			await expect(page.getByRole('menu')).toBeVisible();
			await byText(page, /^print$/i).click({ force: true });

			await expect(page.getByRole('dialog', { name: /print this page/i })).toBeVisible();
			await expect(byText(page, /are you sure you want to print this page/i)).toBeVisible();
			await expect(page.getByRole('button', { name: /cancel/i })).toBeVisible();
		});
	});
});

test.describe('dialog--dynamic-component', () => {
	test.describe('dynamic-component', () => {
		test.beforeEach(async ({ page }) => {
			await gotoStory(page, 'dialog--dynamic-component');
		});

		test('click on button should open dynamic component, click on close should close, click outside should close', async ({
			page,
		}) => {
			await byText(page, /select user/i).click();
			await expect(page.getByRole('dialog')).toHaveCount(1);
			await expect(page.getByRole('dialog')).toHaveAttribute('aria-labelledby', 'brn-dialog-title-1');
			await expect(page.getByRole('dialog')).toHaveAttribute('aria-labelledby', 'brn-dialog-title-1');
			await expect(page.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
			await expect(page.getByRole('dialog')).toHaveAttribute('tabindex', '-1');
			await expect(page.getByRole('dialog').getByRole('button', { name: /^close$/i })).not.toHaveCount(0);
			await expect(page.locator('dynamic-content')).not.toHaveCount(0);

			await page.locator('button[data-slot="dialog-close"]').click();
			await expect(byText(page, /select user/i)).toHaveCount(1);
			await expect(byText(page, /select user/i).and(page.locator(':focus'))).toHaveCount(1);
			await byText(page, /select user/i).click();

			await expect(page.locator('dynamic-content')).not.toHaveCount(0);
			await forceClick(page.locator('.cdk-overlay-backdrop'));
			await expect(byText(page, /select user/i)).toHaveCount(1);
			await expect(byText(page, /select user/i).and(page.locator(':focus'))).toHaveCount(1);
		});

		test('click on teams button should open dynamic component without close button', async ({ page }) => {
			await byText(page, /select team/i).click();
			await expect(page.getByRole('dialog')).toHaveCount(1);
			await expect(page.getByRole('dialog').getByRole('button', { name: /^close$/i })).toHaveCount(0);
		});
	});

	test.describe('nested dialog', () => {
		test.beforeEach(async ({ page }) => {
			await gotoStory(page, 'dialog--nested-dynamic-component');
		});

		test('click on trigger should open the first dialog, click on button inside first dialog should open a nested dialog, click on button inside nested dialog closes nested dialog', async ({
			page,
		}) => {
			await byText(page, /open dialog/i).click();

			await expect(page.locator('#brn-dialog-1')).not.toHaveCount(0);
			await expect(page.locator('#brn-dialog-1')).toHaveAttribute('aria-labelledby', 'brn-dialog-title-1');
			await expect(page.locator('#brn-dialog-1')).toHaveAttribute('aria-labelledby', 'brn-dialog-title-1');
			await expect(page.locator('#brn-dialog-1')).toHaveAttribute('aria-modal', 'true');
			await expect(page.locator('#brn-dialog-1')).toHaveAttribute('tabindex', '-1');

			await expect(byText(page, /first dialog/i)).toHaveCount(1);
			await byText(page, /open nested dialog/i).click();

			await expect(page.locator('#brn-dialog-2')).not.toHaveCount(0);
			await expect(page.locator('#brn-dialog-2')).toHaveAttribute('aria-labelledby', 'brn-dialog-title-2');
			await expect(page.locator('#brn-dialog-2')).toHaveAttribute('aria-labelledby', 'brn-dialog-title-2');
			await expect(page.locator('#brn-dialog-2')).toHaveAttribute('aria-modal', 'true');
			await expect(page.locator('#brn-dialog-2')).toHaveAttribute('tabindex', '-1');

			await byText(page.locator('#brn-dialog-2'), /close nested dialog/i).click();

			await expect(page.locator('.cdk-overlay-backdrop')).toHaveCount(1);
			await forceClick(page.locator('.cdk-overlay-backdrop'));

			await expect(byText(page, /open dialog/i)).toHaveCount(1);
			await expect(byText(page, /open dialog/i).and(page.locator(':focus'))).toHaveCount(1);
		});
	});
});
