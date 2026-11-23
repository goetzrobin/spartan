import ts from 'typescript';

export const STYLE = 'vega';

const PHYSICAL_TO_LOGICAL = [
	['ml', 'ms'],
	['mr', 'me'],
	['pl', 'ps'],
	['pr', 'pe'],
	['left', 'start'],
	['right', 'end'],
	['text-left', 'text-start'],
	['text-right', 'text-end'],
	['border-l', 'border-s'],
	['border-r', 'border-e'],
	['rounded-l', 'rounded-s'],
	['rounded-r', 'rounded-e'],
	['rounded-tl', 'rounded-ss'],
	['rounded-tr', 'rounded-se'],
	['rounded-bl', 'rounded-es'],
	['rounded-br', 'rounded-ee'],
];

function utilityStart(token) {
	let depth = 0;
	let start = 0;
	for (let index = 0; index < token.length; index++) {
		const char = token[index];
		if (char === '[' || char === '(') depth++;
		else if (char === ']' || char === ')') depth--;
		else if (char === ':' && depth === 0) start = index + 1;
	}
	return start;
}

function logicalDirection(token) {
	const start = utilityStart(token);
	const variants = token.slice(0, start);
	const utility = token.slice(start);
	const sign = utility.startsWith('-') ? '-' : '';
	const name = utility.slice(sign.length);
	for (const [physical, logical] of PHYSICAL_TO_LOGICAL) {
		if (name === physical) return `${variants}${sign}${logical}`;
		if (name.startsWith(`${physical}-`)) return `${variants}${sign}${logical}${name.slice(physical.length)}`;
	}
	return token;
}

function iconElement(token) {
	if (!token.includes('ng-icon')) return token;
	return token
		.replaceAll('ng-icon', 'svg')
		.replaceAll("[class*='text-']", "[class*='size-']")
		.replace(/text-\[length:--spacing\(([0-9.]+)\)\]$/, 'size-$1');
}

function invalidMarker(token) {
	return token
		.replaceAll('data-[matches-spartan-invalid=true]', 'aria-invalid')
		.replaceAll('data-matches-spartan-invalid=true', 'aria-invalid=true');
}

function stateMarker(token) {
	return token
		.replace(/data-\[state=(open|closed|checked|unchecked|active)\]/g, 'data-$1')
		.replace(/data-\[orientation=(horizontal|vertical)\]/g, 'data-$1')
		.replace(/data-\[([a-z-]+)(?:=true)?\]/g, 'data-$1');
}

export const TRANSLATIONS = [
	{
		name: 'invalid marker',
		rule: 'data-[matches-spartan-invalid=true] counts as aria-invalid',
		apply: invalidMarker,
	},
	{
		name: 'icon element',
		rule: 'ng-icon counts as svg, and its font size text-[length:--spacing(n)] counts as size-n',
		apply: iconElement,
	},
	{
		name: 'state marker',
		rule: 'data-[state=open] counts as data-open, data-[orientation=vertical] as data-vertical, data-[x=true] and data-[x] as data-x',
		apply: stateMarker,
	},
	{
		name: 'direction',
		rule: 'left and right utilities count as start and end (ml as ms, pr as pe, text-left as text-start)',
		apply: logicalDirection,
	},
];

export function translate(token) {
	return TRANSLATIONS.reduce((current, translation) => translation.apply(current), token);
}

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
	return [...new Set(classes)].sort();
}

function byTranslation(classes) {
	return new Map(classes.map((name) => [translate(name), name]));
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
	const outOfScope = [];
	for (const part of Object.keys(shadcn).sort()) {
		if (!(part in helm)) {
			if (allow[part]?.outOfScope === undefined) missingInHelm.push(part);
			else outOfScope.push(part);
			continue;
		}
		const theirs = byTranslation(shadcn[part]);
		const ours = byTranslation(helm[part]);
		const allowedHelm = new Set(allow[part]?.onlyInHelm ?? []);
		const allowedShadcn = new Set(allow[part]?.onlyInShadcn ?? []);
		parts.push({
			part,
			onlyInHelm: [...ours]
				.filter(([translated, name]) => !theirs.has(translated) && !allowedHelm.has(name))
				.map(([, name]) => name),
			onlyInShadcn: [...theirs]
				.filter(([translated, name]) => !ours.has(translated) && !allowedShadcn.has(name))
				.map(([, name]) => name),
		});
	}
	return {
		parts,
		missingInHelm,
		outOfScope,
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
	lines.push('', `parts out of scope (${result.outOfScope.length}):`);
	for (const part of result.outOfScope) lines.push(`  ${part}`);
	lines.push('', 'counted as equal:');
	for (const translation of TRANSLATIONS) lines.push(`  ${translation.rule}`);
	return lines.join('\n');
}
