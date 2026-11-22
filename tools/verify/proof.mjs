#!/usr/bin/env node
// Turns a Playwright run into the proof a reviewer reads instead of the code.
//
//   node tools/verify/proof.mjs [--results <results.json>[,<more.json>]] [--baseline <results.json>] [--out <dir>]
//
// Writes two files into the output folder:
//   proof.md     short summary for a pull request comment
//   index.html   one self-contained page: every test with its video, final screenshot and
//                accessibility results. With --baseline (a run of the same tests on the base
//                commit) each test shows before and after side by side and says what changed.

import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { comparePng } from './lib/png.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const DEFAULT_DIR = path.join(ROOT, 'dist/.playwright/ui-e2e');
/** Videos above this total are linked by file name instead of embedded, to keep the page openable. */
const EMBED_LIMIT = 40 * 1024 * 1024;
/** Final screenshots that differ in at most this many pixels count as the same picture. */
const MIN_CHANGED_PIXELS = 25;

function option(name, fallback) {
	const index = process.argv.indexOf(name);
	return index > -1 ? path.resolve(process.argv[index + 1]) : fallback;
}

/** Flattens Playwright's JSON report into one record per test. */
export function readRun(resultsFile) {
	const report = JSON.parse(readFileSync(resultsFile, 'utf8'));
	const tests = [];
	const visit = (suite, titles) => {
		for (const spec of suite.specs ?? []) {
			for (const test of spec.tests ?? []) {
				const result = test.results?.[test.results.length - 1];
				const attachment = (name) => result?.attachments?.find((item) => item.name === name)?.path;
				// Small attachments are stored inline in the report (base64), larger ones as files.
				const a11yFile = result?.attachments?.find((item) => item.name === 'a11y.json');
				const a11y = a11yFile?.body
					? JSON.parse(Buffer.from(a11yFile.body, 'base64').toString('utf8'))
					: a11yFile?.path && existsSync(a11yFile.path)
						? JSON.parse(readFileSync(a11yFile.path, 'utf8'))
						: [];
				const file = spec.file ?? suite.file ?? '';
				tests.push({
					key: [file, ...titles, spec.title].join(' › '),
					component: file.split('/')[0] || 'other',
					file,
					path: titles,
					title: spec.title,
					status: test.status === 'expected' ? 'passed' : test.status === 'unexpected' ? 'failed' : test.status,
					duration: result?.duration ?? 0,
					error: result?.errors?.[0]?.message?.replace(/\u001b\[[0-9;]*m/g, '') ?? null,
					errorAt: result?.errorLocation ?? result?.errors?.[0]?.location ?? null,
					video: attachment('video'),
					screenshot: attachment('final') ?? attachment('screenshot'),
					a11y,
				});
			}
		}
		for (const child of suite.suites ?? [])
			visit(child, child.file === child.title ? titles : [...titles, child.title]);
	};
	for (const suite of report.suites ?? []) visit(suite, []);
	return { tests, stats: report.stats ?? {} };
}

/** What a reviewer needs to know about one test compared with the base commit. */
export function compare(test, before) {
	if (!before) return 'new';
	if (before.status !== test.status) return `${before.status} → ${test.status}`;
	if (test.screenshot && before.screenshot && existsSync(test.screenshot) && existsSync(before.screenshot)) {
		const now = readFileSync(test.screenshot);
		const then = readFileSync(before.screenshot);
		if (!now.equals(then)) {
			const { sameSize, changedPixels } = comparePng(now, then);
			// A handful of pixels is rendering noise, not a change someone made.
			if (!sameSize || changedPixels > MIN_CHANGED_PIXELS) return 'looks different';
		}
	}
	return 'unchanged';
}

function dataUri(file, type) {
	return `data:${type};base64,${readFileSync(file).toString('base64')}`;
}

function escapeHtml(text) {
	return String(text).replace(/[&<>"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[char]);
}

function a11ySummary(test) {
	const checks = test.a11y.length;
	const violations = test.a11y.reduce((sum, check) => sum + check.violations.length, 0);
	const rules = test.a11y.reduce((sum, check) => sum + check.passes, 0);
	return { checks, violations, rules };
}

function groupByComponent(tests) {
	const groups = new Map();
	for (const test of tests) {
		if (!groups.has(test.component)) groups.set(test.component, []);
		groups.get(test.component).push(test);
	}
	return [...groups.entries()].sort(([a], [b]) => a.localeCompare(b));
}

export function buildMarkdown(run, baseline) {
	const before = new Map((baseline?.tests ?? []).map((test) => [test.key, test]));
	const lines = ['## Verification proof', ''];
	const failed = run.tests.filter((test) => test.status === 'failed');
	const totals = { passed: 0, failed: 0, skipped: 0, flaky: 0 };
	for (const test of run.tests) totals[test.status] = (totals[test.status] ?? 0) + 1;
	lines.push(
		failed.length === 0
			? `**${totals.passed} tests passed**${totals.skipped ? `, ${totals.skipped} skipped` : ''}${totals.flaky ? `, ${totals.flaky} flaky` : ''}.`
			: `**${failed.length} of ${run.tests.length} tests failed.**`,
		'',
	);

	const header = baseline
		? ['Component', 'Passed', 'Failed', 'Skipped', 'Accessibility checks', 'Violations', 'Compared with base']
		: ['Component', 'Passed', 'Failed', 'Skipped', 'Accessibility checks', 'Violations'];
	lines.push(`| ${header.join(' | ')} |`, `| ${header.map(() => '---').join(' | ')} |`);
	for (const [component, tests] of groupByComponent(run.tests)) {
		const count = (status) => tests.filter((test) => test.status === status).length;
		const a11y = tests.map(a11ySummary);
		const row = [
			component,
			count('passed'),
			count('failed'),
			count('skipped'),
			a11y.reduce((sum, item) => sum + item.checks, 0),
			a11y.reduce((sum, item) => sum + item.violations, 0),
		];
		if (baseline) {
			const changes = tests
				.map((test) => compare(test, before.get(test.key)))
				.filter((change) => change !== 'unchanged');
			const tally = new Map();
			for (const change of changes) tally.set(change, (tally.get(change) ?? 0) + 1);
			row.push(tally.size === 0 ? 'no change' : [...tally].map(([change, n]) => `${n} ${change}`).join(', '));
		}
		lines.push(`| ${row.join(' | ')} |`);
	}

	if (baseline) {
		const now = new Set(run.tests.map((test) => test.key));
		const removed = baseline.tests.filter((test) => !now.has(test.key));
		if (removed.length > 0) {
			lines.push('', `**${removed.length} tests exist on the base commit and not here:**`);
			for (const test of removed) lines.push(`- ${test.key}`);
		}
	}

	if (failed.length > 0) {
		lines.push('', '### Failures', '');
		for (const test of failed) {
			lines.push(
				`- **${test.key}**`,
				'  ```',
				...String(test.error ?? '')
					.split('\n')
					.slice(0, 8)
					.map((line) => `  ${line}`),
				'  ```',
			);
		}
	}

	lines.push(
		'',
		'Videos, screenshots and the full accessibility results are in the `verification-proof` artifact (`index.html`).',
		'',
	);
	return lines.join('\n');
}

export function buildHtml(run, baseline) {
	const before = new Map((baseline?.tests ?? []).map((test) => [test.key, test]));
	const videoFiles = [...run.tests, ...(baseline?.tests ?? [])]
		.map((test) => test.video)
		.filter((file) => file && existsSync(file));
	const embed = videoFiles.reduce((sum, file) => sum + statSync(file).size, 0) <= EMBED_LIMIT;

	const media = (test, label) => {
		if (!test) return `<figure><figcaption>${label}</figcaption><p class="none">not on the base commit</p></figure>`;
		const video =
			test.video && existsSync(test.video)
				? embed
					? `<video controls muted preload="metadata" src="${dataUri(test.video, 'video/webm')}"></video>`
					: `<p class="none">video: ${escapeHtml(path.relative(DEFAULT_DIR, test.video))}</p>`
				: '<p class="none">no video</p>';
		const shot =
			test.screenshot && existsSync(test.screenshot)
				? `<img alt="Final screenshot" loading="lazy" src="${dataUri(test.screenshot, 'image/png')}">`
				: '';
		return `<figure><figcaption>${label}</figcaption>${video}${shot}</figure>`;
	};

	const sections = groupByComponent(run.tests)
		.map(([component, tests]) => {
			const cards = tests
				.map((test) => {
					const a11y = a11ySummary(test);
					const change = baseline ? compare(test, before.get(test.key)) : null;
					const violations = test.a11y.flatMap((check) => check.violations);
					return `
<article class="${test.status}">
	<header>
		<span class="status">${test.status}</span>
		${change ? `<span class="change ${change === 'unchanged' ? 'same' : 'diff'}">${escapeHtml(change)}</span>` : ''}
		<h3>${escapeHtml(test.title)}</h3>
		<p class="where">${escapeHtml([...test.path].join(' › '))} · ${escapeHtml(test.file)} · ${(test.duration / 1000).toFixed(1)}s</p>
	</header>
	${test.error ? `<pre>${escapeHtml(test.error.split('\n').slice(0, 12).join('\n'))}</pre>` : ''}
	<p class="a11y">${
		a11y.checks === 0
			? 'No accessibility check in this test.'
			: `${a11y.checks} accessibility ${a11y.checks === 1 ? 'check' : 'checks'}, ${a11y.rules} rules passed, ${a11y.violations} violations.`
	}</p>
	${violations.length ? `<ul>${violations.map((v) => `<li><a href="${escapeHtml(v.helpUrl)}">${escapeHtml(v.id)}</a>: ${escapeHtml(v.help)}</li>`).join('')}</ul>` : ''}
	<div class="media">${baseline ? media(before.get(test.key), 'Before (base)') : ''}${media(test, baseline ? 'After (this change)' : 'Recording')}</div>
</article>`;
				})
				.join('\n');
			return `<section><h2>${escapeHtml(component)}</h2>${cards}</section>`;
		})
		.join('\n');

	const totals = { passed: 0, failed: 0, skipped: 0 };
	for (const test of run.tests) totals[test.status] = (totals[test.status] ?? 0) + 1;

	return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Verification proof</title>
<style>
	:root { color-scheme: light dark; --line: #d4d4d4; --muted: #6b6b6b; --ok: #15803d; --bad: #b91c1c; --warn: #b45309; }
	@media (prefers-color-scheme: dark) { :root { --line: #3a3a3a; --muted: #a3a3a3; --ok: #4ade80; --bad: #f87171; --warn: #fbbf24; } }
	body { font: 15px/1.5 system-ui, sans-serif; margin: 0 auto; max-width: 1100px; padding: 24px 16px 64px; }
	h1 { font-size: 24px; margin: 0 0 4px; } h2 { font-size: 19px; margin: 40px 0 12px; text-transform: capitalize; }
	h3 { font-size: 15px; margin: 6px 0 2px; }
	.totals { color: var(--muted); margin: 0 0 8px; }
	article { border: 1px solid var(--line); border-radius: 8px; margin: 0 0 16px; padding: 14px 16px; }
	.status, .change { border-radius: 4px; display: inline-block; font-size: 12px; font-weight: 600; padding: 1px 8px; border: 1px solid currentColor; }
	.passed .status, .same { color: var(--ok); } .failed .status { color: var(--bad); } .skipped .status, .diff { color: var(--warn); }
	.where, .a11y, figcaption, .none { color: var(--muted); font-size: 13px; margin: 2px 0; }
	pre { background: rgba(127,127,127,.12); border-radius: 6px; font-size: 12px; overflow: auto; padding: 10px; }
	.media { display: grid; gap: 12px; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); margin-top: 10px; }
	figure { margin: 0; } video, img { border: 1px solid var(--line); border-radius: 6px; display: block; margin-top: 6px; max-width: 100%; }
</style>
</head>
<body>
<h1>Verification proof</h1>
<p class="totals">${totals.passed} passed, ${totals.failed} failed, ${totals.skipped} skipped${baseline ? ' · compared with the base commit' : ''}. Each test shows its recording first and its final screenshot below it.</p>
${sections}
</body>
</html>
`;
}

function main() {
	// Several runs can be given as a comma-separated list; their tests are shown together.
	const resultsIndex = process.argv.indexOf('--results');
	const resultsFiles =
		resultsIndex > -1
			? process.argv[resultsIndex + 1].split(',').map((file) => path.resolve(file))
			: [path.join(DEFAULT_DIR, 'results.json')];
	const baselineFile = option('--baseline', null);
	const outDir = option('--out', path.join(DEFAULT_DIR, 'proof'));

	const runs = resultsFiles.map(readRun);
	const run = { tests: runs.flatMap((item) => item.tests), stats: runs[0].stats };
	const baseline = baselineFile ? readRun(baselineFile) : null;
	mkdirSync(outDir, { recursive: true });
	writeFileSync(path.join(outDir, 'proof.md'), buildMarkdown(run, baseline));
	writeFileSync(path.join(outDir, 'index.html'), buildHtml(run, baseline));
	console.log(`Proof for ${run.tests.length} tests written to ${path.relative(ROOT, outDir)}`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
