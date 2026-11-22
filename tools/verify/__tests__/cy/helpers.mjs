import assert from 'node:assert/strict';
import { transformSource } from '../../lib/cy/transform.mjs';

/**
 * Transform a single test body wrapped in describe/it.
 * @param {string} body Cypress statements
 * @param {{ manualTitles?: Set<string>, prelude?: string }} [opts]
 */
export function run(body, opts = {}) {
	const src = `${opts.prelude ?? ''}\ndescribe('d', () => {\n\tit('t', () => {\n${body}\n\t});\n});\n`;
	return transformSource(src, { sourcePath: 'x.cy.ts', basename: 'x', manualTitles: opts.manualTitles });
}

/**
 * Emitted statement lines of the single test (trimmed), from unformatted output.
 * @param {string} code
 */
export function testLines(code) {
	const lines = code.split('\n').map((l) => l.trim());
	const start = lines.findIndex((l) => l.startsWith("test('t'"));
	const end = lines.indexOf('});', start);
	return lines.slice(start + 1, end).filter(Boolean);
}

/**
 * Assert that `body` converts to exactly `expected` statements.
 * @param {string} body
 * @param {string | string[]} expected
 */
export function converts(body, expected) {
	const r = run(body);
	assert.equal(r.tests[0].status, 'converted', `expected conversion, got reasons: ${r.tests[0].reasons.join('; ')}`);
	assert.deepEqual(testLines(r.code), Array.isArray(expected) ? expected : [expected]);
	return r;
}

/**
 * Assert that `body` is skipped with a reason containing `reason`.
 * @param {string} body
 * @param {string} reason
 */
export function skips(body, reason) {
	const r = run(body);
	assert.equal(r.tests[0].status, 'skipped', `expected skip, got:\n${r.code}`);
	assert.ok(
		r.tests[0].reasons.some((x) => x.includes(reason)),
		`expected a reason containing ${JSON.stringify(reason)}, got ${JSON.stringify(r.tests[0].reasons)}`,
	);
	assert.match(r.code, /test\.fixme\('t', async \(\) => \{/);
	assert.ok(!/await /.test(r.code), 'a skipped test must not emit converted code');
	return r;
}
