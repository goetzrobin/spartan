#!/usr/bin/env node

import { ESLint } from 'eslint';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { compare, countLint, lower, missing } from './lib/compare.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const BASELINE = path.join(ROOT, 'tools/ratchet/baseline.json');
const CONFIG = path.join(ROOT, 'tools/ratchet/eslint.ratchet.config.cjs');
const LIBRARIES = ['brain', 'helm'];
const RULES = [
	'@typescript-eslint/no-unsafe-member-access',
	'@typescript-eslint/no-unsafe-argument',
	'@typescript-eslint/no-unsafe-assignment',
	'@typescript-eslint/no-unsafe-call',
	'@typescript-eslint/no-unsafe-return',
	'@typescript-eslint/no-explicit-any',
	'@typescript-eslint/no-unnecessary-condition',
	'@typescript-eslint/restrict-template-expressions',
];

function libraryOf(filePath) {
	const [libs, library] = path.relative(ROOT, filePath).split(path.sep);
	return libs === 'libs' ? library : undefined;
}

async function lintCounts() {
	const eslint = new ESLint({ cwd: ROOT, overrideConfigFile: CONFIG });
	const results = await eslint.lintFiles(LIBRARIES.map((library) => `libs/${library}/**/*.ts`));
	const fatal = results.flatMap((result) =>
		result.messages
			.filter((message) => message.fatal)
			.map((message) => `${path.relative(ROOT, result.filePath)}:${message.line}: ${message.message}`),
	);
	if (fatal.length > 0) {
		console.error(`ratchet: ESLint could not parse ${fatal.length} file(s):\n  ${fatal.join('\n  ')}`);
		process.exit(2);
	}
	return countLint(results, RULES, LIBRARIES, libraryOf);
}

function readBaseline() {
	return existsSync(BASELINE) ? JSON.parse(readFileSync(BASELINE, 'utf8')) : {};
}

function writeBaseline(baseline) {
	writeFileSync(BASELINE, `${JSON.stringify(baseline, null, '\t')}\n`);
}

function describe(entry) {
	return `${entry.kind} ${entry.rule} [${entry.library}]: baseline ${entry.baseline}, current ${entry.current}`;
}

async function main() {
	const args = new Set(process.argv.slice(2));
	const started = performance.now();
	const current = { lint: await lintCounts() };
	const seconds = ((performance.now() - started) / 1000).toFixed(1);

	if (args.has('--json')) {
		console.log(JSON.stringify(current, null, '\t'));
		return;
	}

	const baseline = readBaseline();

	if (args.has('--update')) {
		const next = lower(baseline, current);
		writeBaseline(next);
		const { lowered } = compare(baseline, next);
		for (const entry of lowered) console.log(`lowered ${describe(entry)}`);
		for (const entry of missing(baseline, current)) {
			console.log(`added ${entry.kind} ${entry.rule} [${entry.library}]: ${entry.current}`);
		}
		const { raised } = compare(next, current);
		for (const entry of raised) console.log(`kept (count is above baseline) ${describe(entry)}`);
		console.log(`ratchet: baseline written to ${path.relative(ROOT, BASELINE)} (${seconds}s)`);
		return;
	}

	const { raised, lowered } = compare(baseline, current);
	const absent = missing(baseline, current);

	for (const entry of lowered) {
		console.log(`ratchet: ${describe(entry)} - the baseline can be lowered (pnpm ratchet --update)`);
	}

	if (raised.length > 0 || absent.length > 0) {
		for (const entry of raised) {
			console.error(`ratchet: count went up for ${describe(entry)}`);
		}
		for (const entry of absent) {
			console.error(
				`ratchet: ${entry.kind} ${entry.rule} [${entry.library}] is not in the baseline (current ${entry.current}); run pnpm ratchet --update`,
			);
		}
		console.error('ratchet: failed. Fix the new findings; counts may only go down.');
		process.exit(1);
	}

	console.log(`ratchet: ok, no count is above its baseline (${seconds}s)`);
}

await main();
