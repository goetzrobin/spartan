#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { comparePng, diffPng } from './lib/png.mjs';
import { readRun } from './proof.mjs';

const MIN_CHANGED_PIXELS = 25;
const SHOWN_INLINE = 6;
const LABELS = { _pages: 'Every page loads' };

export function screenshotId(key) {
	return createHash('sha1').update(key).digest('hex').slice(0, 16);
}

export function label(component) {
	return LABELS[component] ?? component;
}

export function classify(test, baselineDir) {
	if (!test.screenshot || !existsSync(test.screenshot)) return { state: 'none' };
	const reference = baselineDir ? path.join(baselineDir, `${screenshotId(test.key)}.png`) : null;
	if (!reference || !existsSync(reference)) return { state: 'new' };
	const after = readFileSync(test.screenshot);
	const before = readFileSync(reference);
	if (after.equals(before)) return { state: 'same' };
	const { sameSize, changedPixels } = comparePng(before, after);
	if (sameSize && changedPixels <= MIN_CHANGED_PIXELS) return { state: 'same' };
	return { state: 'changed', before, after, changedPixels, sameSize };
}

export function buildComment({ tests, compared, baseName, imageBase, unselected, proofUrl }) {
	const count = (status) => tests.filter((test) => test.status === status).length;
	const failed = tests.filter((test) => test.status === 'failed');
	const changed = compared.filter((item) => item.state === 'changed');
	const fresh = compared.filter((item) => item.state === 'new');
	const withShot = compared.filter((item) => item.state !== 'none');
	const hasBaseline = withShot.some((item) => item.state !== 'new');

	const verdict = [
		tests.length === 0 ? '**No tests ran.**' : `**${count('passed')} passed, ${failed.length} failed.**`,
	];
	if (hasBaseline) {
		verdict.push(`${changed.length} of ${withShot.length} screenshots changed against \`${baseName}\`.`);
		if (fresh.length > 0) verdict.push(`${fresh.length} are new.`);
	}
	const lines = ['<!-- verification-proof -->', verdict.join(' '), ''];

	if (failed.length > 0) {
		lines.push('### Failed', '');
		for (const test of failed) {
			const first =
				String(test.error ?? '')
					.split('\n')
					.find((line) => line.trim()) ?? '';
			lines.push(`- **${label(test.component)}** · ${test.title}: \`${first.trim().slice(0, 160)}\``);
		}
		lines.push('');
	}

	if (changed.length > 0) {
		lines.push('### Changed screenshots', '');
		for (const item of changed.slice(0, SHOWN_INLINE)) {
			const id = screenshotId(item.test.key);
			const cell = (kind) => `<img width="260" alt="${kind}" src="${imageBase}/${id}.${kind}.png">`;
			lines.push(
				`**${label(item.test.component)}** · ${item.test.title}`,
				'',
				'| Before | After | Difference |',
				'| --- | --- | --- |',
				`| ${cell('before')} | ${cell('after')} | ${cell('diff')} |`,
				'',
			);
		}
		if (changed.length > SHOWN_INLINE) {
			lines.push(`<details><summary>${changed.length - SHOWN_INLINE} more changed screenshots</summary>`, '');
			for (const item of changed.slice(SHOWN_INLINE)) {
				const id = screenshotId(item.test.key);
				lines.push(
					`- ${label(item.test.component)} · ${item.test.title}: [before](${imageBase}/${id}.before.png), [after](${imageBase}/${id}.after.png), [difference](${imageBase}/${id}.diff.png)`,
				);
			}
			lines.push('', '</details>', '');
		}
	}

	const gaps = [];
	if (!hasBaseline) gaps.push(`there are no reference screenshots for \`${baseName}\` yet, so nothing was compared`);
	if (unselected > 0) gaps.push(`${unselected} components were not selected by this change and did not run`);
	const unchecked = tests.filter((test) => test.a11y.length === 0).length;
	if (unchecked > 0) gaps.push(`${unchecked} of ${tests.length} tests make no accessibility check`);
	gaps.push('unit tests and the CLI are checked by other workflows');
	lines.push(`**Not proven by this run:** ${gaps.join('; ')}.`, '');

	lines.push('<details><summary>All results</summary>', '');
	lines.push(
		'| Check | Passed | Failed | Accessibility checks | Violations | Screenshots changed |',
		'| --- | --- | --- | --- | --- | --- |',
	);
	const groups = new Map();
	for (const item of compared) {
		if (!groups.has(item.test.component)) groups.set(item.test.component, []);
		groups.get(item.test.component).push(item);
	}
	for (const [component, items] of [...groups].sort(([a], [b]) => label(a).localeCompare(label(b)))) {
		const sum = (pick) => items.reduce((total, item) => total + pick(item), 0);
		lines.push(
			`| ${[
				label(component),
				sum((item) => (item.test.status === 'passed' ? 1 : 0)),
				sum((item) => (item.test.status === 'failed' ? 1 : 0)),
				sum((item) => item.test.a11y.length),
				sum((item) => item.test.a11y.reduce((total, check) => total + check.violations.length, 0)),
				sum((item) => (item.state === 'changed' ? 1 : 0)),
			].join(' | ')} |`,
		);
	}
	lines.push('', '</details>', '');
	if (proofUrl) lines.push(`[Videos and full results](${proofUrl})`, '');
	return lines.join('\n');
}

export function countUnselected(pagesFile, tests) {
	if (!pagesFile || !existsSync(pagesFile)) return 0;
	const all = new Set(JSON.parse(readFileSync(pagesFile, 'utf8')).pages.map((page) => page.id.split('--')[0]));
	const ran = new Set(tests.map((test) => (test.component === '_pages' ? test.title.split('--')[0] : test.component)));
	return [...all].filter((title) => !ran.has(title)).length;
}

function main() {
	const args = process.argv.slice(2);
	const value = (name, fallback = null) => (args.includes(name) ? args[args.indexOf(name) + 1] : fallback);
	const results = (value('--results') ?? '').split(',').filter(Boolean);
	const baselineDir = value('--baseline-dir');
	const saveDir = value('--save-screenshots');
	const changedDir = value('--changed-dir');
	const out = value('--out', 'comment.md');

	const tests = results.flatMap((file) => readRun(path.resolve(file)).tests);
	const compared = tests.map((test) => ({ test, ...classify(test, baselineDir) }));

	if (saveDir) {
		mkdirSync(saveDir, { recursive: true });
		for (const { test, state } of compared) {
			if (state !== 'none') copyFileSync(test.screenshot, path.join(saveDir, `${screenshotId(test.key)}.png`));
		}
	}
	if (changedDir) {
		mkdirSync(changedDir, { recursive: true });
		for (const item of compared.filter((entry) => entry.state === 'changed')) {
			const id = screenshotId(item.test.key);
			writeFileSync(path.join(changedDir, `${id}.before.png`), item.before);
			writeFileSync(path.join(changedDir, `${id}.after.png`), item.after);
			writeFileSync(path.join(changedDir, `${id}.diff.png`), diffPng(item.before, item.after));
		}
	}
	writeFileSync(
		out,
		buildComment({
			tests,
			compared,
			baseName: value('--base-name', 'main'),
			imageBase: value('--image-base', '.'),
			unselected: countUnselected(value('--pages-file'), tests),
			proofUrl: value('--proof-url'),
		}),
	);
	const changed = compared.filter((item) => item.state === 'changed').length;
	console.log(`${tests.length} tests, ${changed} changed screenshots. Comment written to ${out}`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
