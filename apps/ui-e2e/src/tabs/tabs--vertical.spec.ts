import type { Page } from '@playwright/test';
import { expect, gotoStory, test } from '../support';

test.describe('tabs--vertical', () => {
	const verifyTabsSetup = async (page: Page) => {
		// TODO: investigate why this fails
		// cy.checkA11y('#storybook-root', {
		//   rules: {
		//     'page-has-heading-one': { enabled: false },
		//     'landmark-one-main': { enabled: false },
		//   },
		// });
		await expect(page.getByRole('tablist')).not.toHaveCount(0);
		await expect(page.getByRole('tablist')).toHaveAttribute('aria-label');
		await expect(page.getByRole('tablist')).toHaveAttribute('data-orientation', 'vertical');
		await expect(page.getByRole('tablist')).toHaveAttribute('aria-orientation', 'vertical');
		await expect(page.getByRole('tab')).toHaveCount(3);
		await expect(page.getByRole('tab', { name: /account/i })).toHaveAttribute(
			'aria-controls',
			'brn-tabs-content-account',
		);
		await expect(page.getByRole('tab', { name: /password/i })).toHaveAttribute(
			'aria-controls',
			'brn-tabs-content-password',
		);
		await expect(page.getByRole('tab', { name: /danger zone/i })).toHaveAttribute(
			'aria-controls',
			'brn-tabs-content-danger',
		);
		await expect(page.getByRole('tabpanel')).not.toHaveCount(0);
	};

	test.describe('default', () => {
		test.beforeEach(async ({ page }) => {
			await gotoStory(page, 'tabs--vertical');
		});

		test('click interactions should render with first tab selected and change to second tab when second tab is clicked', async ({
			page,
		}) => {
			await verifyTabsSetup(page);

			await page.getByRole('tab', { name: /password/i }).click();

			await expect(page.getByRole('tabpanel')).toHaveAttribute('aria-labelledby', 'brn-tabs-label-password');
			await expect(page.getByRole('tabpanel')).toHaveAttribute('tabindex', '0');
			await expect(page.getByRole('tab', { name: /password/i })).toHaveAttribute('aria-selected', 'true');
			await expect(page.getByRole('tab', { name: /account/i })).toHaveAttribute('aria-selected', 'false');
			await expect(page.getByRole('heading', { name: /password/i })).not.toHaveCount(0);

			await page.getByRole('tab', { name: /account/i }).click();

			await expect(page.getByRole('tabpanel')).toHaveAttribute('aria-labelledby', 'brn-tabs-label-account');
			await expect(page.getByRole('tabpanel')).toHaveAttribute('tabindex', '0');
			await expect(page.getByRole('tab', { name: /account/i })).toHaveAttribute('aria-selected', 'true');
			await expect(page.getByRole('tab', { name: /password/i })).toHaveAttribute('aria-selected', 'false');
			await expect(page.getByRole('heading', { name: /account/i })).not.toHaveCount(0);
		});

		test('tab and arrow interactions should render with first tab selected and change to second tab when second tab is focused with arrow right, return to first tab with arrow left and do nothing on arrow up or down', async ({
			page,
		}) => {
			await verifyTabsSetup(page);

			await page.keyboard.press('Tab');
			await page.keyboard.press('ArrowDown');
			await expect(page.getByRole('tabpanel')).toHaveAttribute('aria-labelledby', 'brn-tabs-label-password');
			await expect(page.getByRole('tabpanel')).toHaveAttribute('tabindex', '0');
			await expect(page.getByRole('heading', { name: /password/i })).not.toHaveCount(0);

			await page.keyboard.press('ArrowUp');
			await expect(page.getByRole('tabpanel')).toHaveAttribute('aria-labelledby', 'brn-tabs-label-account');
			await expect(page.getByRole('tabpanel')).toHaveAttribute('tabindex', '0');
			await expect(page.getByRole('heading', { name: /account/i })).not.toHaveCount(0);

			// should ignore left and right
			await page.keyboard.press('ArrowLeft');
			await expect(page.getByRole('heading', { name: /account/i })).not.toHaveCount(0);

			await page.keyboard.press('ArrowRight');
			await expect(page.getByRole('heading', { name: /account/i })).not.toHaveCount(0);

			// should jump to last on end
			await page.keyboard.press('End');
			await expect(page.getByRole('tabpanel')).toHaveAttribute('aria-labelledby', 'brn-tabs-label-danger');
			await expect(page.getByRole('tabpanel')).toHaveAttribute('tabindex', '0');
			await expect(page.getByRole('heading', { name: /delete account/i })).not.toHaveCount(0);

			// should wrap around
			await page.keyboard.press('ArrowDown');
			await expect(page.getByRole('tabpanel')).toHaveAttribute('aria-labelledby', 'brn-tabs-label-account');
			await expect(page.getByRole('tabpanel')).toHaveAttribute('tabindex', '0');
			await expect(page.getByRole('heading', { name: /account/i })).not.toHaveCount(0);

			// jump between list and panel on tab
			await page.keyboard.press('Tab');
			await expect(page.getByRole('tabpanel')).toBeFocused();
			await page.keyboard.press('Shift+Tab');
			await expect(page.getByRole('tab', { name: /account/i })).toBeFocused();
		});
	});
});
