// One test from apps/ui-storybook-e2e/src/integration/field/field.cy.ts, ported by hand. It types
// a line break and checks part of the value, which the transform does not convert. The title
// matches the original so the transform leaves it out of field.spec.ts.
import { caretToEnd, expect, gotoStory, test } from '../support';

test.describe('field', () => {
	test.describe('with textarea', () => {
		test.beforeEach(async ({ page }) => {
			await gotoStory(page, 'field--with-textarea');
		});

		test('should allow typing in textarea', async ({ page }) => {
			const testText = 'This is a test comment with multiple lines.\nSecond line here.';
			const comments = page.getByLabel('Comments', { exact: true });
			// Cypress's `.type`: click, then type at the end. The textarea starts empty, and "\n"
			// presses Enter, which adds a line break, as it does in Cypress.
			await comments.click();
			await caretToEnd(comments);
			await comments.pressSequentially(testText);
			await expect(comments).toHaveValue(/This is a test comment/);
		});
	});
});
