import * as path from 'node:path';
import { type Tree, extractLayoutDirectory, getWorkspaceLayout } from '@nx/devkit';
import type { HlmBaseGeneratorSchema } from '../schema';

export function getTargetLibraryDirectory(options: HlmBaseGeneratorSchema, tree: Tree) {
	const { layoutDirectory, projectDirectory } = extractLayoutDirectory(options.directory);
	const libsDir = options.rootProject ? '.' : layoutDirectory ?? getWorkspaceLayout(tree).libsDir;
	return path.join(libsDir, projectDirectory, options.publicName);
}
