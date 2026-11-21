#!/usr/bin/env node
/**
 * Deterministic Cypress -> Playwright transform for apps/ui-storybook-e2e.
 *
 *   node tools/verify/cypress-to-playwright.mjs <component> [<component> ...]
 *   node tools/verify/cypress-to-playwright.mjs --all
 *
 * Options:
 *   --out-dir <dir>   output root (default apps/ui-e2e/src)
 *   --report <file>   report path (default apps/ui-e2e/conversion-report.json)
 *   --dry-run         print generated files to stdout, write nothing
 *   --check           exit 1 when generated output differs from disk, write nothing
 *
 * Tests the tool cannot convert with certainty are emitted as `test.fixme` with the original code
 * and listed in the report. See tools/verify/lib/cy/chain.mjs for the mapping.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { mergeReport, readReport, serializeReport } from './lib/cy/report.mjs';
import { convertComponent, displayPath, listComponents, sourcesFor } from './lib/cy/run.mjs';

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

const USAGE = `Usage: node tools/verify/cypress-to-playwright.mjs (<component>... | --all) [--out-dir <dir>] [--report <file>] [--dry-run] [--check]`;

/**
 * @param {string[]} argv
 */
function parseArgs(argv) {
	const opts = {
		all: false,
		dryRun: false,
		check: false,
		outDir: 'apps/ui-e2e/src',
		report: 'apps/ui-e2e/conversion-report.json',
		/** @type {string[]} */ components: [],
	};
	for (let i = 0; i < argv.length; i++) {
		const a = argv[i];
		const value = () => {
			const v = argv[++i];
			if (v === undefined) throw new Error(`${a} needs a value`);
			return v;
		};
		if (a === '--all') opts.all = true;
		else if (a === '--dry-run') opts.dryRun = true;
		else if (a === '--check') opts.check = true;
		else if (a === '--out-dir') opts.outDir = value();
		else if (a.startsWith('--out-dir=')) opts.outDir = a.slice('--out-dir='.length);
		else if (a === '--report') opts.report = value();
		else if (a.startsWith('--report=')) opts.report = a.slice('--report='.length);
		else if (a === '-h' || a === '--help') {
			console.log(USAGE);
			process.exit(0);
		} else if (a.startsWith('-')) throw new Error(`unknown option ${a}`);
		else opts.components.push(a);
	}
	return opts;
}

async function main() {
	let opts;
	try {
		opts = parseArgs(process.argv.slice(2));
	} catch (e) {
		console.error(`${e instanceof Error ? e.message : e}\n${USAGE}`);
		return 2;
	}
	const components = opts.all ? listComponents(REPO_ROOT) : [...new Set(opts.components)].sort();
	if (!components.length) {
		console.error(USAGE);
		return 2;
	}
	const unknown = components.filter((c) => sourcesFor(REPO_ROOT, c).length === 0);
	if (unknown.length) {
		console.error(`No Cypress specs for: ${unknown.join(', ')}`);
		return 2;
	}
	const outDir = path.resolve(REPO_ROOT, opts.outDir);
	const reportPath = path.resolve(REPO_ROOT, opts.report);

	const files = [];
	for (const c of components) files.push(...(await convertComponent(REPO_ROOT, c, outDir)));

	const entries = Object.fromEntries(files.map((f) => [f.key, f.entry]));
	const report = mergeReport(readReport(reportPath), entries);
	const reportText = await serializeReport(report, REPO_ROOT);

	let differs = 0;
	for (const f of files) {
		if (opts.dryRun) {
			process.stdout.write(`// ===== ${displayPath(REPO_ROOT, f.outputPath)}\n${f.code}\n`);
		} else if (opts.check) {
			const onDisk = existsSync(f.outputPath) ? readFileSync(f.outputPath, 'utf8') : null;
			if (onDisk !== f.code) {
				differs++;
				console.log(`differs: ${displayPath(REPO_ROOT, f.outputPath)}`);
			}
		} else {
			mkdirSync(path.dirname(f.outputPath), { recursive: true });
			writeFileSync(f.outputPath, f.code);
		}
		if (!f.formatted) console.error(`warning: prettier failed for ${f.key}, wrote unformatted output`);
	}
	if (opts.check) {
		const onDisk = existsSync(reportPath) ? readFileSync(reportPath, 'utf8') : null;
		if (onDisk !== reportText) {
			differs++;
			console.log(`differs: ${displayPath(REPO_ROOT, reportPath)}`);
		}
	} else if (!opts.dryRun) {
		mkdirSync(path.dirname(reportPath), { recursive: true });
		writeFileSync(reportPath, reportText);
	}

	for (const f of files) {
		const e = f.entry;
		console.log(
			`${f.key}: ${e.converted} converted, ${e.skipped.length} skipped, ${e.ported.length} ported -> ${e.output}`,
		);
	}
	const sel = files.reduce(
		(t, f) => ({
			converted: t.converted + f.entry.converted,
			skipped: t.skipped + f.entry.skipped.length,
			ported: t.ported + f.entry.ported.length,
		}),
		{ converted: 0, skipped: 0, ported: 0 },
	);
	console.log(
		`total (this run): ${files.length} files, ${sel.converted + sel.skipped + sel.ported} tests, ${sel.converted} converted, ${sel.skipped} skipped, ${sel.ported} ported`,
	);
	const t = report.totals;
	console.log(
		`total (report): ${t.files} files, ${t.tests} tests, ${t.converted} converted, ${t.skipped} skipped, ${t.ported} ported`,
	);
	if (opts.check && differs) {
		console.log(`${differs} file(s) out of date; re-run without --check`);
		return 1;
	}
	return 0;
}

main().then(
	(code) => process.exit(code),
	(e) => {
		console.error(e);
		process.exit(1);
	},
);
