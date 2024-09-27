import type { HlmBaseGeneratorSchema } from '../schema';
import {
	NG_ICONS_VERSION,
	SPARTAN_ACCORDION_BRAIN_VERSION,
	SPARTAN_ALERT_DIALOG_BRAIN_VERSION,
	SPARTAN_AVATAR_BRAIN_VERSION,
	SPARTAN_COMMAND_BRAIN_VERSION,
	SPARTAN_CORE_VERSION,
	SPARTAN_DIALOG_BRAIN_VERSION,
	SPARTAN_FORMFIELD_VERSION,
	SPARTAN_HOVERCARD_BRAIN_VERSION,
	SPARTAN_LABEL_BRAIN_VERSION,
	SPARTAN_MENU_BRAIN_VERSION,
	SPARTAN_POPOVER_BRAIN_VERSION,
	SPARTAN_PROGRESS_BRAIN_VERSION,
	SPARTAN_RADIO_GROUP_BRAIN_VERSION,
	SPARTAN_SELECT_BRAIN_VERSION,
	SPARTAN_SEPARATOR_BRAIN_VERSION,
	SPARTAN_SHEET_BRAIN_VERSION,
	SPARTAN_SWITCH_VERSION,
	SPARTAN_TABLE_VERSION,
	SPARTAN_TABS_VERSION,
	SPARTAN_TOGGLE_VERSION,
	TAILWINDCSS_VERSION,
	TAILWIND_ANIMATE_VERSION,
	TAILWIND_MERGE_VERSION,
} from '../versions';

const BRAIN_DEPENDENCY_MAP = {
	accordion: SPARTAN_ACCORDION_BRAIN_VERSION,
	alertdialog: SPARTAN_ALERT_DIALOG_BRAIN_VERSION,
	avatar: SPARTAN_AVATAR_BRAIN_VERSION,
	command: SPARTAN_COMMAND_BRAIN_VERSION,
	dialog: SPARTAN_DIALOG_BRAIN_VERSION,
	hovercard: SPARTAN_HOVERCARD_BRAIN_VERSION,
	label: SPARTAN_LABEL_BRAIN_VERSION,
	menu: SPARTAN_MENU_BRAIN_VERSION,
	popover: SPARTAN_POPOVER_BRAIN_VERSION,
	progress: SPARTAN_PROGRESS_BRAIN_VERSION,
	radiogroup: SPARTAN_RADIO_GROUP_BRAIN_VERSION,
	select: SPARTAN_SELECT_BRAIN_VERSION,
	separator: SPARTAN_SEPARATOR_BRAIN_VERSION,
	sheet: SPARTAN_SHEET_BRAIN_VERSION,
	switch: SPARTAN_SWITCH_VERSION,
	tabs: SPARTAN_TABS_VERSION,
	table: SPARTAN_TABLE_VERSION,
	toggle: SPARTAN_TOGGLE_VERSION,
	formfield: SPARTAN_FORMFIELD_VERSION,
};

// TODO: can we combine this with primitive-deps.ts
const DEPENDENT_ON_DIALOG = ['alertdialog', 'sheet', 'popover'];
const DEPENDENT_ON_FORMS = ['input', 'select'];

export function buildDependencyArray(
	options: HlmBaseGeneratorSchema,
	angularVersion: string,
	existingCdkVersion: string,
) {
	let dependencies: Record<string, string> = {
		'@spartan-ng/ui-core': SPARTAN_CORE_VERSION,
		'@angular/cdk': existingCdkVersion ?? angularVersion,
	};

	if (options.peerDependencies) {
		dependencies = { ...dependencies, ...options.peerDependencies };
	}
	const brainDependencyVersion = BRAIN_DEPENDENCY_MAP[options.primitiveName as keyof typeof BRAIN_DEPENDENCY_MAP];
	if (brainDependencyVersion) {
		dependencies = { ...dependencies, [`@spartan-ng/ui-${options.primitiveName}-brain`]: brainDependencyVersion };
	}
	if (brainDependencyVersion && DEPENDENT_ON_DIALOG.includes(options.primitiveName)) {
		dependencies = { ...dependencies, '@spartan-ng/ui-dialog-brain': brainDependencyVersion };
	}
	if (brainDependencyVersion && DEPENDENT_ON_FORMS.includes(options.primitiveName)) {
		dependencies = { ...dependencies, '@spartan-ng/ui-forms-brain': brainDependencyVersion };
	}
	if (options.primitiveName === 'icon') {
		dependencies = { ...dependencies, '@ng-icons/core': NG_ICONS_VERSION };
	}
	return dependencies;
}

export function buildDevDependencyArray() {
	return {
		'tailwind-merge': TAILWIND_MERGE_VERSION,
		tailwindcss: TAILWINDCSS_VERSION,
		'tailwindcss-animate': TAILWIND_ANIMATE_VERSION,
	};
}
