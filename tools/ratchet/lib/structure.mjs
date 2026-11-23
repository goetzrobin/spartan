import ts from 'typescript';

export const STRUCTURE_METRICS = [
	'commentLines',
	'cdkImportFiles',
	'filesOver300Lines',
	'classesThatExtend',
	'lintDisables',
	'privateGetters',
];

const LINE_LIMIT = 300;
const DIRECTIVE = /^(eslint-disable|eslint-enable|prettier-ignore|@ts-|\/\s*<reference\b)/;
const LINT_DISABLE = /^eslint-disable(-next-line|-line)?(\s|$)/;

export function isLibrarySource(relativePath) {
	const file = `/${relativePath.split('\\').join('/')}`;
	if (!file.endsWith('.ts') || file.endsWith('.d.ts')) return false;
	if (/\.(spec|test|stories)\.ts$/.test(file)) return false;
	if (file.endsWith('/test-setup.ts')) return false;
	return !['/__tests__/', '/src/testing/', '/node_modules/', '/dist/'].some((part) => file.includes(part));
}

export function commentText(text, range) {
	const raw = text.slice(range.pos, range.end);
	if (range.kind === ts.SyntaxKind.SingleLineCommentTrivia) return raw.slice(2).trim();
	return raw
		.replace(/^\/\*+/, '')
		.replace(/\*\/$/, '')
		.trim();
}

function isJsDoc(text, range) {
	return (
		range.kind === ts.SyntaxKind.MultiLineCommentTrivia &&
		text.startsWith('/**', range.pos) &&
		!text.startsWith('/**/', range.pos)
	);
}

function hasExportModifier(node) {
	return (ts.canHaveModifiers(node) ? (ts.getModifiers(node) ?? []) : []).some(
		(modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword,
	);
}

function isExportedTypeMember(node) {
	if (!ts.isTypeElement(node)) return false;
	let parent = node.parent;
	while (parent !== undefined && !ts.isInterfaceDeclaration(parent) && !ts.isTypeAliasDeclaration(parent)) {
		if (!ts.isTypeNode(parent) && !ts.isTypeElement(parent)) return false;
		parent = parent.parent;
	}
	return parent !== undefined && hasExportModifier(parent);
}

function documentsPublicApi(node) {
	if (ts.isExportAssignment(node) || hasExportModifier(node)) return true;
	if (ts.isClassElement(node) && node.parent !== undefined && ts.isClassLike(node.parent)) return true;
	return isExportedTypeMember(node);
}

function collectComments(sourceFile) {
	const text = sourceFile.text;
	const comments = new Map();
	const owners = new Map();
	const add = (ranges, owner) => {
		for (const range of ranges ?? []) {
			if (!comments.has(range.pos)) comments.set(range.pos, range);
			if (owner && !owners.has(range.pos)) owners.set(range.pos, owner);
		}
	};
	const visitNodes = (node) => {
		add(ts.getLeadingCommentRanges(text, node.pos), node);
		ts.forEachChild(node, visitNodes);
	};
	const visitTokens = (node) => {
		add(ts.getLeadingCommentRanges(text, node.pos));
		add(ts.getTrailingCommentRanges(text, node.end));
		for (const child of node.getChildren(sourceFile)) visitTokens(child);
	};
	add(ts.getLeadingCommentRanges(text, 0));
	ts.forEachChild(sourceFile, visitNodes);
	visitTokens(sourceFile);
	return { comments: [...comments.values()].sort((a, b) => a.pos - b.pos), owners };
}

function countCommentLines(sourceFile, comments, owners) {
	const text = sourceFile.text;
	const lines = new Set();
	let lintDisables = 0;
	for (const range of comments) {
		const body = commentText(text, range);
		if (LINT_DISABLE.test(body)) lintDisables += 1;
		if (DIRECTIVE.test(body)) continue;
		const owner = owners.get(range.pos);
		if (isJsDoc(text, range) && owner && documentsPublicApi(owner)) continue;
		const first = sourceFile.getLineAndCharacterOfPosition(range.pos).line;
		const last = sourceFile.getLineAndCharacterOfPosition(range.end).line;
		for (let line = first; line <= last; line += 1) lines.add(line);
	}
	return { commentLines: lines.size, lintDisables };
}

function isCdk(specifier) {
	return (
		specifier !== undefined &&
		ts.isStringLiteral(specifier) &&
		(specifier.text === '@angular/cdk' || specifier.text.startsWith('@angular/cdk/'))
	);
}

function isPrivateGetter(node) {
	if (!ts.isGetAccessorDeclaration(node)) return false;
	if (ts.isPrivateIdentifier(node.name)) return true;
	return (ts.getModifiers(node) ?? []).some((modifier) => modifier.kind === ts.SyntaxKind.PrivateKeyword);
}

function countNodes(sourceFile) {
	const counts = { cdkImport: false, classesThatExtend: 0, privateGetters: 0 };
	const visit = (node) => {
		if ((ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) && isCdk(node.moduleSpecifier)) {
			counts.cdkImport = true;
		}
		if (
			ts.isClassLike(node) &&
			(node.heritageClauses ?? []).some((clause) => clause.token === ts.SyntaxKind.ExtendsKeyword)
		) {
			counts.classesThatExtend += 1;
		}
		if (isPrivateGetter(node)) counts.privateGetters += 1;
		ts.forEachChild(node, visit);
	};
	visit(sourceFile);
	return counts;
}

function lineCount(text) {
	if (text.length === 0) return 0;
	const lines = text.split(/\r?\n/).length;
	return text.endsWith('\n') ? lines - 1 : lines;
}

export function countStructure(filePath, text) {
	const sourceFile = ts.createSourceFile(filePath, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
	const { comments, owners } = collectComments(sourceFile);
	const { commentLines, lintDisables } = countCommentLines(sourceFile, comments, owners);
	const { cdkImport, classesThatExtend, privateGetters } = countNodes(sourceFile);
	return {
		commentLines,
		cdkImportFiles: cdkImport ? 1 : 0,
		filesOver300Lines: lineCount(text) > LINE_LIMIT ? 1 : 0,
		classesThatExtend,
		lintDisables,
		privateGetters,
	};
}

export function aggregateStructure(files, libraries) {
	const totals = {};
	for (const metric of STRUCTURE_METRICS) {
		totals[metric] = {};
		for (const library of libraries) totals[metric][library] = 0;
	}
	for (const { library, counts } of files) {
		if (!libraries.includes(library)) continue;
		for (const metric of STRUCTURE_METRICS) totals[metric][library] += counts[metric];
	}
	return totals;
}
