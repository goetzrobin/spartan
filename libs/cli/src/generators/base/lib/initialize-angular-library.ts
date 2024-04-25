import type { Tree } from '@nx/devkit';
import type { HlmBaseGeneratorSchema } from '../schema';

export async function initializeAngularLibrary(tree: Tree, options: HlmBaseGeneratorSchema) {
	return await (
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
		importPath: `@spartan-ng/${options.publicName}`,
		prefix: 'hlm',
		skipModule: true,
		standalone: false,
		directory: options.directory,
		tags: options.tags,
	});
}
