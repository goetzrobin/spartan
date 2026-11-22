import { caretToEnd, expect, gotoStory, test } from '../support';

test.describe('field', () => {
	test.describe('with textarea', () => {
		test.beforeEach(async ({ page }) => {
			await gotoStory(page, 'field--with-textarea');
		});

		test('should allow typing in textarea', async ({ page }) => {
			const testText = 'This is a test comment with multiple lines.\nSecond line here.';
			const comments = page.getByLabel('Comments', { exact: true });
			await comments.click();
			await caretToEnd(comments);
			await comments.pressSequentially(testText);
			await expect(comments).toHaveValue(/This is a test comment/);
		});
	});
});
