import { STORY_ROOT, byText, checkA11y, expect, gotoStory, test } from '../support';

test.describe('dropdown-menu', () => {
	test.describe('default', () => {
		test.beforeEach(async ({ page }) => {
			await gotoStory(page, 'dropdown-menu--default');
			await page.setViewportSize({ width: 1000, height: 1000 });
		});

		test('down on open button should open, up and down should navigate, right over sub menu should open submenu, and left on sub should close it, and escape open should close dropdown completely', async ({
			page,
		}) => {
			await checkA11y(page, STORY_ROOT, {
				rules: {
					'page-has-heading-one': { enabled: false },
					'landmark-one-main': { enabled: false },
				},
			});

			await expect(byText(page, /open/i)).toHaveAttribute('aria-expanded', 'false');

			await page.keyboard.press('Tab');

			await expect(byText(page, /open/i)).toBeFocused();
			await page.keyboard.press('ArrowDown');

			await expect(byText(page, /open/i)).toHaveAttribute('aria-expanded', 'true');

			await expect(page.getByRole('menu')).toHaveCount(1);

			for (let i = 0; i < 5; i++) {
				await page.keyboard.press('ArrowDown');
			}

			await page.keyboard.press('ArrowRight');
			await expect(page.getByRole('menu')).toHaveCount(2);

			await page.keyboard.press('ArrowDown');
			await page.keyboard.press('ArrowLeft');
			await page.keyboard.press('Escape');

			await expect(byText(page, /open/i)).toBeFocused();
			await expect(byText(page, /open/i)).toHaveAttribute('aria-expanded', 'false');
		});
	});
});
