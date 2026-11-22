// Ported by hand from apps/ui-storybook-e2e/src/integration/item/item.cy.ts.
// The Group accessibility test passes a callback to cy.checkA11y that only logs the violations,
// which the transform does not convert. checkA11y here reports the violations itself.
import { checkA11y, expect, gotoStory, test } from '../support';

test.describe('item', () => {
	test.describe('Group', () => {
		test.beforeEach(async ({ page }) => {
			await gotoStory(page, 'item--group');
		});

		test('should pass accessibility checks', async ({ page }) => {
			await expect(page.locator('hlm-item-group')).not.toHaveCount(0);
			await checkA11y(page, 'hlm-item-group');
		});
	});
});
