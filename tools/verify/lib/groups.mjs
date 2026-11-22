export function groupUnits(units, maxPages) {
	const limit = Number.isFinite(maxPages) && maxPages > 0 ? maxPages : Infinity;
	const groups = [];
	let count = 0;
	for (const unit of units) {
		const current = groups[groups.length - 1];
		if (!current || (count + unit.pages > limit && current.length > 0)) {
			groups.push([unit]);
			count = unit.pages;
		} else {
			current.push(unit);
			count += unit.pages;
		}
	}
	return groups;
}

export function joinResults(reports) {
	const [first] = reports;
	if (!first) return { suites: [], errors: [], stats: {} };
	const sum = (key) => reports.reduce((total, report) => total + (report.stats?.[key] ?? 0), 0);
	return {
		...first,
		suites: reports.flatMap((report) => report.suites ?? []),
		errors: reports.flatMap((report) => report.errors ?? []),
		stats: {
			...first.stats,
			duration: sum('duration'),
			expected: sum('expected'),
			unexpected: sum('unexpected'),
			skipped: sum('skipped'),
			flaky: sum('flaky'),
		},
	};
}
