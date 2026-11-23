import { expect, gotoStory, test } from '../support';

test.describe('select trigger name', () => {
	test('is named by the label that targets it in a form', async ({ page }) => {
		await gotoStory(page, 'select--with-label-and-form');

		await expect(page.locator('[brnselecttrigger]')).toHaveAccessibleName('Select a Fruit*');
	});

	test('is named by the label of the field it sits in', async ({ page }) => {
		await gotoStory(page, 'select--with-hint-and-error');

		await expect(page.locator('[brnselecttrigger]')).toHaveAccessibleName('Fruit *');
	});

	test('is named by the visually hidden label of the default story', async ({ page }) => {
		await gotoStory(page, 'select--default');

		await expect(page.locator('[brnselecttrigger]')).toHaveAccessibleName('Fruit');
	});

	test('is named in the multiple select', async ({ page }) => {
		await gotoStory(page, 'select--dynamic-options-multi-select');

		await expect(page.locator('[brnselecttrigger]')).toHaveAccessibleName('Select a Fruit*');
	});
});
