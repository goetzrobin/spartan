import { addDependenciesToPackageJson, generateFiles, GeneratorCallback, runTasksInSerial, Tree } from '@nx/devkit';
import { HlmBaseGeneratorSchema } from './schema';
import * as path from 'path';
import { initializeAngularLibrary } from './lib/initialize-angular-library';
import { buildDependencyArray, buildDevDependencyArray } from './lib/build-dependency-array';
import { getTargetLibraryDirectory } from './lib/get-target-library-directory';
import { getInstalledPackageVersion } from '../../utils/version-utils';
import { FALLBACK_ANGULAR_VERSION } from './versions';

export async function hlmBaseGenerator(tree: Tree, options: HlmBaseGeneratorSchema) {
  const tasks: GeneratorCallback[] = [];
  const targetLibDir = getTargetLibraryDirectory(options, tree);
  tasks.push(await initializeAngularLibrary(tree, options));

  generateFiles(
    tree,
    path.join(__dirname, '..', 'ui', 'libs', options.internalName, 'files'),
    path.join(targetLibDir, 'src'),
    options
  );

  const angularVersion = getInstalledPackageVersion(tree, '@angular/core', FALLBACK_ANGULAR_VERSION, true);
  const existingCdkVersion = getInstalledPackageVersion(tree, '@angular/cdk', FALLBACK_ANGULAR_VERSION, true);
  const dependencies = buildDependencyArray(options, angularVersion, existingCdkVersion);
  const devDependencies = buildDevDependencyArray();

  tasks.push(addDependenciesToPackageJson(tree, dependencies, devDependencies));
  return runTasksInSerial(...tasks);
}

export default hlmBaseGenerator;
