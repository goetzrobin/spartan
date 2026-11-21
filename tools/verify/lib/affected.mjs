// Works out which components a set of changed files can affect, by following imports from each
// component's test pages and test files into the libraries.
//
// `brain` and `helm` are each one Nx project with many entry points, so Nx's own "affected"
// cannot tell a popover change from a tabs change. This can.

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';

const E2E_SRC = 'apps/ui-e2e/src';
const PAGES = 'apps/app/src/app/pages/(test)/test';

/** A change to any of these can affect every component, so everything is verified. */
const GLOBAL = [
	/^apps\/ui-e2e\/src\/support\//,
	/^apps\/ui-e2e\/playwright\.config\.ts$/,
	/^apps\/app\/src\/app\/app\.ts$/,
	/^apps\/app\/src\/app\/app\.config(\.server)?\.ts$/,
	/^apps\/app\/src\/app\/shared\/test\//,
	/^apps\/app\/src\/styles\.css$/,
	/^apps\/app\/(vite|nitro)\.config\.ts$/,
	/^apps\/app\/index\.html$/,
	/^libs\/registry\/src\/styles\//,
	/^tools\/verify\//,
	/^tsconfig\.base\.json$/,
	/^package\.json$/,
	/^pnpm-lock\.yaml$/,
	/^\.github\/workflows\/verify\.yml$/,
];

const IMPORT =
	/(?:import|export)\s[^'"]*?from\s*['"]([^'"]+)['"]|import\s*['"]([^'"]+)['"]|import\(\s*['"]([^'"]+)['"]\s*\)/g;

export function listComponents(root) {
	const directory = path.join(root, E2E_SRC);
	if (!existsSync(directory)) return [];
	return readdirSync(directory, { withFileTypes: true })
		.filter((entry) => entry.isDirectory() && entry.name !== 'support')
		.map((entry) => entry.name)
		.sort();
}

function walk(root, directory) {
	const absolute = path.join(root, directory);
	if (!existsSync(absolute)) return [];
	return readdirSync(absolute, { withFileTypes: true }).flatMap((entry) => {
		const relative = `${directory}/${entry.name}`;
		return entry.isDirectory() ? walk(root, relative) : [relative];
	});
}

function createResolver(root) {
	const config = JSON.parse(readFileSync(path.join(root, 'tsconfig.base.json'), 'utf8'));
	const paths = config.compilerOptions?.paths ?? {};
	const candidates = (base) => [base, `${base}.ts`, `${base}/index.ts`];

	return (specifier, fromFile) => {
		if (specifier.startsWith('.')) {
			const base = path.posix.join(path.posix.dirname(fromFile), specifier);
			return candidates(base).find((file) => {
				const absolute = path.join(root, file);
				return existsSync(absolute) && statSync(absolute).isFile();
			});
		}
		const target = paths[specifier]?.[0];
		return target && existsSync(path.join(root, target)) ? target : undefined;
	};
}

/**
 * The story titles a component's tests open (`gotoStory(page, 'context-menu--default')`).
 * A test folder does not always share its name with the stories it covers: `menu` holds the
 * tests for context-menu, dropdown-menu and menubar.
 */
export function storyTitlesOf(root, component) {
	const titles = new Set();
	for (const file of walk(root, `${E2E_SRC}/${component}`)) {
		const text = readFileSync(path.join(root, file), 'utf8');
		for (const match of text.matchAll(/gotoStory\(\s*page\s*,\s*['"`]([a-z0-9-]+?)--/g)) titles.add(match[1]);
	}
	return [...titles].sort();
}

/** Every repo file a component's pages and tests reach through imports. */
export function closureOf(root, component, resolve = createResolver(root)) {
	const seen = new Set();
	const pageFolders = new Set([component, ...storyTitlesOf(root, component)]);
	const queue = [
		...[...pageFolders].flatMap((folder) => walk(root, `${PAGES}/${folder}`)),
		...walk(root, `${E2E_SRC}/${component}`),
	].filter((file) => /\.(ts|mts|js|mjs)$/.test(file));
	while (queue.length > 0) {
		const file = queue.pop();
		if (seen.has(file)) continue;
		seen.add(file);
		const text = readFileSync(path.join(root, file), 'utf8');
		for (const match of text.matchAll(IMPORT)) {
			const resolved = resolve(match[1] ?? match[2] ?? match[3], file);
			if (resolved && !seen.has(resolved)) queue.push(resolved);
		}
	}
	return seen;
}

/**
 * @returns {{ all: boolean, components: string[], reasons: Record<string, string[]> }}
 * `reasons` maps each affected component to the changed files that reach it; when a global file
 * changed, `all` is true and the reason is listed under `*`.
 */
export function affectedComponents(root, changedFiles) {
	const components = listComponents(root);
	const globalHits = changedFiles.filter((file) => GLOBAL.some((pattern) => pattern.test(file)));
	if (globalHits.length > 0) return { all: true, components, reasons: { '*': globalHits } };

	const resolve = createResolver(root);
	const reasons = {};
	for (const component of components) {
		const closure = closureOf(root, component, resolve);
		// A template or style file next to an imported file belongs to it too.
		const directories = new Set([...closure].map((file) => path.posix.dirname(file)));
		const hits = changedFiles.filter(
			(file) => closure.has(file) || (!/\.(ts|mts|js|mjs)$/.test(file) && directories.has(path.posix.dirname(file))),
		);
		if (hits.length > 0) reasons[component] = hits;
	}
	return { all: false, components: Object.keys(reasons).sort(), reasons };
}

/**
 * File paths from `git status --porcelain` output. Each line is two status letters, a space and
 * the path; a rename is `old -> new` and only the new path counts.
 */
export function parseStatus(output) {
	return output
		.split('\n')
		.filter((line) => line.length > 3)
		.map((line) =>
			line
				.slice(3)
				.replace(/^.* -> /, '')
				.replace(/^"|"$/g, ''),
		);
}
