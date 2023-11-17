import { Tree } from '@nx/devkit';
import { updateJson } from 'nx/src/generators/utils/json';

export const addPrimitiveToSupportedUILibraries = (
	tree: Tree,
	generatorName: string,
	internalName: string,
	peerDependencies: Record<string, string>,
) => {
	updateJson(tree, 'libs/nx/src/generators/ui/supported-ui-libraries.json', (old) => ({
		...old,
		[generatorName]: {
			internalName,
			peerDependencies,
		},
	}));
};
