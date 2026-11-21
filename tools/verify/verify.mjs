#!/usr/bin/env node
// One command to check a component end to end.
//
//   pnpm verify popover            one or more components
//   pnpm verify --affected         whatever the current changes can affect (compared with origin/main)
//   pnpm verify --affected --base <ref>
//   pnpm verify --all
//   pnpm verify --list --affected  print the affected components as JSON and stop
//
// Steps: (1) the generated test pages and tests match their sources, (2) the Playwright tests
// for the chosen components pass, (3) the proof (videos, screenshots, accessibility results) is
// written to dist/.playwright/ui-e2e/proof. Extra arguments after `--` go to Playwright.

import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { affectedComponents, listComponents, parseStatus } from './lib/affected.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const node = process.execPath;

function git(...args) {
	return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' }).trim();
}

function changedFiles(base) {
	const mergeBase = git('merge-base', base, 'HEAD');
	const committed = git('diff', '--name-only', mergeBase, 'HEAD');
	// Not through git(): that trims the output, and the first line of a status can start with a space.
	const status = execFileSync('git', ['status', '--porcelain', '--untracked-files=all'], {
		cwd: ROOT,
		encoding: 'utf8',
	});
	const working = parseStatus(status);
	return [...new Set([...committed.split('\n').filter(Boolean), ...working])].sort();
}

function run(label, command, args, options = {}) {
	console.log(`\n▸ ${label}`);
	const started = Date.now();
	const result = spawnSync(command, args, { cwd: ROOT, stdio: 'inherit', ...options });
	console.log(`  ${result.status === 0 ? 'ok' : 'FAILED'} in ${((Date.now() - started) / 1000).toFixed(1)}s`);
	return result.status === 0;
}

const argv = process.argv.slice(2);
const split = argv.indexOf('--');
const own = split > -1 ? argv.slice(0, split) : argv;
const passthrough = split > -1 ? argv.slice(split + 1) : [];
const flag = (name) => own.includes(name);
const value = (name) => (own.includes(name) ? own[own.indexOf(name) + 1] : undefined);
const named = own.filter((arg, index) => !arg.startsWith('--') && own[index - 1] !== '--base');

const known = listComponents(ROOT);
let components;
let note = '';

if (flag('--all')) {
	components = known;
} else if (flag('--affected')) {
	const base = value('--base') ?? 'origin/main';
	const result = affectedComponents(ROOT, changedFiles(base));
	components = result.components;
	note = result.all ? `everything, because of ${result.reasons['*'].join(', ')}` : '';
	if (flag('--list')) {
		console.log(JSON.stringify(result, null, 2));
		process.exit(0);
	}
} else {
	components = named;
	const unknown = components.filter((component) => !known.includes(component));
	if (components.length === 0 || unknown.length > 0) {
		if (unknown.length > 0) console.error(`No tests for: ${unknown.join(', ')}`);
		console.error(
			`Usage: pnpm verify <component> [...] | --affected [--base <ref>] | --all\nComponents: ${known.join(', ')}`,
		);
		process.exit(2);
	}
}

if (flag('--list')) {
	console.log(JSON.stringify({ components }, null, 2));
	process.exit(0);
}
if (components.length === 0) {
	console.log('No component is affected by the current changes. Nothing to verify.');
	process.exit(0);
}
console.log(`Verifying: ${components.join(', ')}${note ? ` (${note})` : ''}`);

// A component's story file and Cypress file do not always share its folder name, so only the
// ones that exist are checked. Both checks stop once Storybook and Cypress are removed.
const stories = components.filter((c) => existsSync(path.join(ROOT, `apps/ui-storybook/stories/${c}.stories.ts`)));
const cypress = components.filter((c) => existsSync(path.join(ROOT, `apps/ui-storybook-e2e/src/integration/${c}`)));

let ok = true;
if (stories.length > 0) {
	ok = run('Test pages match the stories', node, ['tools/verify/story-to-test-pages.mjs', ...stories, '--check']) && ok;
}
if (cypress.length > 0) {
	ok =
		run('Converted tests match the Cypress sources', node, [
			'tools/verify/cypress-to-playwright.mjs',
			...cypress,
			'--check',
		]) && ok;
}
if (!ok) {
	console.error(
		'\nGenerated files are out of date. Re-run the transforms (see tools/verify/README.md) and commit the result.',
	);
	process.exit(1);
}

const testsPassed = run('Playwright tests', node, [
	'node_modules/@playwright/test/cli.js',
	'test',
	'--config',
	'apps/ui-e2e/playwright.config.ts',
	...components.map((c) => `src/${c}/`),
	...passthrough,
]);
run('Proof', node, ['tools/verify/proof.mjs']);
process.exit(testsPassed ? 0 : 1);
