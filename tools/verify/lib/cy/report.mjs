import { existsSync, readFileSync } from 'node:fs';
import { format } from './format.mjs';

export const GENERATED_BY = 'tools/verify/cypress-to-playwright.mjs';

/**
 * @typedef {object} FileEntry
 * @property {string} source
 * @property {string} output
 * @property {number} converted
 * @property {{ title: string, describePath: string[], reasons: string[] }[]} skipped
 * @property {string[]} ported
 * @property {{ emitted: string[], unsupported: { name: string, reasons: string[] }[] }} [helpers]
 */

/**
 * @typedef {object} Report
 * @property {string} generatedBy
 * @property {Record<string, FileEntry>} files
 * @property {{ files: number, tests: number, converted: number, skipped: number, ported: number }} totals
 */

/**
 * Read an existing report, or null when missing or unreadable.
 * @param {string} file
 * @returns {Report | null}
 */
export function readReport(file) {
	if (!existsSync(file)) return null;
	try {
		const r = JSON.parse(readFileSync(file, 'utf8'));
		return r && typeof r === 'object' && r.files && typeof r.files === 'object' ? r : null;
	} catch {
		return null;
	}
}

/**
 * Normalise one entry so key order is fixed.
 * @param {FileEntry} e
 * @returns {FileEntry}
 */
function normaliseEntry(e) {
	return {
		source: e.source,
		output: e.output,
		converted: e.converted,
		skipped: (e.skipped ?? []).map((s) => ({
			title: s.title,
			describePath: [...s.describePath],
			reasons: [...s.reasons],
		})),
		ported: [...(e.ported ?? [])],
		helpers: {
			emitted: [...(e.helpers?.emitted ?? [])],
			unsupported: (e.helpers?.unsupported ?? []).map((u) => ({ name: u.name, reasons: [...u.reasons] })),
		},
	};
}

/**
 * Merge new file entries into an existing report. Entries for other files are kept; keys are sorted.
 * @param {Report | null} existing
 * @param {Record<string, FileEntry>} entries
 * @returns {Report}
 */
export function mergeReport(existing, entries) {
	/** @type {Record<string, FileEntry>} */
	const all = { ...(existing?.files ?? {}), ...entries };
	/** @type {Record<string, FileEntry>} */
	const files = {};
	const totals = { files: 0, tests: 0, converted: 0, skipped: 0, ported: 0 };
	for (const key of Object.keys(all).sort()) {
		const e = normaliseEntry(all[key]);
		files[key] = e;
		totals.files += 1;
		totals.converted += e.converted;
		totals.skipped += e.skipped.length;
		totals.ported += e.ported.length;
	}
	totals.tests = totals.converted + totals.skipped + totals.ported;
	return { generatedBy: GENERATED_BY, files, totals };
}

/**
 * Serialise a report as prettier-formatted JSON.
 * @param {Report} report
 * @param {string} repoRoot
 */
export async function serializeReport(report, repoRoot) {
	const json = JSON.stringify(report, null, '\t') + '\n';
	return (await format(json, repoRoot, 'apps/ui-e2e/conversion-report.json')).code;
}
