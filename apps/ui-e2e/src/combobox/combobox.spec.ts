import { STORY_ROOT, byText, checkA11y, expect, gotoStory, test } from '../support';

test.describe('combobox--default', () => {
	test.describe('default', () => {
		test.beforeEach(async ({ page }) => {
			await gotoStory(page, 'combobox--default');
		});

		test('click on combobox should open, click on Angular option should closed', async ({ page }) => {
			await expect(page.locator('input[placeholder="Select framework..."]')).toBeVisible();
			await checkA11y(page, STORY_ROOT, {
				rules: {
					'page-has-heading-one': { enabled: false },
					'landmark-one-main': { enabled: false },
				},
			});

			await expect(byText(page, /Angular/i)).toHaveCount(0);
			await expect(page.locator('input[placeholder="Select framework..."]')).toBeVisible();
			await page.locator('input[placeholder="Select framework..."]').click({ force: true });
			await expect(byText(page, 'Angular')).toBeVisible();
			await byText(page, 'Angular').click({ force: true });
			await expect(byText(page, 'Angular')).toHaveCount(0);
		});

		test('should open the framework dropdown, type "Vue", and ensure "Angular" is hidden', async ({ page }) => {
			await expect(byText(page, /Angular/i)).toHaveCount(0);
			await expect(page.locator('input[placeholder="Select framework..."]')).toBeVisible();
			await page.getByRole('combobox').pressSequentially('Vue');
			await expect(byText(page, 'Angular')).toBeHidden();
		});

		test('clicking the input while open keeps it open (closeOnTriggerClick is false)', async ({ page }) => {
			await expect(page.locator('input[placeholder="Select framework..."]')).toBeVisible();
			await page.locator('input[placeholder="Select framework..."]').click({ force: true });
			await expect(byText(page, 'Angular')).toBeVisible();
			await page.locator('input[placeholder="Select framework..."]').click({ force: true });
			await expect(byText(page, 'Angular')).toBeVisible();
		});

		test('should pass accessibility checks when opened', async ({ page }) => {
			await expect(page.locator('input[placeholder="Select framework..."]')).toBeVisible();
			await page.locator('input[placeholder="Select framework..."]').click({ force: true });
			await expect(byText(page, 'Angular')).toBeVisible();
			await page.waitForTimeout(600);
			await checkA11y(page, undefined, {
				rules: {
					'page-has-heading-one': { enabled: false },
					'landmark-one-main': { enabled: false },
					// Angular CDK overlays are appended to <body>, outside any landmark, which fails axe's region rule.
					region: { enabled: false },
				},
			});
		});
	});
});

test.describe('combobox--popup', () => {
	test.beforeEach(async ({ page }) => {
		await gotoStory(page, 'combobox--popup');
	});

	test('clicking the button trigger again should close the content (closeOnTriggerClick is true)', async ({ page }) => {
		await expect(byText(page, /Angular/i)).toHaveCount(0);
		await page.locator('hlm-combobox-trigger button').click({ force: true });
		await expect(byText(page, 'Angular')).toBeVisible();
		await page.locator('hlm-combobox-trigger button').click({ force: true });
		await expect(byText(page, 'Angular')).toHaveCount(0);
	});
});
