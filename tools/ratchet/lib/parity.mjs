import ts from 'typescript';

export const STYLE = 'vega';

export const RENAMES = [];

const HTML = /<[a-zA-Z!/]/;
const CLASS_ATTRIBUTE = /(?:^|\s)class\s*=\s*(?:"([^"]*)"|'([^']*)')/g;
const ANY_RULE = /([^{}]*)\{\s*@apply\s+([^;]*);\s*\}/g;

export function splitClasses(value) {
	return value
		.split(/\s+/)
		.map((token) => token.trim())
		.filter((token) => token.length > 0);
}

export function normalize(classes) {
	const renamed = classes.map((name) =>
		RENAMES.reduce((current, rename) => (current === rename.from ? rename.to : current), name),
	);
	return [...new Set(renamed)].sort();
}

function addClasses(parts, part, classes) {
	parts[part] = normalize([...(parts[part] ?? []), ...classes]);
}

function escapeRegExp(value) {
	return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function extractApply(source, prefix = 'cn-') {
	const css = source.replace(/\/\*[\s\S]*?\*\//g, '');
	const bare = new RegExp(`^\\.${escapeRegExp(prefix)}([a-z0-9-]+)$`);
	const parts = {};
	const skipped = [];
	for (const match of css.matchAll(ANY_RULE)) {
		const selector = match[1].trim();
		const part = bare.exec(selector)?.[1];
		if (part !== undefined) addClasses(parts, part, splitClasses(match[2]));
		else if (selector.includes(`.${prefix}`)) skipped.push(selector);
	}
	return { parts, skipped };
}

function classStrings(text) {
	if (!HTML.test(text)) return [text];
	return [...text.matchAll(CLASS_ATTRIBUTE)].map((match) => match[1] ?? match[2]);
}

function isPlainString(node) {
	return ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node);
}

function literalTexts(node) {
	if (isPlainString(node)) return [node.text];
	if (ts.isTemplateExpression(node)) return [node.head.text, ...node.templateSpans.map((span) => span.literal.text)];
	return undefined;
}

function siblingsOf(node) {
	const container = node.parent;
	if (ts.isArrayLiteralExpression(container)) return container.elements;
	if (ts.isCallExpression(container) && container.arguments.includes(node)) return container.arguments;
	return [];
}

function markersIn(tokens, prefix) {
	return tokens.filter((token) => token.startsWith(prefix) && token.length > prefix.length);
}

export function extractMarkedClasses(fileName, text, prefix) {
	const kind = fileName.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
	const sourceFile = ts.createSourceFile(fileName, text, ts.ScriptTarget.Latest, true, kind);
	const parts = {};
	const visit = (node) => {
		const texts = literalTexts(node);
		if (texts === undefined) {
			ts.forEachChild(node, visit);
			return;
		}
		for (const literal of texts) {
			const html = HTML.test(literal);
			for (const value of classStrings(literal)) {
				const tokens = splitClasses(value);
				const markers = markersIn(tokens, prefix);
				if (markers.length === 0) continue;
				const siblings = html
					? []
					: siblingsOf(node)
							.filter((sibling) => sibling !== node && isPlainString(sibling))
							.map((sibling) => splitClasses(sibling.text))
							.filter((siblingTokens) => markersIn(siblingTokens, prefix).length === 0)
							.flat();
				const classes = [...tokens, ...siblings].filter((token) => !token.startsWith(prefix));
				for (const marker of markers) addClasses(parts, marker.slice(prefix.length), classes);
			}
		}
		ts.forEachChild(node, visit);
	};
	visit(sourceFile);
	return parts;
}

export function mergeParts(...sources) {
	const parts = {};
	for (const source of sources) {
		for (const [part, classes] of Object.entries(source)) addClasses(parts, part, classes);
	}
	return Object.fromEntries(Object.entries(parts).sort(([a], [b]) => a.localeCompare(b)));
}

export function compareParts(shadcn, helm, allow = {}) {
	const parts = [];
	const missingInHelm = [];
	for (const part of Object.keys(shadcn).sort()) {
		if (!(part in helm)) {
			missingInHelm.push(part);
			continue;
		}
		const theirs = new Set(normalize(shadcn[part]));
		const ours = new Set(normalize(helm[part]));
		const allowedHelm = new Set(allow[part]?.onlyInHelm ?? []);
		const allowedShadcn = new Set(allow[part]?.onlyInShadcn ?? []);
		parts.push({
			part,
			onlyInHelm: [...ours].filter((name) => !theirs.has(name) && !allowedHelm.has(name)),
			onlyInShadcn: [...theirs].filter((name) => !ours.has(name) && !allowedShadcn.has(name)),
		});
	}
	return {
		parts,
		missingInHelm,
		counts: {
			classesOnlyInHelm: { helm: parts.reduce((sum, entry) => sum + entry.onlyInHelm.length, 0) },
			classesOnlyInShadcn: { helm: parts.reduce((sum, entry) => sum + entry.onlyInShadcn.length, 0) },
			partsMissingInHelm: { helm: missingInHelm.length },
		},
	};
}

export function formatReport(result) {
	const lines = [];
	const differing = result.parts.filter((entry) => entry.onlyInHelm.length + entry.onlyInShadcn.length > 0);
	lines.push(`compared ${result.parts.length} parts, ${differing.length} with differences`);
	for (const entry of differing) {
		lines.push('', entry.part);
		if (entry.onlyInHelm.length > 0) lines.push(`  only in helm:   ${entry.onlyInHelm.join(' ')}`);
		if (entry.onlyInShadcn.length > 0) lines.push(`  only in shadcn: ${entry.onlyInShadcn.join(' ')}`);
	}
	lines.push('', `parts missing in helm (${result.missingInHelm.length}):`);
	for (const part of result.missingInHelm) lines.push(`  ${part}`);
	return lines.join('\n');
}
