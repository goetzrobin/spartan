import { type ProjectConfiguration, type Tree, formatFiles, names, readJson, workspaceRoot } from '@nx/devkit';
import * as path from 'node:path';
import { addPrimitiveToSupportedUILibraries } from './lib/add-primitive-to-supported-ui-libraries';
import { copyFilesFromHlmLibToGenerator, createSharedGeneratorFiles, recursivelyDelete } from './lib/file-management';
import { getProjectsAndNames } from './lib/get-project-names';
import type { HlmToCliGeneratorGeneratorSchema } from './schema';

const BASE_PATH = path.join('libs', 'cli', 'src', 'generators', 'ui');

async function createGeneratorFromHlmLibrary(
	projects: Map<string, ProjectConfiguration>,
	generatorName: string,
	internalName: string,
	tree: Tree,
	options: HlmToCliGeneratorGeneratorSchema,
) {
	const srcPath = path.join(workspaceRoot, projects.get(internalName).sourceRoot);
	const projectRoot = path.join(BASE_PATH, 'libs', internalName);
	const supportedUILibsJsonPath = path.join(BASE_PATH, 'supported-ui-libraries.json');
	const filesPath = path.join(projectRoot, 'files');
	const peerDependencies = readJson(tree, path.join(projects.get(internalName).root, 'package.json')).peerDependencies;
	recursivelyDelete(tree, filesPath);
	addPrimitiveToSupportedUILibraries(tree, supportedUILibsJsonPath, generatorName, internalName, peerDependencies);
	copyFilesFromHlmLibToGenerator(tree, srcPath, filesPath, options);
	createSharedGeneratorFiles(tree, projectRoot, options);
}

export async function hlmCliNxGeneratorGenerator(tree: Tree, options: HlmToCliGeneratorGeneratorSchema) {
	const { projects, projectNames } = getProjectsAndNames(tree);
	const projectNamesIgnoringCoreLibs = projectNames.filter((name) => !name.includes('core'));

	for (const internalName of projectNamesIgnoringCoreLibs) {
		const primitiveName = internalName.replace('ui-', '').replace('-helm', '').replace('-', '');
		const cleanNames = names(primitiveName);
		const mergedOptions = { ...options, ...cleanNames };
		mergedOptions['internalName'] = internalName;
		mergedOptions['publicName'] = `ui-${primitiveName}-helm`;
		mergedOptions['primitiveName'] = primitiveName;

		createGeneratorFromHlmLibrary(projects, primitiveName, internalName, tree, mergedOptions);
	}

	await formatFiles(tree);
}

export default hlmCliNxGeneratorGenerator;
