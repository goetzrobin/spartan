function* entries(counts) {
	for (const [section, metrics] of Object.entries(counts)) {
		for (const [metric, libraries] of Object.entries(metrics)) {
			for (const [library, count] of Object.entries(libraries)) {
				yield { section, metric, library, count };
			}
		}
	}
}

export function compare(baseline, current) {
	const raised = [];
	const lowered = [];
	for (const { section, metric, library, count } of entries(current)) {
		const allowed = baseline[section]?.[metric]?.[library];
		if (allowed === undefined) continue;
		const entry = { section, metric, library, baseline: allowed, current: count };
		if (count > allowed) raised.push(entry);
		else if (count < allowed) lowered.push(entry);
	}
	return { raised, lowered };
}

export function missing(baseline, current) {
	const result = [];
	for (const { section, metric, library, count } of entries(current)) {
		if (baseline[section]?.[metric]?.[library] === undefined) result.push({ section, metric, library, current: count });
	}
	return result;
}

export function lower(baseline, current) {
	const next = structuredClone(baseline);
	for (const { section, metric, library, count } of entries(current)) {
		next[section] ??= {};
		next[section][metric] ??= {};
		const allowed = next[section][metric][library];
		next[section][metric][library] = allowed === undefined ? count : Math.min(allowed, count);
	}
	return next;
}

export function countLint(results, metrics, libraries, libraryOf) {
	const counts = {};
	for (const metric of metrics) {
		counts[metric] = {};
		for (const library of libraries) counts[metric][library] = 0;
	}
	for (const result of results) {
		const library = libraryOf(result.filePath);
		if (!libraries.includes(library)) continue;
		for (const message of result.messages) {
			if (metrics.includes(message.ruleId)) counts[message.ruleId][library] += 1;
		}
	}
	return counts;
}
