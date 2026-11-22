// Opens every test page and fails if it throws or logs an error while rendering.
//
// A page can exist without a test that uses it, and a story can be broken in ways the type check
// does not see. This catches both. `pnpm verify <component>` limits it to that component's pages
// through VERIFY_TITLES.
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { expect, gotoStory, recordA11y, STORY_ROOT, test } from '../support';

type TestPage = { id: string; route: string };

const manifest = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../test-pages.json');
const pages: TestPage[] = JSON.parse(readFileSync(manifest, 'utf8')).pages;
const only = process.env['VERIFY_TITLES']?.split(',').filter(Boolean);
const selected = only ? pages.filter((page) => only.includes(page.id.split('--')[0])) : pages;

/** Requests the sandbox or a flaky network blocks say nothing about the page itself. */
const NETWORK_NOISE = /Failed to load resource|net::ERR_/;

test.describe('test pages render without errors', () => {
	for (const { id } of selected) {
		test(id, async ({ page }) => {
			const errors: string[] = [];
			page.on('pageerror', (error) => errors.push(String(error)));
			page.on('console', (message) => {
				if (message.type() === 'error' && !NETWORK_NOISE.test(message.text())) errors.push(message.text());
			});

			await gotoStory(page, id);
			await recordA11y(page, STORY_ROOT);

			expect(errors, `${id} logged errors while rendering`).toEqual([]);
		});
	}
});
