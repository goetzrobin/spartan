import { readJson, type Tree, updateJson } from '@nx/devkit';

import { prompt } from 'enquirer';
import { type GenerateAs, generateOptions } from '../generators/base/lib/generate-as';
import { type Style, STYLES } from './supported-styles';

const configPath = 'components.json';

// Default style used when components.json does not set one.
const FALLBACK_STYLE: Style = 'vega';

// buildable and generateAs only exist for NX configs; an Angular CLI config omits them.
export type Config = {
	componentsPath: string;
	style: Style;
	importAlias: string;
	buildable?: boolean;
	generateAs?: GenerateAs;
};

export interface ConfigIssue {
	path: string;
	expected: string;
	message: string;
}

export class ConfigValidationError extends Error {
	constructor(readonly issues: ConfigIssue[]) {
		super(issues.map((issue) => `${issue.path}: ${issue.message}`).join('\n'));
		this.name = 'ConfigValidationError';
	}
}

function typeName(value: unknown): string {
	if (value === null) return 'null';
	if (Array.isArray(value)) return 'array';
	return typeof value;
}

function quoted(options: readonly string[]): string {
	return options.map((option) => `'${option}'`).join(' | ');
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function typeIssue(path: string, value: unknown, type: string): ConfigIssue {
	return { path, expected: type, message: `Expected ${type}, received ${typeName(value)}` };
}

export function parseConfig(raw: unknown, isAngularCli: boolean): Config {
	if (!isRecord(raw)) {
		throw new ConfigValidationError([typeIssue('root', raw, 'object')]);
	}

	const issues: ConfigIssue[] = [];

	function readString(key: string, fallback: string): string {
		const value = raw[key];
		if (value === undefined) return fallback;
		if (typeof value === 'string') return value;
		issues.push(typeIssue(key, value, 'string'));
		return fallback;
	}

	function readBoolean(key: string, fallback: boolean): boolean {
		const value = raw[key];
		if (value === undefined) return fallback;
		if (typeof value === 'boolean') return value;
		issues.push(typeIssue(key, value, 'boolean'));
		return fallback;
	}

	function readOption<T extends string>(key: string, fallback: T, options: readonly T[]): T {
		const value = raw[key];
		if (value === undefined) return fallback;
		const match = options.find((option) => option === value);
		if (match !== undefined) return match;
		issues.push(
			typeof value === 'string'
				? {
						path: key,
						expected: options.join(' | '),
						message: `Invalid enum value. Expected ${quoted(options)}, received '${value}'`,
					}
				: typeIssue(key, value, quoted(options)),
		);
		return fallback;
	}

	const componentsPath = readString('componentsPath', 'libs/ui');
	const nxFields = isAngularCli
		? {}
		: {
				buildable: readBoolean('buildable', true),
				generateAs: readOption('generateAs', 'library', generateOptions),
			};
	const style = readOption('style', FALLBACK_STYLE, STYLES);
	const importAlias = readString('importAlias', '@spartan-ng/helm');
	if (importAlias.endsWith('/')) {
		issues.push({ path: 'importAlias', expected: '-', message: 'importAlias should not end with a slash' });
	}

	if (issues.length > 0) {
		throw new ConfigValidationError(issues);
	}

	return { componentsPath, ...nxFields, style, importAlias };
}

const getConfig = async (tree: Tree, isAngularCli: boolean): Promise<Config> => {
	const raw = await readJson(tree, configPath);
	try {
		return parseConfig(raw, isAngularCli);
	} catch (e) {
		if (e instanceof ConfigValidationError) {
			console.table(e.issues, ['path', 'expected', 'message']);
			throw new Error('Config validation failed. Please fix the issues above.', { cause: e });
		} else {
			throw e;
		}
	}
};

export async function getImportAlias(tree: Tree, isAngularCli: boolean): Promise<string> {
	// A missing config is expected for a fresh project - fall back to the default alias.
	if (!tree.exists(configPath)) {
		return '@spartan-ng/helm';
	}

	// A present-but-invalid config is a real error: every migration depends on this alias, so let
	// getConfig throw (it prints the offending fields) rather than silently using the wrong one.
	const config = await getConfig(tree, isAngularCli);
	return config.importAlias;
}

// The folder the helm libraries are generated into (no prompt; the default for a project without components.json).
export function getComponentsPath(tree: Tree): string {
	if (!tree.exists(configPath)) return 'libs/ui';
	return readJson(tree, configPath).componentsPath ?? 'libs/ui';
}

// Add the default "style" to components.json when it is missing.
export async function backfillStyleInComponentsJson(tree: Tree): Promise<void> {
	if (!tree.exists(configPath)) return;

	const raw = await readJson(tree, configPath);
	if (raw.style) return;

	updateJson(tree, configPath, (json) => ({ ...json, style: FALLBACK_STYLE }));
	console.log(`No "style" in components.json - added "${FALLBACK_STYLE}".`);
}

export async function loadOrInitConfig(
	tree: Tree,
	defaults?: Partial<Config> & { angularCli: boolean },
): Promise<Config> {
	if (tree.exists(configPath)) {
		return getConfig(tree, defaults?.angularCli ?? false);
	}

	const questions = [
		{
			type: 'input',
			required: true,
			name: 'componentsPath',
			message: 'Choose a directory to place your spartan libraries, e.g. libs/ui',
			initial: defaults?.componentsPath ?? 'libs/ui',
			skip: !!defaults?.componentsPath,
		},
		// Conditionally add NX specific questions
		...(!defaults?.angularCli
			? [
					{
						type: 'confirm',
						name: 'buildable',
						message: 'Should the libraries be buildable?',
						initial: defaults?.buildable ?? true,
						skip: typeof defaults?.buildable === 'boolean',
					},
					{
						type: 'select',
						choices: ['library', 'entrypoint'],
						name: 'generateAs',
						message: 'How should we generate the components?',
						initial: 0,
						skip: typeof defaults?.generateAs === 'string',
					},
				]
			: []),
		{
			type: 'input',
			name: 'importAlias',
			message: 'What import alias should be used for the components?',
			initial: defaults?.importAlias ?? '@spartan-ng/helm',
			skip: !!defaults?.importAlias,
		},
		{
			type: 'select',
			choices: STYLES,
			message: 'Which design system style do you want to use?',
			name: 'style',
			initial: 0,
			skip: !!defaults?.style, // Skip when a style was already provided by the caller.
		},
	];

	console.log('Configuration file not found, creating a new one...');

	const { componentsPath, buildable, generateAs, importAlias, style } = (await prompt(questions)) as {
		componentsPath: string;
		buildable: boolean;
		generateAs: GenerateAs;
		importAlias: string;
		style: Style;
	};

	const config = { componentsPath, buildable, generateAs, importAlias, style };

	tree.write(configPath, JSON.stringify(config, null, 2));

	return config;
}
