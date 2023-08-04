import { addDependenciesToPackageJson, generateFiles, GeneratorCallback, runTasksInSerial, Tree } from '@nx/devkit';
import { HlmBaseGeneratorSchema } from './schema';
import * as path from 'path';
import { initializeAngularLibrary } from './lib/initialize-angular-library';
import { buildDependencyArray } from './lib/build-dependency-array';
import { getTargetLibraryDirectory } from './lib/get-target-library-directory';

export async function hlmBaseGenerator(tree: Tree, options: HlmBaseGeneratorSchema) {
  const tasks: GeneratorCallback[] = [];
  const targetLibDir = getTargetLibraryDirectory(options, tree);
  tasks.push(await initializeAngularLibrary(tree, options));

  generateFiles(
    tree,
    path.join(__dirname, '..', 'ui', 'libs', options.internalName, 'files'),
    path.join(targetLibDir, 'src'),
    options,
  );

  const dependencies = buildDependencyArray(options);
  tasks.push(addDependenciesToPackageJson(tree, dependencies, {}));
  return runTasksInSerial(...tasks);
}

export default hlmBaseGenerator;
