import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { format } from './format.mjs';
import { readManualTitles } from './manual.mjs';
import { transformSource } from './transform.mjs';

export const SOURCE_DIR = 'apps/ui-storybook-e2e/src/integration';

/**
 * Repo-relative POSIX path when inside the repo, else the absolute path.
 * @param {string} repoRoot
 * @param {string} abs
 */
export function displayPath(repoRoot, abs) {
	const rel = path.relative(repoRoot, abs);
	if (!rel || rel.startsWith('..') || path.isAbsolute(rel)) return abs.split(path.sep).join('/');
	return rel.split(path.sep).join('/');
}

/**
 * All component folders that contain Cypress specs, sorted.
 * @param {string} repoRoot
 * @returns {string[]}
 */
export function listComponents(repoRoot) {
	const dir = path.join(repoRoot, SOURCE_DIR);
	return readdirSync(dir)
		.filter((d) => statSync(path.join(dir, d)).isDirectory() && sourcesFor(repoRoot, d).length > 0)
		.sort();
}

/**
 * Cypress spec files of a component, sorted.
 * @param {string} repoRoot
 * @param {string} component
 * @returns {{ file: string, basename: string }[]}
 */
export function sourcesFor(repoRoot, component) {
	const dir = path.join(repoRoot, SOURCE_DIR, component);
	if (!existsSync(dir)) return [];
	return readdirSync(dir)
		.filter((f) => f.endsWith('.cy.ts'))
		.sort()
		.map((f) => ({ file: path.join(dir, f), basename: f.slice(0, -'.cy.ts'.length) }));
}

/**
 * @typedef {object} ConvertedFile
 * @property {string} key `<component>/<basename>`
 * @property {string} outputPath absolute output path
 * @property {string} code formatted Playwright source
 * @property {boolean} formatted
 * @property {import('./report.mjs').FileEntry} entry
 */

/**
 * Convert every Cypress spec of a component.
 * @param {string} repoRoot
 * @param {string} component
 * @param {string} outDir absolute
 * @returns {Promise<ConvertedFile[]>}
 */
export async function convertComponent(repoRoot, component, outDir) {
	/** @type {ConvertedFile[]} */
	const results = [];
	for (const { file, basename } of sourcesFor(repoRoot, component)) {
		const sourcePath = displayPath(repoRoot, file);
		const outputPath = path.join(outDir, component, `${basename}.spec.ts`);
		const manualTitles = readManualTitles(path.join(outDir, component, `${basename}.manual.spec.ts`));
		const { code, tests, helpers } = transformSource(readFileSync(file, 'utf8'), {
			sourcePath,
			basename,
			manualTitles,
		});
		const f = await format(code, repoRoot, `apps/ui-e2e/src/${component}/${basename}.spec.ts`);
		results.push({
			key: `${component}/${basename}`,
			outputPath,
			code: f.code,
			formatted: f.formatted,
			entry: {
				source: sourcePath,
				output: displayPath(repoRoot, outputPath),
				converted: tests.filter((t) => t.status === 'converted').length,
				skipped: tests
					.filter((t) => t.status === 'skipped')
					.map((t) => ({ title: t.title, describePath: t.describePath, reasons: t.reasons })),
				ported: tests.filter((t) => t.status === 'ported').map((t) => t.title),
				helpers,
			},
		});
	}
	return results;
}
