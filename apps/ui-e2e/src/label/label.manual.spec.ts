// One test from apps/ui-storybook-e2e/src/integration/label/label.cy.ts, moved by hand. The title
// matches the original so the transform leaves it out of label.spec.ts.
//
// The original opens the Default story with `?args=id:my-id`. Storybook adds an `[id]` binding to
// the template only when that arg is set. A test page is fixed when it is generated, and the
// Default story has no `id` arg, so the page cannot take one from the address. The Custom Id story
// sets the id in the story itself and this test checks the same thing there.
import { expect, gotoStory, test } from '../support';

test.describe('label', () => {
	test.describe('default', () => {
		test('should override default id if one is defined', async ({ page }) => {
			await gotoStory(page, 'label--custom-id');

			const label = page.locator('[hlmLabel]');
			await expect(label).not.toHaveCount(0);
			await expect(label.first()).toHaveAttribute('id', 'my-id');
		});
	});
});
