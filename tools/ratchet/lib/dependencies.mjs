export const PUBLISHED = ['brain', 'helm', 'cli', 'mcp', 'trpc', 'registry'];
export const GUARDED = ['brain', 'helm', 'cli'];

const OWN_SCOPE = '@spartan-ng/';

export function lowestMajor(range) {
	const majors = [...range.matchAll(/(?:^|[\s|])(?:>=|\^|~|=)?\s*v?(\d+)(?:\.[\dx*]+)*/g)].map((match) =>
		Number(match[1]),
	);
	return majors.length === 0 ? undefined : Math.min(...majors);
}

export function requirements(manifest) {
	const all = { ...manifest.dependencies, ...manifest.peerDependencies };
	return Object.fromEntries(
		Object.entries(all)
			.filter(([name]) => !name.startsWith(OWN_SCOPE))
			.map(([name, range]) => [name, lowestMajor(range) ?? range])
			.sort(([a], [b]) => a.localeCompare(b)),
	);
}

export function requirementChanges(accepted, current) {
	const changes = [];
	for (const [name, major] of Object.entries(current)) {
		if (!(name in accepted)) changes.push(`${name} is new (lowest major ${major})`);
		else if (accepted[name] !== major) changes.push(`${name}: lowest major ${accepted[name]} became ${major}`);
	}
	return changes;
}

export function countDependencies(manifests, accepted) {
	const counts = { installedPackages: {}, requirementChanges: {} };
	const changes = {};
	for (const library of PUBLISHED) {
		counts.installedPackages[library] = Object.keys(manifests[library].dependencies ?? {}).length;
	}
	for (const library of GUARDED) {
		changes[library] = requirementChanges(accepted[library] ?? {}, requirements(manifests[library]));
		counts.requirementChanges[library] = changes[library].length;
	}
	return { counts, changes };
}

export function formatDependencyReport(result) {
	const lines = ['packages a user installs with each library:'];
	for (const [library, count] of Object.entries(result.counts.installedPackages)) lines.push(`  ${library}: ${count}`);
	lines.push('', 'requirements that differ from published-requirements.json:');
	for (const [library, changes] of Object.entries(result.changes)) {
		for (const change of changes) lines.push(`  ${library}: ${change}`);
	}
	return lines.join('\n');
}
