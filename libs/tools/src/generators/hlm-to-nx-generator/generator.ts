import { names, ProjectConfiguration, readJson, Tree, workspaceRoot } from '@nx/devkit';
import * as path from 'path';
import { HlmToNxGeneratorGeneratorSchema } from './schema';
import { prompt } from 'enquirer';
import { addPrimitiveToGeneratorsJSON } from './lib/add-primitive-to-generators-json';
import { getProjectsAndNames } from './lib/get-project-names';
import { copyFilesFromHlmLibToGenerator, createSharedGeneratorFiles, recursivelyDelete } from './lib/file-management';

async function createGeneratorFromHlmLibrary(
  projects: Map<string, ProjectConfiguration>,
  generatorName: string,
  internalName: string,
  tree: Tree,
  options: HlmToNxGeneratorGeneratorSchema
) {
  const srcPath = path.join(workspaceRoot, projects.get(internalName).sourceRoot);
  const projectRoot = `libs/nx/src/generators/${internalName}`;
  const filesPath = path.join(projectRoot, 'files');
  const allDependencies = readJson(tree, path.join(projects.get(internalName).root, 'package.json'))['dependencies'];
  const { tslib, ...additionalDependencies } = allDependencies;
  options['hasAdditionalDependencies'] = Object.keys(additionalDependencies).length > 0;
  options['additionalDependencies'] = additionalDependencies;
  recursivelyDelete(tree, filesPath);
  addPrimitiveToGeneratorsJSON(tree, generatorName, internalName);
  copyFilesFromHlmLibToGenerator(tree, srcPath, filesPath, options);
  createSharedGeneratorFiles(tree, projectRoot, options);
}

export async function hlmToNxGeneratorGenerator(tree: Tree, options: HlmToNxGeneratorGeneratorSchema) {
  const { projects, projectNames } = getProjectsAndNames(tree);
  const projectNamesIgnoringCoreLibs = projectNames.filter((name) => !name.includes('core'));

  const response: { libraries: string[] } = await prompt({
    type: 'multiselect',
    required: true,
    name: 'libraries',
    message: 'Choose which library you want to copy',
    choices: ['all', ...projectNamesIgnoringCoreLibs],
  });
  const librariesToCopy = response.libraries.includes('all') ? projectNamesIgnoringCoreLibs : response.libraries;
  librariesToCopy.forEach((internalName) => {
    const primitiveName = internalName.replace('ui-', '').replace('-helm', '').replace('-', '');
    const cleanNames = names(primitiveName);
    options = { ...options, ...cleanNames };
    options['internalName'] = internalName;
    options['publicName'] = primitiveName + '-helm';
    options['generatorName'] = primitiveName;

    createGeneratorFromHlmLibrary(projects, primitiveName, internalName, tree, options);
  });
}

export default hlmToNxGeneratorGenerator;
