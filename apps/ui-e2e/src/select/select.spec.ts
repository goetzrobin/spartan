import { expect, forceClick, gotoStory, test } from '../support';

test.describe('select', () => {
	test.describe('disabled option', () => {
		test('should not be able to select a disabled option', async ({ page }) => {
			await gotoStory(page, 'select--disabled-option');
			await page.locator('[brnselecttrigger]').click();
			await expect(page.locator('hlm-select-item').nth(0)).not.toHaveAttribute('data-disabled');
			await expect(page.locator('[data-testid="banana-option"]').first()).toHaveAttribute('aria-disabled', 'true');
			await expect(page.locator('[data-testid="banana-option"]').first()).toHaveAttribute('data-disabled', '');
			await forceClick(page.locator('[data-testid="banana-option"]'));
			await expect(page.locator('pre')).toHaveText('Form Control Value: ""');
			await page.locator('hlm-select-item').nth(0).click();
			await expect(page.locator('pre')).toHaveText('Form Control Value: "apple"');
		});
	});

	test.describe('form validation', () => {
		test('should have form validation classes and reflect control status', async ({ page }) => {
			await gotoStory(page, 'select--reactive-form-control-with-validation');

			// initial
			await expect(page.locator('[brnselecttrigger]').first()).not.toHaveAttribute('data-touched');
			await expect(page.locator('[brnselecttrigger]').first()).not.toHaveAttribute('data-dirty');
			await expect(page.locator('[brnselecttrigger]').first()).not.toHaveAttribute('aria-invalid');
			await expect(page.locator('[brnselecttrigger]').first()).not.toHaveAttribute('data-matches-spartan-invalid');

			// on open
			await page.locator('[brnselecttrigger]').click();
			await expect(page.locator('[brnselecttrigger]').first()).not.toHaveAttribute('data-touched');
			await expect(page.locator('[brnselecttrigger]').first()).not.toHaveAttribute('data-dirty');
			await expect(page.locator('[brnselecttrigger]').first()).not.toHaveAttribute('aria-invalid');
			await expect(page.locator('[brnselecttrigger]').first()).not.toHaveAttribute('data-matches-spartan-invalid');
			await page.locator('body').click();

			// no selection
			await expect(page.locator('[brnselecttrigger]').first()).toHaveAttribute('data-touched', 'true');
			await expect(page.locator('[brnselecttrigger]').first()).not.toHaveAttribute('data-dirty');
			await expect(page.locator('[brnselecttrigger]').first()).toHaveAttribute('aria-invalid', 'true');
			await expect(page.locator('[brnselecttrigger]').first()).toHaveAttribute('data-matches-spartan-invalid', 'true');

			await page.locator('[brnselecttrigger]').click();
			await page.locator('hlm-select-item').first().click();
			await page.locator('[brnselecttrigger]').click();
			await page.locator('hlm-select-item').last().click();
			await expect(page.locator('[brnselecttrigger]').first()).toHaveAttribute('data-touched', 'true');
			await expect(page.locator('[brnselecttrigger]').first()).toHaveAttribute('data-dirty', 'true');
			await expect(page.locator('[brnselecttrigger]').first()).not.toHaveAttribute('aria-invalid', 'true');
			await expect(page.locator('[brnselecttrigger]').first()).not.toHaveAttribute(
				'data-matches-spartan-invalid',
				'true',
			);

			// on real selection
			await page.locator('[brnselecttrigger]').click();
			await page.locator('hlm-select-item').nth(0).click();
			await expect(page.locator('[brnselecttrigger]').first()).toHaveAttribute('data-touched', 'true');
			await expect(page.locator('[brnselecttrigger]').first()).toHaveAttribute('data-dirty', 'true');
			await expect(page.locator('[brnselecttrigger]').first()).not.toHaveAttribute('aria-invalid');
			await expect(page.locator('[brnselecttrigger]').first()).not.toHaveAttribute('data-matches-spartan-invalid');
		});

		test('should have initial value set correctly when options are provided in a for loop', async ({ page }) => {
			await gotoStory(page, 'select--reactive-form-control-with-for-and-initial-value');

			// initial
			await expect(page.locator('[brnselecttrigger]').first()).not.toHaveAttribute('data-touched');
			await expect(page.locator('[brnselecttrigger]').first()).not.toHaveAttribute('data-dirty');
			await expect(page.locator('[brnselecttrigger]').first()).not.toHaveAttribute('aria-invalid');
			await expect(page.locator('[brnselecttrigger]').first()).not.toHaveAttribute('data-matches-spartan-invalid');

			// on open
			await page.locator('[brnselecttrigger]').click();
			await expect(page.locator('[brnselecttrigger]').first()).not.toHaveAttribute('data-touched');
			await expect(page.locator('[brnselecttrigger]').first()).not.toHaveAttribute('data-dirty');
			await expect(page.locator('[brnselecttrigger]').first()).not.toHaveAttribute('aria-invalid');
			await expect(page.locator('[brnselecttrigger]').first()).not.toHaveAttribute('data-matches-spartan-invalid');
			await page.locator('[brnselecttrigger]').click();

			// no selection
			await expect(page.locator('[brnselecttrigger]').first()).toHaveAttribute('data-touched', 'true');
			await expect(page.locator('[brnselecttrigger]').first()).not.toHaveAttribute('data-dirty');
			await expect(page.locator('[brnselecttrigger]').first()).not.toHaveAttribute('aria-invalid');
			await expect(page.locator('[brnselecttrigger]').first()).not.toHaveAttribute('data-matches-spartan-invalid');

			// on real selection
			await page.locator('[brnselecttrigger]').click();
			await page.locator('hlm-select-item').nth(0).click();
			await expect(page.locator('[brnselecttrigger]').first()).toHaveAttribute('data-touched', 'true');
			await expect(page.locator('[brnselecttrigger]').first()).toHaveAttribute('data-dirty', 'true');
			await expect(page.locator('[brnselecttrigger]').first()).not.toHaveAttribute('aria-invalid');
			await expect(page.locator('[brnselecttrigger]').first()).not.toHaveAttribute('data-matches-spartan-invalid');
		});

		test('should have form validation classes and reflect control status with label', async ({ page }) => {
			await gotoStory(page, 'select--reactive-form-control-with-validation-with-label');

			// initial
			await expect(page.locator('[brnselecttrigger]').first()).not.toHaveAttribute('data-touched');
			await expect(page.locator('[brnselecttrigger]').first()).not.toHaveAttribute('data-dirty');
			await expect(page.locator('[brnselecttrigger]').first()).not.toHaveAttribute('aria-invalid');
			await expect(page.locator('[brnselecttrigger]').first()).not.toHaveAttribute('data-matches-spartan-invalid');

			// on open
			await page.locator('[brnselecttrigger]').click();
			await expect(page.locator('[brnselecttrigger]').first()).not.toHaveAttribute('data-touched');
			await expect(page.locator('[brnselecttrigger]').first()).not.toHaveAttribute('data-dirty');
			await expect(page.locator('[brnselecttrigger]').first()).not.toHaveAttribute('aria-invalid');
			await expect(page.locator('[brnselecttrigger]').first()).not.toHaveAttribute('data-matches-spartan-invalid');
			await page.locator('[brnselecttrigger]').click();

			// no selection
			await expect(page.locator('[brnselecttrigger]').first()).toHaveAttribute('data-touched', 'true');
			await expect(page.locator('[brnselecttrigger]').first()).not.toHaveAttribute('data-dirty');
			await expect(page.locator('[brnselecttrigger]').first()).toHaveAttribute('aria-invalid', 'true');
			await expect(page.locator('[brnselecttrigger]').first()).toHaveAttribute('data-matches-spartan-invalid', 'true');

			// on real selection
			await page.locator('[brnselecttrigger]').click();
			await page.locator('hlm-select-item').nth(0).click();
			await expect(page.locator('[brnselecttrigger]').first()).toHaveAttribute('data-touched', 'true');
			await expect(page.locator('[brnselecttrigger]').first()).toHaveAttribute('data-dirty', 'true');
			await expect(page.locator('[brnselecttrigger]').first()).not.toHaveAttribute('aria-invalid');
			await expect(page.locator('[brnselecttrigger]').first()).not.toHaveAttribute('data-matches-spartan-invalid');
		});

		test('should have form validation classes and reflect control status when assigned with initial value', async ({
			page,
		}) => {
			await gotoStory(page, 'select--reactive-form-control-with-validation', { args: 'value:apple' });

			// initial
			await expect(page.locator('[brnselecttrigger]').first()).not.toHaveAttribute('data-touched');
			await expect(page.locator('[brnselecttrigger]').first()).not.toHaveAttribute('data-dirty');
			await expect(page.locator('[brnselecttrigger]').first()).not.toHaveAttribute('aria-invalid');
			await expect(page.locator('[brnselecttrigger]').first()).not.toHaveAttribute('data-matches-spartan-invalid');

			// on open
			await page.locator('[brnselecttrigger]').click();
			await expect(page.locator('[brnselecttrigger]').first()).not.toHaveAttribute('data-touched');
			await expect(page.locator('[brnselecttrigger]').first()).not.toHaveAttribute('data-dirty');
			await expect(page.locator('[brnselecttrigger]').first()).not.toHaveAttribute('aria-invalid');
			await expect(page.locator('[brnselecttrigger]').first()).not.toHaveAttribute('data-matches-spartan-invalid');
			await page.locator('[brnselecttrigger]').click();

			// no selection
			await expect(page.locator('[brnselecttrigger]').first()).toHaveAttribute('data-touched', 'true');
			await expect(page.locator('[brnselecttrigger]').first()).not.toHaveAttribute('data-dirty');
			await expect(page.locator('[brnselecttrigger]').first()).not.toHaveAttribute('aria-invalid');
			await expect(page.locator('[brnselecttrigger]').first()).not.toHaveAttribute('data-matches-spartan-invalid');

			// on real selection
			await page.locator('[brnselecttrigger]').click();
			await page.locator('hlm-select-item').nth(0).click();
			await expect(page.locator('[brnselecttrigger]').first()).toHaveAttribute('data-touched', 'true');
			await expect(page.locator('[brnselecttrigger]').first()).toHaveAttribute('data-dirty', 'true');
			await expect(page.locator('[brnselecttrigger]').first()).not.toHaveAttribute('aria-invalid');
			await expect(page.locator('[brnselecttrigger]').first()).not.toHaveAttribute('data-matches-spartan-invalid');
		});

		test('should have form validation classes and reflect control status (2)', async ({ page }) => {
			await gotoStory(page, 'select--reactive-form-control');

			// initial
			await expect(page.locator('[brnselecttrigger]').first()).not.toHaveAttribute('data-touched');
			await expect(page.locator('[brnselecttrigger]').first()).not.toHaveAttribute('data-dirty');
			await expect(page.locator('[brnselecttrigger]').first()).not.toHaveAttribute('aria-invalid');
			await expect(page.locator('[brnselecttrigger]').first()).not.toHaveAttribute('data-matches-spartan-invalid');

			// on open
			await page.locator('[brnselecttrigger]').click();
			await expect(page.locator('[brnselecttrigger]').first()).not.toHaveAttribute('data-touched');
			await expect(page.locator('[brnselecttrigger]').first()).not.toHaveAttribute('data-dirty');
			await expect(page.locator('[brnselecttrigger]').first()).not.toHaveAttribute('aria-invalid');
			await expect(page.locator('[brnselecttrigger]').first()).not.toHaveAttribute('data-matches-spartan-invalid');
			await page.locator('[brnselecttrigger]').click();

			// no selection
			await expect(page.locator('[brnselecttrigger]').first()).toHaveAttribute('data-touched', 'true');
			await expect(page.locator('[brnselecttrigger]').first()).not.toHaveAttribute('data-dirty');
			await expect(page.locator('[brnselecttrigger]').first()).not.toHaveAttribute('aria-invalid');
			await expect(page.locator('[brnselecttrigger]').first()).not.toHaveAttribute('data-matches-spartan-invalid');

			// on real selection
			await page.locator('[brnselecttrigger]').click();
			await page.locator('hlm-select-item').nth(0).click();
			await expect(page.locator('[brnselecttrigger]').first()).toHaveAttribute('data-touched', 'true');
			await expect(page.locator('[brnselecttrigger]').first()).toHaveAttribute('data-dirty', 'true');
			await expect(page.locator('[brnselecttrigger]').first()).not.toHaveAttribute('aria-invalid');
			await expect(page.locator('[brnselecttrigger]').first()).not.toHaveAttribute('data-matches-spartan-invalid');
		});
	});

	test.describe('falsy value', () => {
		test.beforeEach(async ({ page }) => {
			await gotoStory(page, 'select--falsy-value');
		});

		test('should select an option with a falsy value on enter keypress', async ({ page }) => {
			await page.locator('[brnselecttrigger]').click();

			await page.keyboard.press('ArrowDown');
			await page.keyboard.press('Enter');

			// the falsy value is committed and the panel closes
			await expect(page.locator('hlm-select-content')).toHaveCount(0);
			await expect(page.locator('[brnselecttrigger]').first()).toHaveAttribute('aria-expanded', 'false');
			await expect(page.locator('[data-testid="value"]').filter({ hasText: /false/ })).not.toHaveCount(0);
		});
	});
});
