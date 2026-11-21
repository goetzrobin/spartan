// Ported by hand from apps/ui-storybook-e2e/src/integration/autocomplete/autocomplete.cy.ts.
// These tests press keys with realPress on the input, which the transform does not convert.
// realPress sends the key to whatever has focus, as page.keyboard.press does. Titles match the
// originals so the transform leaves them out of autocomplete.spec.ts.
import type { Page } from '@playwright/test';
import { caretToEnd, expect, gotoStory, test } from '../support';

/** Cypress's `.type('Mar')`: click the input, then type at the end of what it holds. */
async function typeIntoInput(page: Page, text: string): Promise<void> {
	const input = page.locator('input[hlmInputGroupInput]');
	await input.click();
	await caretToEnd(input);
	await input.pressSequentially(text);
}

test.describe('autocomplete', () => {
	test.describe('Default', () => {
		test.beforeEach(async ({ page }) => {
			await gotoStory(page, 'autocomplete--default');
		});

		test('should close popup when tabbing out', async ({ page }) => {
			await typeIntoInput(page, 'Mar');
			await expect(page.locator('hlm-autocomplete-content')).not.toHaveCount(0);
			await page.keyboard.press('Tab');
			await expect(page.locator('hlm-autocomplete-content')).toHaveCount(0);
		});

		test('should not select the highlighted option on tab out', async ({ page }) => {
			await typeIntoInput(page, 'Mar');
			await expect.poll(() => page.locator('hlm-autocomplete-item').count()).toBeGreaterThan(1);
			await page.keyboard.press('ArrowDown');
			await page.keyboard.press('Tab');
			await expect(page.locator('hlm-autocomplete-content')).toHaveCount(0);
			// Tab only dismisses the popup; it leaves focus to the next control without
			// committing the highlighted suggestion, so the typed search value remains.
			await expect(page.locator('input[hlmInputGroupInput]').first()).toHaveValue('Mar');
		});

		test('should select highlighted option on enter', async ({ page }) => {
			await typeIntoInput(page, 'Mar');
			await expect.poll(() => page.locator('hlm-autocomplete-item').count()).toBeGreaterThan(1);
			await page.keyboard.press('ArrowDown');
			await page.keyboard.press('Enter');
			await expect(page.locator('hlm-autocomplete-content')).toHaveCount(0);
			await expect(page.locator('input[hlmInputGroupInput]').first()).toHaveValue('Marty McFly');
		});
	});
});
