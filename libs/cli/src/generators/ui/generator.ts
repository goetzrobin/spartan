import { type GeneratorCallback, type Tree, addDependenciesToPackageJson, runTasksInSerial } from '@nx/devkit';
import { prompt } from 'enquirer';
import { Config, getOrCreateConfig } from '../../utils/config';
import { SPARTAN_COLLAPSIBLE_BRAIN_VERSION } from '../base/versions';
import { addDependentPrimitives } from './add-dependent-primitive';
import type { HlmUIGeneratorSchema } from './schema';

export default async function hlmUIGenerator(tree: Tree, options: HlmUIGeneratorSchema & { angularCli?: boolean }) {
	const tasks: GeneratorCallback[] = [];
	const config = await getOrCreateConfig(tree, {
		componentsPath: options.directory,
	});
	const availablePrimitives: ComponentDefintions = await import('./supported-ui-libraries.json').then((m) => m.default);
	const availablePrimitiveNames = [...Object.keys(availablePrimitives), 'collapsible', 'menubar', 'contextmenu'];
	let response: { primitives: string[] } = { primitives: [] };
	if (options.name && availablePrimitiveNames.includes(options.name)) {
		response.primitives.push(options.name);
	} else {
		response = await prompt({
			type: 'multiselect',
			required: true,
			name: 'primitives',
			message: 'Choose which primitives you want to copy',
			choices: ['all', ...availablePrimitiveNames.sort()],
		});
	}
	tasks.push(
		...(await createPrimitiveLibraries(response, availablePrimitiveNames, availablePrimitives, tree, options, config)),
	);

	return runTasksInSerial(...tasks);
}

async function createPrimitiveLibraries(
	response: {
		primitives: string[];
	},
	availablePrimitiveNames: string[],
	availablePrimitives: ComponentDefintions,
	tree: Tree,
	options: HlmUIGeneratorSchema & { angularCli?: boolean },
	config: Config,
) {
	const allPrimitivesSelected = response.primitives.includes('all');
	const primitivesToCreate = allPrimitivesSelected ? availablePrimitiveNames : response.primitives;
	const tasks: GeneratorCallback[] = [];

	if (!response.primitives.includes('all')) {
		await addDependentPrimitives(primitivesToCreate);
	}
	await replaceContextAndMenuBar(primitivesToCreate, allPrimitivesSelected);

	if (primitivesToCreate.includes('collapsible')) {
		tasks.push(
			addDependenciesToPackageJson(tree, { '@spartan-ng/ui-collapsible-brain': SPARTAN_COLLAPSIBLE_BRAIN_VERSION }, {}),
		);
	}
	if (primitivesToCreate.length === 1 && primitivesToCreate[0] === 'collapsible') {
		return tasks;
	}

	// Use Promise.all() to handle parallel execution of primitive library creation tasks
	const installTasks = await Promise.all(
		primitivesToCreate.map(async (primitiveName) => {
			if (primitiveName === 'collapsible') return;

			const internalName = availablePrimitives[primitiveName].internalName;
			const peerDependencies = availablePrimitives[primitiveName].peerDependencies;
			const { generator } = await import(
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				`./libs/${internalName}/generator`
			);
			return generator(tree, {
				internalName: '',
				publicName: '',
				primitiveName: '',
				peerDependencies,
				skipBrainDependencies: options.skipBrainDependencies,
				directory: options.directory ?? config.componentsPath,
				tags: options.tags,
				rootProject: options.rootProject,
				angularCli: options.angularCli,
			});
		}),
	);

	tasks.push(...installTasks.filter(Boolean));

	return tasks;
}

const replaceContextAndMenuBar = async (primtivesToCreate: string[], silent = false) => {
	const contextIndex = primtivesToCreate.indexOf('contextmenu');
	if (contextIndex >= 0) {
		if (!silent) {
			await prompt({
				type: 'confirm',
				name: 'contextMenu',
				message: 'The context menu is implemented as part of the menu-helm primitive. Adding menu primitive.',
			});
		}
		primtivesToCreate.splice(contextIndex, 1);
	}
	const menubarIndex = primtivesToCreate.indexOf('menubar');
	if (menubarIndex >= 0) {
		if (!silent) {
			await prompt({
				type: 'confirm',
				name: 'menubar',
				message: 'The menubar is implemented as part of the menu-helm primitive. Adding menu primitive.',
			});
		}
		primtivesToCreate.splice(menubarIndex, 1);
	}
};

interface ComponentDefintions {
	[componentName: string]: {
		internalName: string;
		peerDependencies: Record<string, string>;
	};
}
