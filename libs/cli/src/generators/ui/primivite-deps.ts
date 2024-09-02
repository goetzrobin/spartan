import type { Primitive } from './primivites';

export const primitiveDependencies: Record<Primitive, Primitive[]> = {
	accordion: ['icon'],
	alert: ['icon'],
	alertdialog: ['button'],
	aspectratio: [],
	avatar: [],
	badge: [],
	button: [],
	card: [],
	carousel: [],
	checkbox: ['icon'],
	collapsible: [],
	command: ['button', 'icon'],
	contextmenu: [],
	dialog: [],
	forms: [],
	'form-field': [],
	hovercard: [],
	icon: [],
	input: ['forms', 'form-field'],
	label: [],
	menu: ['icon'],
	menubar: [],
	pagination: ['button', 'icon'],
	popover: [],
	progress: [],
	radiogroup: [],
	scrollarea: [],
	select: ['icon', 'forms', 'form-field'],
	separator: [],
	sheet: [],
	skeleton: [],
	sonner: ['icon'],
	spinner: [],
	switch: [],
	table: [],
	tabs: [],
	toggle: [],
	tooltip: [],
};

export const getDependentPrimitives = (primitives: Primitive[]): Primitive[] => {
	const dependentPrimitives = new Set<Primitive>();

	for (const primitive of primitives) {
		const deps = primitiveDependencies[primitive];
		for (const dep of deps) {
			if (!primitives.includes(dep)) {
				// only add the dependent primitive if it's not already in the list of primitives to create
				dependentPrimitives.add(dep);
			}
		}
	}

	return Array.from(dependentPrimitives);
};
