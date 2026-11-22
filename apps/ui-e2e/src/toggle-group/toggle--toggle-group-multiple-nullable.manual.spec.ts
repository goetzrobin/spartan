import type { Page } from '@playwright/test';
import { STORY_ROOT, byText, checkA11y, expect, gotoStory, test } from '../support';

const group = (page: Page) => page.getByRole('group');
const selected = (page: Page) => byText(page, /Cities selected/i);

async function expectOn(page: Page, name: RegExp): Promise<void> {
	await expect(byText(group(page), name)).toHaveAttribute('aria-pressed', 'true');
	await expect(byText(group(page), name)).toHaveAttribute('data-state', 'on');
}

async function expectOff(page: Page, name: RegExp): Promise<void> {
	await expect(byText(group(page), name)).toHaveAttribute('aria-pressed', 'false');
	await expect(byText(group(page), name)).toHaveAttribute('data-state', 'off');
}

async function expectOthersOff(page: Page, ...except: string[]): Promise<void> {
	let others = group(page).locator(':scope > button');
	for (const name of except) others = others.filter({ hasNotText: new RegExp(name) });
	await expect(others).not.toHaveCount(0);
	for (const button of await others.all()) {
		await expect(button).toHaveAttribute('aria-pressed', 'false');
	}
}

test.describe('toggle-group--toggle-group-multiple-nullable', () => {
	test.describe('default', () => {
		test.beforeEach(async ({ page }) => {
			await gotoStory(page, 'toggle-group--toggle-group-multiple-nullable');
		});

		const verifyToggleGroupSetup = async (page: Page) => {
			await checkA11y(page, STORY_ROOT, {
				rules: {
					'page-has-heading-one': { enabled: false },
					'landmark-one-main': { enabled: false },
				},
			});
			await expect(selected(page)).toContainText(/no cities/i);
			await expect(group(page)).not.toHaveCount(0);
			await expect(group(page).locator(':scope > button')).toHaveCount(4);
			await expectOthersOff(page);
		};

		test('\n    1. should have no city selected by default.\n    2. should have toggle-group with role=group and 4 buttons all toggled off.\n    3. click on sparta should select sparta.\n    4. click on syracuse should keep sparta selected and select syracuse\n    5. click on athens should keep sparta, syracuse selected and select athens\n    6. click on syracuse should unselect syracuse, but keep sparta and athens selected\n    7. click on set-to-syracuse button should unselect all others but syracuse\n    ', async ({
			page,
		}) => {
			await verifyToggleGroupSetup(page);
			await byText(group(page), /sparta/i).click();
			await expectOn(page, /sparta/i);
			await expectOthersOff(page, 'Sparta');
			await expect(selected(page)).toContainText(/sparta/i);
			await byText(group(page), /syracuse/i).click();
			await expectOn(page, /sparta/i);
			await expectOn(page, /syracuse/i);
			await expectOthersOff(page, 'Sparta', 'Syracuse');
			await expect(selected(page)).toContainText(/sparta/i);
			await expect(selected(page)).toContainText(/syracuse/i);
			await byText(group(page), /athens/i).click();
			await expectOn(page, /sparta/i);
			await expectOn(page, /syracuse/i);
			await expectOn(page, /athens/i);
			await expectOthersOff(page, 'Sparta', 'Syracuse', 'Athens');
			await expect(selected(page)).toContainText(/sparta/i);
			await expect(selected(page)).toContainText(/syracuse/i);
			await expect(selected(page)).toContainText(/athens/i);
			await byText(group(page), /syracuse/i).click();
			await expectOff(page, /syracuse/i);
			await expectOn(page, /sparta/i);
			await expectOn(page, /athens/i);
			await expectOthersOff(page, 'Sparta', 'Athens');
			await expect(selected(page)).toContainText(/sparta/i);
			await expect(selected(page)).toContainText(/athens/i);
			await byText(page, /set to syracuse/i).click();
			await expectOn(page, /syracuse/i);
			await expectOthersOff(page, 'Syracuse');
			await expect(selected(page)).toContainText(/syracuse/i);
		});

		test('\n    1. should have no city selected by default.\n    2. should have toggle-group with role=group and 4 buttons all toggled off.\n    3. tab to and space on sparta should select sparta.\n    4. tab to and enter on syracuse should keep sparta selected and select syracuse\n    5. tab to and space on athens should keep sparta, syracuse selected and select athens\n    6. tab to and enter on syracuse should unselect syracuse, but keep sparta and athens selected\n    7. tab to and space on set-to-syracuse button should unselect all others but syracuse\n    ', async ({
			page,
		}) => {
			await verifyToggleGroupSetup(page);
			await page.keyboard.press('Tab');
			await page.keyboard.press('Space');
			await expectOn(page, /sparta/i);
			await expectOthersOff(page, 'Sparta');
			await expect(selected(page)).toContainText(/sparta/i);
			await page.keyboard.press('Tab');
			await page.keyboard.press('Tab');
			await page.keyboard.press('Tab');
			await page.keyboard.press('Enter');
			await expectOn(page, /sparta/i);
			await expectOn(page, /syracuse/i);
			await expectOthersOff(page, 'Sparta', 'Syracuse');
			await expect(selected(page)).toContainText(/sparta/i);
			await expect(selected(page)).toContainText(/syracuse/i);
			await page.keyboard.press('Shift+Tab');
			await page.keyboard.press('Shift+Tab');
			await page.keyboard.press('Space');
			await expectOn(page, /sparta/i);
			await expectOn(page, /syracuse/i);
			await expectOn(page, /athens/i);
			await expectOthersOff(page, 'Sparta', 'Syracuse', 'Athens');
			await expect(selected(page)).toContainText(/sparta/i);
			await expect(selected(page)).toContainText(/syracuse/i);
			await expect(selected(page)).toContainText(/athens/i);
			await page.keyboard.press('Tab');
			await page.keyboard.press('Tab');
			await page.keyboard.press('Enter');
			await expectOff(page, /syracuse/i);
			await expectOn(page, /sparta/i);
			await expectOn(page, /athens/i);
			await expectOthersOff(page, 'Sparta', 'Athens');
			await expect(selected(page)).toContainText(/sparta/i);
			await expect(selected(page)).toContainText(/athens/i);
			await page.keyboard.press('Tab');
			await page.keyboard.press('Space');
			await expectOn(page, /syracuse/i);
			await expectOthersOff(page, 'Syracuse');
			await expect(selected(page)).toContainText(/syracuse/i);
		});
	});
});
