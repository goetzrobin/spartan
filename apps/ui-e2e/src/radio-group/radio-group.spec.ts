import { STORY_ROOT, byText, checkA11y, expect, gotoStory, test } from '../support';

test.describe('radio-group', () => {
	test.describe('default', () => {
		test.beforeEach(async ({ page }) => {
			await gotoStory(page, 'radio-group--default');
		});

		test('\n    1. should display default version.\n    2. should update based on click of outside button setting to 16.0.0.\n    3. should uncheck all checked radios when reset to none.\n    4. should check correct version when clicked on 15.8.0 radio\n    5. should not change when clicked on disabled radio\n    ', async ({
			page,
		}) => {
			await checkA11y(page, STORY_ROOT, {
				rules: {
					'page-has-heading-one': { enabled: false },
					'landmark-one-main': { enabled: false },
				},
			});

			//1
			await expect(page.getByTestId('currentVersion')).toHaveText('16.1.4');
			//2
			await byText(page, 'Set to v16.0.0').click({ force: true });
			await expect(page.getByTestId('currentVersion')).toHaveText('16.0.0');
			await expect(page.getByLabel('v16.0.0', { exact: true })).toBeChecked();
			//3
			await byText(page, 'Reset').click({ force: true });
			await expect(page.getByTestId('currentVersion')).toHaveText('none');
			await expect(page.getByLabel('v16.0.0', { exact: true })).not.toBeChecked();
			//4
			await byText(page, 'v15.8.0').click({ force: true });
			await expect(page.getByLabel('v15.8.0', { exact: true })).toBeChecked();
			await expect(page.getByLabel('v16.0.0', { exact: true })).not.toBeChecked();
			await expect(page.getByTestId('currentVersion')).toHaveText('15.8.0');
			//5
			await byText(page, 'v15.2.0').click({ force: true });

			await expect(page.getByLabel('v15.2.0', { exact: true })).not.toBeChecked();
			await expect(page.getByLabel('v16.0.0', { exact: true })).not.toBeChecked();
			await expect(page.getByLabel('v15.8.0', { exact: true })).toBeChecked();
			await expect(page.getByTestId('currentVersion')).toHaveText('15.8.0');
		});

		test('\n    1. should display default version.\n    2. should focus first radio when tabbed in.\n    3. should jump to next button when tabbed out and set version correctly when enter is hit on it\n    4. should jump to newly selected radio when focus moved back to group\n    5. should move checked radio with up and down arrows.\n    6. should move checked radio with left and right arrows.\n    5. should not move to disabled radio\n    ', async ({
			page,
		}) => {
			await checkA11y(page, STORY_ROOT, {
				rules: {
					'page-has-heading-one': { enabled: false },
					'landmark-one-main': { enabled: false },
				},
			});

			//1
			await expect(page.getByTestId('currentVersion')).toHaveText('16.1.4');
			//2
			await page.keyboard.press('Tab');
			await expect(page.getByLabel('v16.1.4', { exact: true })).toBeFocused();
			await page.keyboard.press('Tab');
			await expect(byText(page, 'Set to v16.0.0')).toBeFocused();
			await page.keyboard.press('Enter');
			await expect(page.getByTestId('currentVersion')).toHaveText('16.0.0');
			await expect(page.getByLabel('v16.0.0', { exact: true })).toBeChecked();
			//3
			await page.keyboard.press('Shift+Tab');
			await expect(page.getByLabel('v16.0.0', { exact: true })).toBeFocused();
			await page.keyboard.press('ArrowUp');
			await expect(page.getByLabel('v16.1.4', { exact: true })).toBeFocused();
			await expect(page.getByLabel('v16.1.4', { exact: true })).toBeChecked();
			await page.keyboard.press('ArrowDown');
			await expect(page.getByLabel('v16.0.0', { exact: true })).toBeChecked();
			await expect(page.getByLabel('v16.0.0', { exact: true })).toBeFocused();
			//4
			await page.keyboard.press('ArrowLeft');
			await expect(page.getByLabel('v16.1.4', { exact: true })).toBeFocused();
			await expect(page.getByLabel('v16.1.4', { exact: true })).toBeChecked();
			await page.keyboard.press('ArrowRight');
			await expect(page.getByLabel('v16.0.0', { exact: true })).toBeChecked();
			await expect(page.getByLabel('v16.0.0', { exact: true })).toBeFocused();
			//5
			await page.keyboard.press('ArrowDown');
			await page.keyboard.press('ArrowDown');

			await expect(page.getByLabel('v15.2.0', { exact: true })).not.toBeFocused();
			await expect(page.getByLabel('v16.1.4', { exact: true })).toBeFocused();
			await expect(page.getByLabel('v16.1.4', { exact: true })).toBeChecked();
		});

		test.describe('labelFor', () => {
			test.beforeEach(async ({ page }) => {
				await gotoStory(page, 'radio-group--label-for');
			});

			test('should check the option when clicking the label', async ({ page }) => {
				await page.locator('#brn-label-1').click({ force: true });
				await page.locator('#default-radio').click({ force: true });
				await expect(page.getByLabel('Default', { exact: true })).toBeChecked();
				await page.locator('#brn-label-1').click({ force: true });
				await page.locator('#comfortable-radio').click({ force: true });
				await expect(page.getByLabel('Comfortable', { exact: true })).toBeChecked();
				await page.locator('#brn-label-2').click({ force: true });
				await page.locator('#compact-radio').click({ force: true });
				await expect(page.getByLabel('Compact', { exact: true })).toBeChecked();
				await expect(page.getByLabel('Comfortable', { exact: true })).not.toBeChecked();
				await expect(page.getByLabel('Default', { exact: true })).not.toBeChecked();
			});
		});
	});
});
