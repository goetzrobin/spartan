import { librarySecondaryEntryPointGenerator } from '@nx/angular/generators';
import {
	formatFiles,
	getProjects,
	joinPathFragments,
	readJson,
	readProjectConfiguration,
	Tree,
	updateJson,
	visitNotIgnoredFiles,
} from '@nx/devkit';
import { removeGenerator } from '@nx/workspace/generators';
import { replaceBrainPackageWithSecondaryEntrypoint } from '@spartan-ng/cli';
import { basename } from 'node:path';
import { PackageJson } from 'nx/src/utils/package-json';
import * as ts from 'typescript';
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
	const { tags, sourceRoot, root } = readProjectConfiguration(tree, options.project);

	// if the tag is not scope:brain then it is not eligible for migration
	if (!tags.includes('scope:brain')) {
		throw new Error(`Project ${options.name} is not eligible for migration as it does not have the tag 'scope:brain'`);
	}

	// if no sourceRoot is defined then the project is not eligible for migration
	if (!sourceRoot) {
		throw new Error(`Project ${options.name} is not eligible for migration as it does not have a sourceRoot defined`);
	}

	// read the package.json file to determine the import path
	const { name: importPath, peerDependencies } = readJson<PackageJson>(tree, joinPathFragments(root, 'package.json'));

	// add this as an automated migration to our CLI generator
	const importMap = tree.read('libs/cli/src/generators/migrate-brain-imports/import-map.ts', 'utf8');

	// update the import map using a typescript transformer
	const transformer: ts.TransformerFactory<ts.SourceFile> = (context) => {
		return (sourceFile) => {
			const visitor = (node: ts.Node): ts.Node => {
				if (ts.isObjectLiteralExpression(node)) {
					return ts.factory.createObjectLiteralExpression([
						...node.properties,
						ts.factory.createPropertyAssignment(
							ts.factory.createStringLiteral(`@spartan-ng/${options.project}`),
							ts.factory.createStringLiteral(`@spartan-ng/brain/${options.name}`),
						),
					]);
				}

				return ts.visitEachChild(node, visitor, context);
			};

			return ts.visitNode(sourceFile, visitor) as ts.SourceFile;
		};
	};

	const result = ts.transpileModule(importMap, {
		compilerOptions: {
			module: ts.ModuleKind.ESNext,
			target: ts.ScriptTarget.ESNext,
		},
		transformers: { before: [transformer] },
	});

	tree.write('libs/cli/src/generators/migrate-brain-imports/import-map.ts', result.outputText);

	// determine the path to move the project to
	const entrypointSourceRoot = `libs/brain/${options.name}/src`;

	// iterate over the files in the sourceRoot and move them to the entrypointSourceRoot
	// we do however want to skip test-setup.ts as this has been defined in the brain library already
	visitNotIgnoredFiles(tree, sourceRoot, (path) => {
		if (basename(path) === 'test-setup.ts') {
			return;
		}

		// move the file to the new location
		const newFilePath = path.replace(sourceRoot, entrypointSourceRoot);

		tree.write(newFilePath, tree.read(path));
		tree.delete(path);
	});

	// remove the original library
	await removeGenerator(tree, { projectName: options.project, skipFormat: true, forceRemove: true, importPath });

	// copy over any peer dependencies from the original package.json
	updateJson<PackageJson>(tree, 'libs/brain/package.json', (json) => {
		for (const [key, value] of Object.entries(peerDependencies)) {
			if (!json.peerDependencies[key]) {
				json.peerDependencies[key] = value;
			}
		}

		return json;
	});

	// migrate library peer dependencies
	migratePeerDependencies(tree, importPath);

	// migrate the imports - nicely we use our public migration generator here, so we can test it within our own project.
	replaceBrainPackageWithSecondaryEntrypoint(
		tree,
		{ skipFormat: true, skipInstall: true },
		importPath,
		`@spartan-ng/brain/${options.name}`,
	);
}

function migratePeerDependencies(tree: Tree, oldPackage: string): void {
	const projects = getProjects(tree);

	for (const [, project] of projects) {
		const packageJsonPath = joinPathFragments(project.root, 'package.json');

		if (!tree.exists(packageJsonPath)) {
			continue;
		}

		updateJson(tree, packageJsonPath, (json) => {
			// check if the peer dependency is present
			if (!json.peerDependencies || !json.peerDependencies[oldPackage]) {
				return json;
			}

			// add a peer dependency to the unified brain package
			if (!json.peerDependencies[`@spartan-ng/brain`]) {
				json.peerDependencies[`@spartan-ng/brain`] = json.peerDependencies[oldPackage];
			}

			// remove the old peer dependency
			delete json.peerDependencies[oldPackage];

			return json;
		});
	}
}

export default brainSecondaryEntrypointGenerator;
