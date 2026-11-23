import { defineConfig, devices } from '@playwright/test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const out = path.join(root, 'dist/.playwright/ui-e2e');
const useBuild = process.env['VERIFY_TARGET'] === 'build';
const baseURL = process.env['TEST_BASE_URL'] ?? (useBuild ? 'http://localhost:4300' : 'http://localhost:4200');

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
		viewport: { width: 1000, height: 660 },
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
				env: { TEST_PAGES: '1' },
				url: `${baseURL}/test`,
				reuseExistingServer: !useBuild && !process.env['CI'],
				timeout: 300_000,
			},
});
