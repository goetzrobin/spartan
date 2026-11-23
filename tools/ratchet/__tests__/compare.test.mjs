import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { compare, countLint, lower, missing } from '../lib/compare.mjs';

const rule = '@typescript-eslint/no-explicit-any';
const other = '@typescript-eslint/no-unsafe-call';

function lint(counts) {
	return { lint: counts };
}

describe('compare', () => {
	it('fails when a count is above its baseline', () => {
		const { raised, lowered } = compare(
			lint({ [rule]: { brain: 3, helm: 0 } }),
			lint({ [rule]: { brain: 4, helm: 0 } }),
		);
		assert.deepEqual(raised, [{ section: 'lint', metric: rule, library: 'brain', baseline: 3, current: 4 }]);
		assert.deepEqual(lowered, []);
	});

	it('passes when every count equals its baseline', () => {
		const counts = lint({ [rule]: { brain: 3, helm: 1 }, [other]: { brain: 0, helm: 2 } });
		assert.deepEqual(compare(counts, structuredClone(counts)), { raised: [], lowered: [] });
	});

	it('passes and reports a count below its baseline', () => {
		const { raised, lowered } = compare(
			lint({ [rule]: { brain: 3, helm: 2 } }),
			lint({ [rule]: { brain: 3, helm: 1 } }),
		);
		assert.deepEqual(raised, []);
		assert.deepEqual(lowered, [{ section: 'lint', metric: rule, library: 'helm', baseline: 2, current: 1 }]);
	});

	it('does not count a rule missing from the baseline as raised or lowered', () => {
		const baseline = lint({ [rule]: { brain: 1, helm: 1 } });
		const current = lint({ [rule]: { brain: 1, helm: 1 }, [other]: { brain: 5, helm: 0 } });
		assert.deepEqual(compare(baseline, current), { raised: [], lowered: [] });
		assert.deepEqual(missing(baseline, current), [
			{ section: 'lint', metric: other, library: 'brain', current: 5 },
			{ section: 'lint', metric: other, library: 'helm', current: 0 },
		]);
	});
});

describe('lower', () => {
	it('never raises a number', () => {
		const baseline = lint({ [rule]: { brain: 3, helm: 2 } });
		assert.deepEqual(lower(baseline, lint({ [rule]: { brain: 9, helm: 2 } })), baseline);
	});

	it('lowers a number to the current count', () => {
		const baseline = lint({ [rule]: { brain: 3, helm: 2 } });
		assert.deepEqual(lower(baseline, lint({ [rule]: { brain: 1, helm: 4 } })), lint({ [rule]: { brain: 1, helm: 2 } }));
	});

	it('adds a new rule with its current count', () => {
		const baseline = lint({ [rule]: { brain: 3, helm: 2 } });
		assert.deepEqual(
			lower(baseline, lint({ [rule]: { brain: 3, helm: 2 }, [other]: { brain: 7, helm: 0 } })),
			lint({ [rule]: { brain: 3, helm: 2 }, [other]: { brain: 7, helm: 0 } }),
		);
	});

	it('keeps other top-level kinds and does not change its input', () => {
		const baseline = { lint: { [rule]: { brain: 3, helm: 2 } }, other: { thing: { brain: 1 } } };
		const copy = structuredClone(baseline);
		const next = lower(baseline, lint({ [rule]: { brain: 0, helm: 0 } }));
		assert.deepEqual(next, { lint: { [rule]: { brain: 0, helm: 0 } }, other: { thing: { brain: 1 } } });
		assert.deepEqual(baseline, copy);
	});
});

describe('countLint', () => {
	it('counts listed rules per library and starts every library at zero', () => {
		const results = [
			{ filePath: 'brain/a.ts', messages: [{ ruleId: rule }, { ruleId: rule }, { ruleId: 'not-counted' }] },
			{ filePath: 'helm/b.ts', messages: [{ ruleId: other }, { ruleId: null }] },
			{ filePath: 'elsewhere/c.ts', messages: [{ ruleId: rule }] },
		];
		const counts = countLint(results, [rule, other], ['brain', 'helm'], (filePath) => filePath.split('/')[0]);
		assert.deepEqual(counts, { [rule]: { brain: 2, helm: 0 }, [other]: { brain: 0, helm: 1 } });
	});
});
