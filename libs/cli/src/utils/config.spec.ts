import { readJson, type Tree, writeJson } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import {
	backfillStyleInComponentsJson,
	ConfigValidationError,
	getImportAlias,
	loadOrInitConfig,
	parseConfig,
} from './config';

describe('getImportAlias', () => {
	let tree: Tree;

	beforeEach(() => {
		tree = createTreeWithEmptyWorkspace();
	});

	it('returns the default alias when no config exists', async () => {
		await expect(getImportAlias(tree, false)).resolves.toBe('@spartan-ng/helm');
	});

	it('returns the configured alias from a valid config', async () => {
		writeJson(tree, 'components.json', { importAlias: '@my-org/ui' });

		await expect(getImportAlias(tree, false)).resolves.toBe('@my-org/ui');
	});

	// A present-but-invalid config must fail loudly rather than silently fall back to the default
	// alias, which would run every migration against the wrong imports.
	it('throws when the config exists but is invalid', async () => {
		writeJson(tree, 'components.json', { importAlias: 123 });

		await expect(getImportAlias(tree, false)).rejects.toThrow();
	});
});

describe('loadOrInitConfig', () => {
	let tree: Tree;

	beforeEach(() => {
		tree = createTreeWithEmptyWorkspace();
	});

	it('applies the default style in memory and leaves the file untouched', async () => {
		writeJson(tree, 'components.json', { importAlias: '@spartan-ng/helm' });

		const config = await loadOrInitConfig(tree, { angularCli: false });

		expect(config.style).toBe('vega');
		expect(readJson(tree, 'components.json').style).toBeUndefined();
	});
});

describe('backfillStyleInComponentsJson', () => {
	let tree: Tree;

	beforeEach(() => {
		tree = createTreeWithEmptyWorkspace();
	});

	it('writes the fallback style when components.json omits it', async () => {
		writeJson(tree, 'components.json', { importAlias: '@spartan-ng/helm' });

		await backfillStyleInComponentsJson(tree);

		expect(readJson(tree, 'components.json').style).toBe('vega');
	});

	it('is a no-op when there is no config', async () => {
		await backfillStyleInComponentsJson(tree);

		expect(tree.exists('components.json')).toBe(false);
	});
});

function issuesOf(raw: unknown, isAngularCli: boolean) {
	try {
		parseConfig(raw, isAngularCli);
	} catch (e) {
		if (e instanceof ConfigValidationError) return e.issues;
		throw e;
	}
	throw new Error('expected parseConfig to throw');
}

describe('parseConfig', () => {
	it('applies every default to an empty NX config', () => {
		expect(parseConfig({}, false)).toEqual({
			componentsPath: 'libs/ui',
			buildable: true,
			generateAs: 'library',
			style: 'vega',
			importAlias: '@spartan-ng/helm',
		});
	});

	it('applies every default to an empty Angular CLI config without the NX-only fields', () => {
		expect(parseConfig({}, true)).toEqual({
			componentsPath: 'libs/ui',
			style: 'vega',
			importAlias: '@spartan-ng/helm',
		});
	});

	it('keeps the provided values', () => {
		const raw = {
			componentsPath: 'libs/x',
			buildable: false,
			generateAs: 'entrypoint',
			style: 'nova',
			importAlias: '@my-org/ui',
		};

		expect(parseConfig(raw, false)).toEqual(raw);
	});

	it('drops unknown keys', () => {
		expect(parseConfig({ extra: 1, buildable: false }, true)).toEqual({
			componentsPath: 'libs/ui',
			style: 'vega',
			importAlias: '@spartan-ng/helm',
		});
	});

	it('reports a wrong type with the field path', () => {
		expect(issuesOf({ componentsPath: 1, buildable: 'yes' }, false)).toEqual([
			{ path: 'componentsPath', expected: 'string', message: 'Expected string, received number' },
			{ path: 'buildable', expected: 'boolean', message: 'Expected boolean, received string' },
		]);
	});

	it('lists the allowed values for an invalid style or generateAs', () => {
		const issues = issuesOf({ style: 'neon', generateAs: 'app' }, false);

		expect(issues.map(({ path, expected }) => ({ path, expected }))).toEqual([
			{ path: 'generateAs', expected: 'library | entrypoint' },
			{ path: 'style', expected: 'nova | vega | lyra | maia | mira | luma' },
		]);
	});

	it('rejects an importAlias that ends with a slash', () => {
		expect(issuesOf({ importAlias: '@my-org/ui/' }, true)).toEqual([
			{ path: 'importAlias', expected: '-', message: 'importAlias should not end with a slash' },
		]);
	});

	it('reports a non-object root at path root', () => {
		expect(issuesOf([], false)).toEqual([
			{ path: 'root', expected: 'object', message: 'Expected object, received array' },
		]);
		expect(issuesOf(null, true)[0].path).toBe('root');
	});
});

describe('loadOrInitConfig with an invalid config', () => {
	it('prints the issues as a table and throws the validation error', async () => {
		const tree = createTreeWithEmptyWorkspace();
		writeJson(tree, 'components.json', { style: 'neon' });
		const table = vi.spyOn(console, 'table').mockImplementation(() => undefined);

		await expect(loadOrInitConfig(tree, { angularCli: true })).rejects.toThrow(
			'Config validation failed. Please fix the issues above.',
		);
		expect(table).toHaveBeenCalledWith(
			[
				{
					path: 'style',
					expected: 'nova | vega | lyra | maia | mira | luma',
					message: "Invalid enum value. Expected 'nova' | 'vega' | 'lyra' | 'maia' | 'mira' | 'luma', received 'neon'",
				},
			],
			['path', 'expected', 'message'],
		);

		table.mockRestore();
	});
});
