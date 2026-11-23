export function pageViolations(tests) {
	const counts = {};
	for (const test of tests) {
		if (test.component !== '_pages') continue;
		if (test.status !== 'passed' && test.status !== 'failed') continue;
		if (!test.a11y || test.a11y.length === 0) continue;
		const count = test.a11y.reduce((total, check) => total + check.violations.length, 0);
		counts[test.title] = (counts[test.title] ?? 0) + count;
	}
	return counts;
}

export function compareA11y(baseline, current) {
	const raised = [];
	const lowered = [];
	const unknown = [];
	for (const [page, count] of Object.entries(current)) {
		const allowed = baseline[page];
		if (allowed === undefined) {
			unknown.push(page);
			continue;
		}
		if (count > allowed) raised.push({ page, baseline: allowed, current: count });
		else if (count < allowed) lowered.push({ page, baseline: allowed, current: count });
	}
	return { raised, lowered, unknown };
}

export function lowerA11y(baseline, current) {
	const next = { ...baseline };
	for (const [page, count] of Object.entries(current)) {
		next[page] = next[page] === undefined ? count : Math.min(next[page], count);
	}
	return Object.fromEntries(Object.entries(next).sort(([a], [b]) => a.localeCompare(b)));
}
