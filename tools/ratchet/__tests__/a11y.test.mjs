import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { compareA11y, lowerA11y, pageViolations } from '../lib/a11y.mjs';

function violation(id) {
	return { id, impact: 'serious', help: id, nodes: [{}] };
}

function page(title, violations, extra = {}) {
	return {
		component: '_pages',
		title,
		status: 'passed',
		a11y: [{ context: 'root', violations, passes: 10 }],
		...extra,
	};
}

describe('pageViolations', () => {
	it('counts violation entries per page, not elements', () => {
		const tests = [
			page('tooltip--default', [violation('color-contrast'), { ...violation('label'), nodes: [{}, {}, {}] }]),
			page('badge--default', []),
		];
		assert.deepEqual(pageViolations(tests), { 'tooltip--default': 2, 'badge--default': 0 });
	});

	it('counts failed pages and leaves out skipped pages, pages without a scan and component tests', () => {
		const tests = [
			page('card--default', [violation('region')], { status: 'failed' }),
			page('tabs--default', [violation('region')], { status: 'skipped' }),
			page('menu--default', [], { a11y: [] }),
			page('button--default', [violation('region')], { component: 'button' }),
		];
		assert.deepEqual(pageViolations(tests), { 'card--default': 1 });
	});
});

describe('compareA11y', () => {
	it('reports raised, lowered and unknown pages', () => {
		const baseline = { a: 2, b: 3, c: 1 };
		const current = { a: 3, b: 1, c: 1, d: 4 };
		assert.deepEqual(compareA11y(baseline, current), {
			raised: [{ page: 'a', baseline: 2, current: 3 }],
			lowered: [{ page: 'b', baseline: 3, current: 1 }],
			unknown: ['d'],
		});
	});

	it('does not judge pages that did not run', () => {
		assert.deepEqual(compareA11y({ a: 0, b: 5 }, { a: 0 }), { raised: [], lowered: [], unknown: [] });
	});
});

describe('lowerA11y', () => {
	it('only lowers numbers and adds unknown pages', () => {
		const baseline = { a: 2, b: 3, c: 1 };
		assert.deepEqual(lowerA11y(baseline, { a: 5, b: 1, d: 4 }), { a: 2, b: 1, c: 1, d: 4 });
		assert.deepEqual(baseline, { a: 2, b: 3, c: 1 });
	});
});
