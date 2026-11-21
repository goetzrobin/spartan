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
import { existsSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { affectedComponents, listComponents, parseStatus, storyTitlesOf } from './lib/affected.mjs';
import { groupUnits, joinResults } from './lib/groups.mjs';

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

// The story files behind a component's tests come from the test page list, because a test
// folder can cover several story files (`menu` covers context-menu, dropdown-menu and menubar).
// Both checks stop once Storybook and Cypress are removed.
const manifestFile = path.join(ROOT, 'apps/ui-e2e/test-pages.json');
const manifest = existsSync(manifestFile) ? JSON.parse(readFileSync(manifestFile, 'utf8')).pages : [];
const titles = new Set(components.flatMap((component) => [component, ...storyTitlesOf(ROOT, component)]));
const stories = [
	...new Set(
		manifest
			.filter((page) => titles.has(page.id.split('--')[0]))
			.map((page) => path.basename(page.source, '.stories.ts')),
	),
].sort();
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

// One Playwright run serves every page it opens from one dev server, and the server keeps each
// page it has built in memory. Past a certain number of pages it runs out. So a large selection is
// run in groups, each with a fresh server, and the results are joined afterwards.
const everyTitle = [...new Set(manifest.map((page) => page.id.split('--')[0]))];
const pagesOf = (unitTitles) => manifest.filter((page) => unitTitles.includes(page.id.split('--')[0])).length;
const units = components.map((component) => {
	const unitTitles = [...new Set([component, ...storyTitlesOf(ROOT, component)])];
	return { dirs: [`src/${component}/`], titles: unitTitles, pages: pagesOf(unitTitles) };
});
if (flag('--all')) {
	// Pages no test folder opens still get the render check.
	for (const title of everyTitle.filter((t) => !titles.has(t))) {
		units.push({ dirs: [], titles: [title], pages: pagesOf([title]) });
	}
}
const groups = groupUnits(units, Number(process.env['VERIFY_MAX_PAGES'] ?? 60));

const outDir = path.join(ROOT, 'dist/.playwright/ui-e2e');
const resultFiles = [];
// Leftovers of an earlier grouped run must not end up in this run's proof.
if (existsSync(outDir)) {
	for (const name of readdirSync(outDir)) {
		if (/^(results|output|report)-\d+(\.json)?$/.test(name)) rmSync(path.join(outDir, name), { recursive: true });
	}
}
let testsPassed = true;
groups.forEach((group, index) => {
	const many = groups.length > 1;
	const label = many ? `Playwright tests, group ${index + 1} of ${groups.length}` : 'Playwright tests';
	const env = { ...process.env, VERIFY_TITLES: [...new Set(group.flatMap((unit) => unit.titles))].join(',') };
	const extra = [];
	if (many) {
		// Each run clears its output folder, so every group gets its own.
		const results = path.join(outDir, `results-${index + 1}.json`);
		resultFiles.push(results);
		env['PLAYWRIGHT_JSON_OUTPUT_FILE'] = results;
		env['PLAYWRIGHT_HTML_OUTPUT_DIR'] = path.join(outDir, `report-${index + 1}`);
		extra.push('--output', path.join(outDir, `output-${index + 1}`));
	}
	const passed = run(
		label,
		node,
		[
			'node_modules/@playwright/test/cli.js',
			'test',
			'--config',
			'apps/ui-e2e/playwright.config.ts',
			...group.flatMap((unit) => unit.dirs),
			'src/_pages/',
			...extra,
			...passthrough,
		],
		{ env },
	);
	testsPassed = passed && testsPassed;
});
if (resultFiles.length > 0) {
	const found = resultFiles.filter((file) => existsSync(file));
	writeFileSync(path.join(outDir, 'results.json'), JSON.stringify(joinResults(found.map(readJson))));
}
run('Proof', node, ['tools/verify/proof.mjs']);
process.exit(testsPassed ? 0 : 1);

function readJson(file) {
	return JSON.parse(readFileSync(file, 'utf8'));
}
