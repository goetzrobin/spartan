// All credit goes to the incredible folks at Nx who use this code to update the app styles when adding tailwind
// Check out the code here: https://github.com/nrwl/nx/blob/master/packages/angular/src/generators/setup-tailwind/lib/update-application-styles.ts

import { type ProjectConfiguration, type Tree, joinPathFragments, stripIndents } from '@nx/devkit';
import { type SupportedTheme, SupportedThemeGeneratorMap } from './supported-theme-generator-map';

export interface AddThemeToApplicationStylesOptions {
	project: string;
	theme: SupportedTheme;
	radius: number;
	addCdkStyles: boolean;
	stylesEntryPoint?: string;
	prefix?: string;
}

export function addThemeToApplicationStyles(
	tree: Tree,
	options: AddThemeToApplicationStylesOptions,
	project: ProjectConfiguration,
): void {
	const prefix = options.prefix ? ` .${options.prefix}` : '';
	let stylesEntryPoint = options.stylesEntryPoint;

	if (stylesEntryPoint && !tree.exists(stylesEntryPoint)) {
		throw new Error(`The provided styles entry point "${stylesEntryPoint}" could not be found.`);
	}

	if (!stylesEntryPoint) {
		stylesEntryPoint = findStylesEntryPoint(tree, project);

		if (!stylesEntryPoint) {
			throw new Error(
				stripIndents`Could not find a styles entry point for project "${options.project}".
        Please specify a styles entry point using the "stylesEntryPoint" option.`,
			);
		}
	}

	const stylesEntryPointContent = tree.read(stylesEntryPoint, 'utf-8');

	const CDK_IMPORT = `@import '@angular/cdk/overlay-prebuilt.css';`;
	const ckdOverlayImport = stylesEntryPointContent.includes(CDK_IMPORT) ? '' : CDK_IMPORT;

	const rootFontSans = stylesEntryPointContent.includes('--font-sans')
		? ''
		: `:root {
     --font-sans: ''
     }`;

	tree.write(
		stylesEntryPoint,
		stripIndents`
    ${ckdOverlayImport}

    ${stylesEntryPointContent}

    ${rootFontSans}
    ${SupportedThemeGeneratorMap[options.theme](options.radius, prefix)}`,
	);
}

function findStylesEntryPoint(tree: Tree, project: ProjectConfiguration): string | undefined {
	// first check for common names
	const possibleStylesEntryPoints = [
		joinPathFragments(project.sourceRoot ?? project.root, 'styles.css'),
		joinPathFragments(project.sourceRoot ?? project.root, 'styles.scss'),
		joinPathFragments(project.sourceRoot ?? project.root, 'styles.sass'),
		joinPathFragments(project.sourceRoot ?? project.root, 'styles.less'),
	];

	const stylesEntryPoint = possibleStylesEntryPoints.find((s) => tree.exists(s));
	if (stylesEntryPoint) {
		return stylesEntryPoint;
	}

	// then check for the specified styles in the build configuration if it exists
	const styles: Array<string | { input: string; inject: boolean }> = project.targets?.build.options?.styles;

	if (!styles) {
		return undefined;
	}

	// find the first style that belongs to the project source
	const style = styles.find((s) =>
		typeof s === 'string'
			? s.startsWith(project.root) && tree.exists(s)
			: s.input.startsWith(project.root) && s.inject !== false && tree.exists(s.input),
	);

	if (!style) {
		return undefined;
	}

	return typeof style === 'string' ? style : style.input;
}
