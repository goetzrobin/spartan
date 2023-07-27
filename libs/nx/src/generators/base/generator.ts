import {
  addDependenciesToPackageJson,
  extractLayoutDirectory,
  generateFiles,
  getWorkspaceLayout,
  Tree,
} from '@nx/devkit';
import { HlmBaseGeneratorSchema } from './schema';
import * as path from 'path';
import { SPARTAN_BRAIN_CORE_VERSION, SPARTAN_HELM_CORE_VERSION } from './versions';

function getTargetLibraryDirectory(options: HlmBaseGeneratorSchema, tree: Tree) {
  const { layoutDirectory, projectDirectory } = extractLayoutDirectory(options.directory);
  const libsDir = options.rootProject ? '.' : layoutDirectory ?? getWorkspaceLayout(tree).libsDir;
  return path.join(libsDir, projectDirectory, options.publicName);
}

async function initializeAngularLibrary(tree: Tree, options: HlmBaseGeneratorSchema) {
  await (
    await import(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      '@nx/angular/generators'
    )
  ).libraryGenerator(tree, {
    name: options.publicName,
    skipFormat: true,
    simpleName: true,
    buildable: true,
    importPath: '@spartan-ng/' + options.publicName,
    prefix: 'hlm',
    skipModule: true,
    directory: options.directory,
    tags: options.tags,
  });
}

export async function hlmBaseGenerator(tree: Tree, options: HlmBaseGeneratorSchema) {
  const targetLibDir = getTargetLibraryDirectory(options, tree);
  await initializeAngularLibrary(tree, options);
  generateFiles(
    tree,
    path.join(__dirname, '..', options.internalName, 'files'),
    path.join(targetLibDir, 'src'),
    options
  );
  const spartanDependencyTask = addDependenciesToPackageJson(
    tree,
    {
      '@spartan-ng/ui-helm-core': SPARTAN_HELM_CORE_VERSION,
      '@spartan-ng/ui-brain-core': SPARTAN_BRAIN_CORE_VERSION,
    },
    {},
    path.join(targetLibDir, 'package.json')
  );
  await spartanDependencyTask();
}

export default hlmBaseGenerator;
