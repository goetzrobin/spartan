import { librarySecondaryEntryPointGenerator } from '@nx/angular/generators';
import { formatFiles, joinPathFragments, readJson, readProjectConfiguration, Tree, updateJson } from '@nx/devkit';
import { removeGenerator } from '@nx/workspace/generators';
import { migrateBrainImportsGenerator } from '@spartan-ng/cli';
import { PackageJson } from 'nx/src/utils/package-json';
import { BrainSecondaryEntrypointGeneratorSchema } from './schema';

export async function brainSecondaryEntrypointGenerator(tree: Tree, options: BrainSecondaryEntrypointGeneratorSchema) {
	await librarySecondaryEntryPointGenerator(tree, {
		name: options.name,
		library: 'brain',
		skipFormat: true,
		skipModule: true,
	});

	// if the user has chosen to migrate an existing project migrate it
	if (options.project) {
		await migrateExistingProject(tree, options);
	}

	await formatFiles(tree);
}

async function migrateExistingProject(tree: Tree, options: BrainSecondaryEntrypointGeneratorSchema) {
	const { tags, sourceRoot, root } = readProjectConfiguration(tree, options.name);

	// if the tag is not scope:brain then it is not eligible for migration
	if (!tags.includes('scope:brain')) {
		throw new Error(`Project ${options.name} is not eligible for migration as it does not have the tag 'scope:brain'`);
	}

	// if no sourceRoot is defined then the project is not eligible for migration
	if (!sourceRoot) {
		throw new Error(`Project ${options.name} is not eligible for migration as it does not have a sourceRoot defined`);
	}

	// read the package.json file to determine the import path
	const { name: importPath } = readJson<PackageJson>(tree, joinPathFragments(root, 'package.json'));

	// add this as an automated migration to our CLI generator
	updateJson(tree, 'libs/cli/src/generators/migrate-brain-imports/import-map.json', (json) => {
		json.imports[importPath] = `@spartan-ng/brain/${options.name}`;
		return json;
	});

	// determine the path to move the project to
	const entrypointSourceRoot = `libs/brain/${options.name}/src`;

	// iterate over the files in the sourceRoot and move them to the entrypointSourceRoot
	// we do however want to skip test-setup.ts as this has been defined in the brain library already
	iterateFiles(tree, sourceRoot, (path, filename) => {
		if (filename === 'test-setup.ts') {
			return;
		}

		// move the file to the new location
		const newFilePath = path.replace(sourceRoot, entrypointSourceRoot);

		tree.write(newFilePath, tree.read(path));
		tree.delete(path);
	});

	// remove the original library
	await removeGenerator(tree, { projectName: options.project, skipFormat: true, forceRemove: true, importPath });

	// migrate the imports - nicely we use our public migration generator here, so we can test it within our own project.
	await migrateBrainImportsGenerator(tree, { skipFormat: true });
}

/**
 * Recursively iterate over the files in a given directory
 */
function iterateFiles(tree: Tree, path: string, callback: (path: string, filename: string) => void) {
	const files = tree.children(path);
	for (const file of files) {
		const filePath = joinPathFragments(path, file);
		if (!tree.isFile(file)) {
			iterateFiles(tree, filePath, callback);
		} else {
			callback(filePath, file);
		}
	}
}

export default brainSecondaryEntrypointGenerator;
