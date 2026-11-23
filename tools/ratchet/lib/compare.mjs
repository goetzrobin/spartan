function* entries(counts) {
	for (const [kind, rules] of Object.entries(counts)) {
		for (const [rule, libraries] of Object.entries(rules)) {
			for (const [library, count] of Object.entries(libraries)) {
				yield { kind, rule, library, count };
			}
		}
	}
}

export function compare(baseline, current) {
	const raised = [];
	const lowered = [];
	for (const { kind, rule, library, count } of entries(current)) {
		const allowed = baseline[kind]?.[rule]?.[library];
		if (allowed === undefined) continue;
		const entry = { kind, rule, library, baseline: allowed, current: count };
		if (count > allowed) raised.push(entry);
		else if (count < allowed) lowered.push(entry);
	}
	return { raised, lowered };
}

export function missing(baseline, current) {
	const result = [];
	for (const { kind, rule, library, count } of entries(current)) {
		if (baseline[kind]?.[rule]?.[library] === undefined) result.push({ kind, rule, library, current: count });
	}
	return result;
}

export function lower(baseline, current) {
	const next = structuredClone(baseline);
	for (const { kind, rule, library, count } of entries(current)) {
		next[kind] ??= {};
		next[kind][rule] ??= {};
		const allowed = next[kind][rule][library];
		next[kind][rule][library] = allowed === undefined ? count : Math.min(allowed, count);
	}
	return next;
}

export function countLint(results, rules, libraries, libraryOf) {
	const counts = {};
	for (const rule of rules) {
		counts[rule] = {};
		for (const library of libraries) counts[rule][library] = 0;
	}
	for (const result of results) {
		const library = libraryOf(result.filePath);
		if (!libraries.includes(library)) continue;
		for (const message of result.messages) {
			if (rules.includes(message.ruleId)) counts[message.ruleId][library] += 1;
		}
	}
	return counts;
}
