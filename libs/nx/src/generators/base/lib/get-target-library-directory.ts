import { extractLayoutDirectory, getWorkspaceLayout, Tree } from '@nx/devkit';
import * as path from 'path';
import { HlmBaseGeneratorSchema } from '../schema';

export function getTargetLibraryDirectory(options: HlmBaseGeneratorSchema, tree: Tree) {
	const { layoutDirectory, projectDirectory } = extractLayoutDirectory(options.directory);
	const libsDir = options.rootProject ? '.' : layoutDirectory ?? getWorkspaceLayout(tree).libsDir;
	return path.join(libsDir, projectDirectory, options.publicName);
}
