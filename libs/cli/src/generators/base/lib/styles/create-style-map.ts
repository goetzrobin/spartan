import postcss from 'postcss';
import selectorParser, { type ClassName, type Selector as SelectorNodeRoot } from 'postcss-selector-parser';

const SPARTAN_PREFIX = 'spartan-';

export type StyleMap = Record<string, string>;

export function parseStyleMap(record: Record<string, unknown>): StyleMap {
	const styleMap: StyleMap = {};
	for (const [key, value] of Object.entries(record)) {
		if (!key.startsWith(SPARTAN_PREFIX)) {
			throw new Error(`Invalid style map key "${key}": expected it to start with "${SPARTAN_PREFIX}"`);
		}
		if (typeof value !== 'string') {
			throw new Error(`Invalid style map value for "${key}": expected a string, received ${typeof value}`);
		}
		styleMap[key] = value;
	}
	return styleMap;
}

export function createStyleMap(input: string) {
	const root = postcss.parse(input);

	const result: Record<string, string> = {};

	root.walkRules((rule) => {
		const selectors = rule.selectors ?? [];

		if (selectors.length === 0) {
			return;
		}

		const tailwindClasses = extractTailwindClasses(rule);

		if (!tailwindClasses) {
			return;
		}

		for (const selector of selectors) {
			const normalizedSelector = normalizeSelector(selector);

			selectorParser((selectorsRoot) => {
				selectorsRoot.each((sel) => {
					const targetClass = findSubjectClass(sel);

					if (!targetClass) {
						return;
					}

					const className = targetClass.value;

					if (!className.startsWith(SPARTAN_PREFIX)) {
						return;
					}

					result[className] = result[className] ? `${tailwindClasses} ${result[className]}` : tailwindClasses;
				});
			}).processSync(normalizedSelector);
		}
	});

	return parseStyleMap(result);
}

function normalizeSelector(selector: string) {
	return selector.replace(/\s*&\s*/g, '').trim();
}

function extractTailwindClasses(rule: postcss.Rule) {
	const classes: string[] = [];

	for (const node of rule.nodes || []) {
		if (node.type === 'atrule' && node.name === 'apply') {
			const value = node.params.trim();
			if (value) {
				classes.push(value);
			}
		}
	}

	if (classes.length === 0) {
		return null;
	}

	return classes.join(' ');
}

function findSubjectClass(selector: SelectorNodeRoot) {
	const classNodes: ClassName[] = [];

	selector.walkClasses((classNode) => {
		if (classNode.value.startsWith(SPARTAN_PREFIX)) {
			classNodes.push(classNode);
		}
	});

	if (classNodes.length === 0) {
		return null;
	}

	return classNodes[classNodes.length - 1];
}
