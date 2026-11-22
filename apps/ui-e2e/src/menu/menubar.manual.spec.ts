// One test from apps/ui-storybook-e2e/src/integration/menu/menubar.cy.ts, ported by hand. It sends
// arrow keys through a helper that fires a keydown event on the focused element with
// `cy.focused().trigger(...)`, which the transform does not convert. The title matches the
// original so the transform leaves it out of menubar.spec.ts.
//
// pressArrow is kept as it was. Cypress's `.trigger('keydown', props)` makes a plain Event that
// bubbles and can be cancelled, and copies the props onto it. The same is done here, so the menu
// sees the same event and the browser does nothing of its own for the key.
import type { Page } from '@playwright/test';
import { STORY_ROOT, byText, checkA11y, expect, gotoStory, test } from '../support';

type Arrow = 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight';

async function pressArrow(page: Page, key: Arrow): Promise<void> {
	const keyCode = { ArrowLeft: 37, ArrowUp: 38, ArrowRight: 39, ArrowDown: 40 }[key];
	// cy.focused() waits until an element has focus.
	await expect(page.locator(':focus')).toHaveCount(1);
	await page.evaluate(
		(props) => {
			const focused = document.activeElement;
			if (!focused) throw new Error('Nothing has focus');
			const event = new Event('keydown', { bubbles: true, cancelable: true });
			Object.assign(event, props);
			focused.dispatchEvent(event);
		},
		{ key, code: key, keyCode, which: keyCode },
	);
}

async function expectExpanded(page: Page, expanded: Record<string, boolean>): Promise<void> {
	for (const [name, open] of Object.entries(expanded)) {
		await expect(byText(page, name)).toHaveAttribute('aria-expanded', String(open));
	}
}

test.describe('menubar', () => {
	test.describe('default', () => {
		test.beforeEach(async ({ page }) => {
			await gotoStory(page, 'menubar--default');
			await page.setViewportSize({ width: 1000, height: 1000 });
		});

		test('arrowdown on file should open menu and arrow left/right around should open/close appropriate menus', async ({
			page,
		}) => {
			await checkA11y(page, STORY_ROOT, {
				rules: {
					'page-has-heading-one': { enabled: false },
					'landmark-one-main': { enabled: false },
				},
			});
			await expectExpanded(page, { File: false, Edit: false, View: false, Profiles: false });

			await page.keyboard.press('Tab');
			await pressArrow(page, 'ArrowDown');
			await expectExpanded(page, { File: true, Edit: false, View: false, Profiles: false });

			await pressArrow(page, 'ArrowRight');
			await expectExpanded(page, { File: false, Edit: true, View: false, Profiles: false });
			//
			await pressArrow(page, 'ArrowDown');
			await pressArrow(page, 'ArrowDown');
			await pressArrow(page, 'ArrowDown');
			await pressArrow(page, 'ArrowRight');
			await expectExpanded(page, { File: false, Edit: true, View: false, Profiles: false, Share: true });

			await pressArrow(page, 'ArrowLeft');
			await pressArrow(page, 'ArrowUp');
			await pressArrow(page, 'ArrowUp');
			await pressArrow(page, 'ArrowUp');
			await pressArrow(page, 'ArrowUp');
			await pressArrow(page, 'ArrowRight');
			await expectExpanded(page, { File: false, Edit: false, View: true, Profiles: false });

			await pressArrow(page, 'ArrowRight');
			await expectExpanded(page, { File: false, Edit: false, View: false, Profiles: true });

			await page.keyboard.press('Escape');
			await expectExpanded(page, { File: false, Edit: false, View: false, Profiles: false });
			await expect(byText(page, 'Profiles')).toBeFocused();

			await pressArrow(page, 'ArrowRight');
			await expect(byText(page, 'File')).toBeFocused();
		});
	});
});
