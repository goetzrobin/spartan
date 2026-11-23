#!/usr/bin/env node

import { ESLint } from 'eslint';
import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { compare, countLint, lower, missing } from './lib/compare.mjs';
import { countDependencies, formatDependencyReport, PUBLISHED } from './lib/dependencies.mjs';
import { compareParts, extractApply, extractMarkedClasses, formatReport, mergeParts, STYLE } from './lib/parity.mjs';
import { aggregateStructure, countStructure, isLibrarySource } from './lib/structure.mjs';
import { countCompilerErrors, errorLines } from './lib/types.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const BASELINE = path.join(ROOT, 'tools/ratchet/baseline.json');
const CONFIG = path.join(ROOT, 'tools/ratchet/eslint.ratchet.config.cjs');
const SHADCN = path.join(ROOT, 'tools/ratchet/shadcn-classes.json');
const ALLOW = path.join(ROOT, 'tools/ratchet/shadcn-allow.json');
const REQUIREMENTS = path.join(ROOT, 'tools/ratchet/published-requirements.json');
const REGISTRY_CSS = path.join(ROOT, `libs/registry/src/styles/style-${STYLE}.css`);
const NGC = path.join(ROOT, 'node_modules/.bin/ngc');
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

function sourceFiles(library) {
	const directory = path.join(ROOT, 'libs', library);
	return readdirSync(directory, { recursive: true })
		.map((name) => path.join('libs', library, name))
		.filter((relativePath) => isLibrarySource(relativePath))
		.sort()
		.map((relativePath) => ({ relativePath, text: readFileSync(path.join(ROOT, relativePath), 'utf8') }));
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

function structureCounts() {
	const files = LIBRARIES.flatMap((library) =>
		sourceFiles(library).map(({ relativePath, text }) => ({ library, counts: countStructure(relativePath, text) })),
	);
	return aggregateStructure(files, LIBRARIES);
}

function typeCounts() {
	const counts = { exactOptionalPropertyTypes: {} };
	for (const library of LIBRARIES) {
		const result = spawnSync(
			NGC,
			['-p', `libs/${library}/tsconfig.lib.json`, '--noEmit', '--pretty', 'false', '--exactOptionalPropertyTypes'],
			{
				cwd: ROOT,
				encoding: 'utf8',
				maxBuffer: 64 * 1024 * 1024,
				env: { ...process.env, NODE_OPTIONS: '--max-old-space-size=4096' },
			},
		);
		const output = `${result.stdout ?? ''}\n${result.stderr ?? ''}`;
		if (result.error || (result.status !== 0 && errorLines(output).length === 0)) {
			const reason = result.error?.message ?? `exit ${result.status ?? result.signal}`;
			console.error(`ratchet: ngc for ${library} ended abnormally without error lines (${reason}):`);
			console.error(output.trim().split('\n').slice(-20).join('\n'));
			process.exit(2);
		}
		counts.exactOptionalPropertyTypes[library] = countCompilerErrors(output, library);
	}
	return counts;
}

let parityResult;

function parityCounts() {
	const snapshot = JSON.parse(readFileSync(SHADCN, 'utf8'));
	const allow = existsSync(ALLOW) ? JSON.parse(readFileSync(ALLOW, 'utf8')) : {};
	if (snapshot.style !== STYLE) {
		console.error(`ratchet: shadcn-classes.json is for style "${snapshot.style}", expected "${STYLE}"`);
		process.exit(2);
	}
	const helm = mergeParts(
		extractApply(readFileSync(REGISTRY_CSS, 'utf8'), 'spartan-').parts,
		...sourceFiles('helm').map(({ relativePath, text }) => extractMarkedClasses(relativePath, text, 'spartan-')),
	);
	parityResult = compareParts(snapshot.parts, helm, allow);
	return parityResult.counts;
}

let dependencyResult;

function dependencyCounts() {
	const manifests = Object.fromEntries(
		PUBLISHED.map((library) => [
			library,
			JSON.parse(readFileSync(path.join(ROOT, 'libs', library, 'package.json'), 'utf8')),
		]),
	);
	dependencyResult = countDependencies(manifests, JSON.parse(readFileSync(REQUIREMENTS, 'utf8')));
	return dependencyResult.counts;
}

const SECTIONS = [
	{ name: 'lint', count: lintCounts },
	{ name: 'structure', count: structureCounts },
	{ name: 'types', count: typeCounts },
	{ name: 'shadcnParity', count: parityCounts, report: () => formatReport(parityResult) },
	{ name: 'dependencies', count: dependencyCounts, report: () => formatDependencyReport(dependencyResult) },
];

function readBaseline() {
	return existsSync(BASELINE) ? JSON.parse(readFileSync(BASELINE, 'utf8')) : {};
}

function writeBaseline(baseline) {
	writeFileSync(BASELINE, `${JSON.stringify(baseline, null, '\t')}\n`);
}

function describe(entry) {
	return `${entry.section} ${entry.metric} [${entry.library}]: baseline ${entry.baseline}, current ${entry.current}`;
}

function selectSections(argv) {
	const index = argv.indexOf('--only');
	if (index === -1) return SECTIONS;
	const name = argv[index + 1];
	const section = SECTIONS.find((candidate) => candidate.name === name);
	if (!section) {
		console.error(`ratchet: unknown section "${name}"; known: ${SECTIONS.map((s) => s.name).join(', ')}`);
		process.exit(2);
	}
	return [section];
}

async function main() {
	const argv = process.argv.slice(2);
	const args = new Set(argv);
	const quiet = args.has('--json');
	const sections = selectSections(argv);
	const started = performance.now();
	const current = {};
	for (const section of sections) {
		const sectionStarted = performance.now();
		current[section.name] = await section.count();
		const sectionSeconds = ((performance.now() - sectionStarted) / 1000).toFixed(1);
		if (!quiet) console.log(`ratchet: counted ${section.name} in ${sectionSeconds}s`);
	}
	const seconds = ((performance.now() - started) / 1000).toFixed(1);

	if (quiet) {
		console.log(JSON.stringify(current, null, '\t'));
		return;
	}

	if (args.has('--report')) {
		for (const section of sections) {
			if (section.report) console.log(section.report());
		}
	}

	const baseline = readBaseline();

	if (args.has('--update')) {
		const next = lower(baseline, current);
		writeBaseline(next);
		const { lowered } = compare(baseline, next);
		for (const entry of lowered) console.log(`lowered ${describe(entry)}`);
		for (const entry of missing(baseline, current)) {
			console.log(`added ${entry.section} ${entry.metric} [${entry.library}]: ${entry.current}`);
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
				`ratchet: ${entry.section} ${entry.metric} [${entry.library}] is not in the baseline (current ${entry.current}); run pnpm ratchet --update`,
			);
		}
		console.error('ratchet: failed. Fix the new findings; counts may only go down.');
		process.exit(1);
	}

	console.log(`ratchet: ok, no count is above its baseline (${seconds}s)`);
}

await main();
