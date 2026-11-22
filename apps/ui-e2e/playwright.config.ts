import { defineConfig, devices } from '@playwright/test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const out = path.join(root, 'dist/.playwright/ui-e2e');
// `VERIFY_TARGET=build` tests the production browser bundle (`VERIFY_BUILD=1 nx build app`) served
// as plain files. Without it the tests run against the dev server, which suits work on one
// component: it picks up an edit in seconds, but it is slow to start and holds every page it
// has built in memory.
const useBuild = process.env['VERIFY_TARGET'] === 'build';
const baseURL = process.env['TEST_BASE_URL'] ?? (useBuild ? 'http://localhost:4300' : 'http://localhost:4200');

/**
 * Runs against the test pages under `/test` in the docs app (generated from the stories by
 * `tools/verify/story-to-test-pages.mjs`).
 *
 * Every run records a video and a final screenshot of each test and the accessibility results
 * of each check. Those files are the proof attached to a pull request.
 *
 * PW_CHANNEL=chrome uses an installed Chrome where Playwright's own browser cannot be downloaded.
 */
export default defineConfig({
	testDir: './src',
	globalSetup: path.join(root, 'apps/ui-e2e/src/support/global-setup.ts'),
	outputDir: path.join(out, 'output'),
	snapshotPathTemplate: path.join(out, 'baseline/{testFilePath}/{arg}{ext}'),
	fullyParallel: true,
	forbidOnly: !!process.env['CI'],
	retries: 0,
	workers: process.env['CI'] ? 4 : undefined,
	reporter: [
		['list'],
		['json', { outputFile: path.join(out, 'results.json') }],
		['html', { outputFolder: path.join(out, 'report'), open: 'never' }],
	],
	use: {
		baseURL,
		// The size Cypress ran these tests at; several of them assert on positions.
		viewport: { width: 1000, height: 660 },
		// The final screenshot of every test is taken by the support fixture once the page has
		// settled. Playwright's own is kept for failures, where it shows the moment of the error.
		screenshot: 'only-on-failure',
		video:
			process.env['PW_VIDEO'] === 'off'
				? 'off'
				: { mode: 'on', show: { actions: { duration: 200, position: 'bottom' } } },
		trace: 'retain-on-failure',
	},
	projects: [
		{
			name: 'chromium',
			use: {
				...devices['Desktop Chrome'],
				viewport: { width: 1000, height: 660 },
				channel: process.env['PW_CHANNEL'] || undefined,
			},
		},
	],
	webServer: process.env['TEST_BASE_URL']
		? undefined
		: {
				command: useBuild ? 'node tools/verify/serve.mjs --port 4300' : 'pnpm nx serve app',
				cwd: root,
				url: `${baseURL}/test`,
				// A file server left over from an earlier build would serve stale files.
				reuseExistingServer: !useBuild && !process.env['CI'],
				timeout: 300_000,
			},
});
