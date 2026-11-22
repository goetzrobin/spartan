import { expect, gotoStory, test } from '../support';

test.describe('navigation-menu', () => {
	test.describe('default (open on hover)', () => {
		test.beforeEach(async ({ page }) => {
			await gotoStory(page, 'navigation-menu--default');
			await page.setViewportSize({ width: 1000, height: 1000 });
		});

		test('renders a single chevron per trigger', async ({ page }) => {
			await expect(page.getByRole('button', { name: /home/i }).locator('ng-icon')).toHaveCount(1);
		});
	});

	test.describe('click to open', () => {
		test.beforeEach(async ({ page }) => {
			await gotoStory(page, 'navigation-menu--click-to-open');
			await page.setViewportSize({ width: 1000, height: 1000 });
		});

		test('opens on click and toggles closed on a second click', async ({ page }) => {
			await expect(page.getByRole('button', { name: /home/i })).toHaveAttribute('aria-expanded', 'false');

			await page.getByRole('button', { name: /home/i }).click();
			await expect(page.getByRole('button', { name: /home/i })).toHaveAttribute('aria-expanded', 'true');
			await expect(page.getByRole('link', { name: /introduction/i })).toBeVisible();

			await page.getByRole('button', { name: /home/i }).click();
			await expect(page.getByRole('button', { name: /home/i })).toHaveAttribute('aria-expanded', 'false');
		});
	});
});
