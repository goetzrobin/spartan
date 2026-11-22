import { STORY_ROOT, byText, checkA11y, expect, gotoStory, test } from '../support';

test.describe('dropdown-menu', () => {
	test.describe('default', () => {
		test.beforeEach(async ({ page }) => {
			await gotoStory(page, 'dropdown-menu--default');
			await page.setViewportSize({ width: 1000, height: 1000 });
		});

		test('click on open button should open, menu item GitHub that has [disabled]="false" should not be disabled. Support that has [disabled]="true" should be disabled', async ({
			page,
		}) => {
			await checkA11y(page, STORY_ROOT, {
				rules: {
					'page-has-heading-one': { enabled: false },
					'landmark-one-main': { enabled: false },
				},
			});

			await byText(page, /open/i).click({ force: true });

			await expect(byText(page, /github/i).locator('..')).not.toBeDisabled();

			await expect(byText(page, /support/i).locator('..')).toBeDisabled();
		});

		test('click on open button should open, hover over sub menu should open submenu, and click on open button again should close', async ({
			page,
		}) => {
			await checkA11y(page, STORY_ROOT, {
				rules: {
					'page-has-heading-one': { enabled: false },
					'landmark-one-main': { enabled: false },
				},
			});

			await expect(byText(page, /open/i)).toHaveAttribute('aria-expanded', 'false');
			await byText(page, /open/i).click({ force: true });
			await expect(byText(page, /open/i)).toHaveAttribute('aria-expanded', 'true');

			await expect(page.getByRole('menu')).toHaveCount(1);

			await byText(page, /invite users/i).hover({ force: true });

			await expect(page.getByRole('menu')).toHaveCount(2);

			await byText(page, /more/i).hover({ force: true });

			await byText(page, /open/i).click({ force: true });
			await expect(byText(page, /open/i)).toHaveAttribute('aria-expanded', 'false');
		});
	});

	test.describe('submenu (issue #1333)', () => {
		test.beforeEach(async ({ page }) => {
			await gotoStory(page, 'dropdown-menu--submenu');
			await page.setViewportSize({ width: 1000, height: 1000 });
		});

		test('hovering from an open submenu to a sibling item closes only the submenu, not the dropdown', async ({
			page,
		}) => {
			await byText(page, /open/i).click({ force: true });
			await expect(byText(page, /open/i)).toHaveAttribute('aria-expanded', 'true');

			await byText(page, /submenu trigger/i).hover({ force: true });
			await expect(page.getByRole('menu')).toHaveCount(2);

			await byText(page, /bottom item/i).hover({ force: true });
			await expect(page.getByRole('menu')).toHaveCount(1);
			await expect(byText(page, /open/i)).toHaveAttribute('aria-expanded', 'true');
		});

		test('opening a submenu with the keyboard then moving the mouse keeps the dropdown open', async ({ page }) => {
			await byText(page, /open/i).click({ force: true });
			await expect(byText(page, /open/i)).toHaveAttribute('aria-expanded', 'true');

			await page.locator('[data-slot="dropdown-menu-sub-trigger"]').focus();
			await page.keyboard.press('ArrowRight');
			await expect(page.getByRole('menu')).toHaveCount(2);
			await expect(byText(page, /sub item one/i)).toBeFocused();

			await byText(page, /bottom item/i).hover({ force: true });
			await expect(page.getByRole('menu')).toHaveCount(1);
			await expect(byText(page, /open/i)).toHaveAttribute('aria-expanded', 'true');
		});
	});
});
