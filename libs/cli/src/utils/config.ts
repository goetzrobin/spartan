import { type Tree, readJson } from '@nx/devkit';
import { prompt } from 'enquirer';

const configPath = 'components.json';

export type Config = {
	componentsPath: string;
};

export async function getOrCreateConfig(tree: Tree, defaults?: Partial<Config>): Promise<Config> {
	if (tree.exists(configPath)) {
		return readJson(tree, configPath) as Promise<Config>; // TODO: Parse with zod and handle errors
	}

	console.log('Configuration file not found, creating a new one...');

	const { componentsPath } = (await prompt([
		{
			type: 'input',
			required: true,
			name: 'componentsPath',
			message: 'Choose a directory to place your spartan libraries, e.g. libs/ui',
			initial: defaults?.componentsPath ?? 'libs/ui',
			skip: !!defaults?.componentsPath,
		},
	])) as { componentsPath: string };

	const config = { componentsPath };

	tree.write(configPath, JSON.stringify(config, null, 2));

	return config;
}
