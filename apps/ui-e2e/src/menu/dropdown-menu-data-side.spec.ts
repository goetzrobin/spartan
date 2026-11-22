import { byText, expect, gotoStory, test } from '../support';

// data-side is derived from the transform-origin CDK sets on the content (no _spartanLastPosition hack).
// Default story: the root menu opens below (=> "bottom") and the "Invite Users" submenu opens right (=> "right").
test.describe('dropdown-menu data-side', () => {
	test('derives data-side for the root menu and submenu from the resolved position', async ({ page }) => {
		await gotoStory(page, 'dropdown-menu--default');
		await page.setViewportSize({ width: 1000, height: 1000 });

		await byText(page, /open/i).click({ force: true });
		await expect(page.locator('[data-slot="dropdown-menu"]').first()).toHaveAttribute('data-side', 'bottom');

		await byText(page, /invite users/i).hover({ force: true });
		await expect(page.locator('[data-slot="dropdown-menu-sub"]').first()).toHaveAttribute('data-side', 'right');
	});
});
