import ts from 'typescript';

/**
 * Reads one `*.stories.ts` file into a plain description of what it contains.
 *
 * The transform never guesses. Whatever does not match one of the shapes handled here is
 * returned as a reason on the story (or on the file), and that story is left out of the
 * generated pages and listed in the report instead.
 *
 * @typedef {{ key: string, value: string, isFunction: boolean }} Field
 * @typedef {{
 *   exportName: string,
 *   args: Field[],
 *   props: Field[],
 *   imports: string[],
 *   providers: string[],
 *   routeProviders: string[],
 *   template: string,
 *   reasons: string[],
 * }} Story
 */

const STORYBOOK = /^@storybook\//;

export function parseStoryFile(fileName, sourceText) {
	const source = ts.createSourceFile(fileName, sourceText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
	const text = (node) => node.getText(source);

	/** @type {string[]} */
	const fileReasons = [];
	/** import declarations from anything but Storybook, kept verbatim */
	const importStatements = [];
	/** local name -> import statement that brings it in */
	const importedNames = new Map();
	/** top-level declarations that are neither meta nor a story */
	const helpers = [];
	const helperNames = new Set();
	const storyNodes = [];
	let metaNode;
	let metaName;

	for (const statement of source.statements) {
		if (ts.isImportDeclaration(statement)) {
			const module = statement.moduleSpecifier.text;
			if (STORYBOOK.test(module)) continue;
			importStatements.push(statement);
			const clause = statement.importClause;
			if (clause?.name) importedNames.set(clause.name.text, statement);
			const bindings = clause?.namedBindings;
			if (bindings && ts.isNamespaceImport(bindings)) importedNames.set(bindings.name.text, statement);
			if (bindings && ts.isNamedImports(bindings)) {
				for (const element of bindings.elements) importedNames.set(element.name.text, statement);
			}
			continue;
		}

		if (ts.isExportAssignment(statement)) {
			// `export default meta;` or `export default { ... } as Meta<...>;`
			const expression = unwrap(statement.expression);
			if (ts.isIdentifier(expression)) metaName = expression.text;
			else if (ts.isObjectLiteralExpression(expression)) metaNode = expression;
			else fileReasons.push('default export is neither an identifier nor an object literal');
			continue;
		}

		if (ts.isTypeAliasDeclaration(statement) && /StoryObj|StoryFn/.test(text(statement.type))) continue;

		if (ts.isVariableStatement(statement) && isExported(statement)) {
			for (const declaration of statement.declarationList.declarations) {
				if (!ts.isIdentifier(declaration.name)) {
					fileReasons.push('exported destructuring is not supported');
					continue;
				}
				storyNodes.push({ exportName: declaration.name.text, initializer: declaration.initializer });
			}
			continue;
		}

		helpers.push(statement);
		for (const name of declaredNames(statement)) helperNames.add(name);
	}

	if (!metaNode && metaName) {
		const index = helpers.findIndex(
			(statement) =>
				ts.isVariableStatement(statement) &&
				statement.declarationList.declarations.some((d) => ts.isIdentifier(d.name) && d.name.text === metaName),
		);
		if (index >= 0) {
			const declaration = helpers[index].declarationList.declarations.find((d) => d.name.text === metaName);
			const initializer = declaration.initializer && unwrap(declaration.initializer);
			if (initializer && ts.isObjectLiteralExpression(initializer)) metaNode = initializer;
			helpers.splice(index, 1);
			helperNames.delete(metaName);
		}
	}

	if (!metaNode) {
		fileReasons.push('no meta object found');
		return { fileReasons, title: undefined, stories: [], helpers: [], importStatements: [], source };
	}

	const titleNode = property(metaNode, 'title');
	const title = titleNode && ts.isStringLiteralLike(titleNode) ? titleNode.text : undefined;
	if (!title) fileReasons.push('meta.title is not a string literal');

	const metaReasons = [];
	const metaArgs = readFields(property(metaNode, 'args'), 'meta.args', metaReasons, text);
	const metaDecorators = readDecorators(property(metaNode, 'decorators'), 'meta', metaReasons, text);
	const hasMetaRender = Boolean(property(metaNode, 'render'));
	if (hasMetaRender) metaReasons.push('meta.render is not supported');

	/** @type {Story[]} */
	const stories = storyNodes.map(({ exportName, initializer }) => {
		const reasons = [...metaReasons];
		const empty = { exportName, args: [], props: [], imports: [], providers: [], routeProviders: [], template: '' };
		const object = initializer && unwrap(initializer);
		if (!object || !ts.isObjectLiteralExpression(object)) {
			return { ...empty, reasons: [...reasons, 'story is not an object literal'] };
		}
		for (const member of object.properties) {
			if (!ts.isPropertyAssignment(member) && !ts.isMethodDeclaration(member)) {
				reasons.push(`story member \`${text(member).slice(0, 40)}\` is not a plain property`);
			}
		}
		if (property(object, 'play')) reasons.push('story has a play function');

		const args = mergeFields(metaArgs, readFields(property(object, 'args'), 'args', reasons, text));
		const decorators = readDecorators(property(object, 'decorators'), 'story', reasons, text);
		const render = readRender(property(object, 'render'), args, reasons, text);

		return {
			exportName,
			args,
			props: render.props,
			imports: [...metaDecorators.imports, ...decorators.imports, ...render.imports],
			providers: [...metaDecorators.providers, ...decorators.providers, ...render.providers],
			routeProviders: [...metaDecorators.routeProviders, ...decorators.routeProviders],
			template: render.template,
			reasons,
		};
	});

	return { fileReasons, title, stories, helpers, helperNames, importStatements, importedNames, source };
}

function unwrap(expression) {
	let current = expression;
	while (
		ts.isAsExpression(current) ||
		ts.isSatisfiesExpression(current) ||
		ts.isParenthesizedExpression(current) ||
		ts.isTypeAssertionExpression(current)
	) {
		current = current.expression;
	}
	return current;
}

function isExported(statement) {
	return Boolean(statement.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword));
}

function declaredNames(statement) {
	if (ts.isVariableStatement(statement)) {
		return statement.declarationList.declarations.filter((d) => ts.isIdentifier(d.name)).map((d) => d.name.text);
	}
	if (
		(ts.isClassDeclaration(statement) ||
			ts.isFunctionDeclaration(statement) ||
			ts.isInterfaceDeclaration(statement) ||
			ts.isTypeAliasDeclaration(statement) ||
			ts.isEnumDeclaration(statement)) &&
		statement.name
	) {
		return [statement.name.text];
	}
	return [];
}

function property(object, name) {
	for (const member of object.properties) {
		if (!member.name) continue;
		const key = ts.isIdentifier(member.name) || ts.isStringLiteralLike(member.name) ? member.name.text : undefined;
		if (key !== name) continue;
		if (ts.isPropertyAssignment(member)) return member.initializer;
		if (ts.isMethodDeclaration(member)) return member;
	}
	return undefined;
}

/** `{ align: 'center', sideOffset: 4 }` -> fields. Spreads, shorthand and computed keys are refused. */
function readFields(node, label, reasons, text) {
	if (!node) return [];
	const object = unwrap(node);
	if (!ts.isObjectLiteralExpression(object)) {
		reasons.push(`${label} is not an object literal`);
		return [];
	}
	const fields = [];
	for (const member of object.properties) {
		if (!ts.isPropertyAssignment(member)) {
			reasons.push(`${label} has a member that is not \`key: value\` (\`${text(member).slice(0, 40)}\`)`);
			continue;
		}
		if (!ts.isIdentifier(member.name) && !ts.isStringLiteralLike(member.name)) {
			reasons.push(`${label} has a computed key`);
			continue;
		}
		const key = member.name.text;
		if (!/^[A-Za-z_$][\w$]*$/.test(key)) {
			reasons.push(`${label} key \`${key}\` is not a valid class member name`);
			continue;
		}
		const value = unwrap(member.initializer);
		fields.push({
			key,
			value: text(member.initializer),
			isFunction: ts.isArrowFunction(value) || ts.isFunctionExpression(value),
		});
	}
	return fields;
}

function mergeFields(base, override) {
	const merged = new Map(base.map((field) => [field.key, field]));
	for (const field of override) merged.set(field.key, field);
	return [...merged.values()];
}

/** Only `moduleMetadata({ imports, providers })` and `applicationConfig({ providers })` are understood. */
function readDecorators(node, label, reasons, text) {
	const result = { imports: [], providers: [], routeProviders: [] };
	if (!node) return result;
	const array = unwrap(node);
	if (!ts.isArrayLiteralExpression(array)) {
		reasons.push(`${label} decorators is not an array literal`);
		return result;
	}
	for (const element of array.elements) {
		const call = unwrap(element);
		const callee = ts.isCallExpression(call) && ts.isIdentifier(call.expression) ? call.expression.text : undefined;
		const config = callee && call.arguments.length === 1 ? unwrap(call.arguments[0]) : undefined;
		if ((callee !== 'moduleMetadata' && callee !== 'applicationConfig') || !ts.isObjectLiteralExpression(config)) {
			reasons.push(`${label} decorator \`${text(element).slice(0, 50)}\` is not supported`);
			continue;
		}
		for (const member of config.properties) {
			const key = ts.isPropertyAssignment(member) && ts.isIdentifier(member.name) ? member.name.text : undefined;
			const list = key ? unwrap(member.initializer) : undefined;
			if (!list || !ts.isArrayLiteralExpression(list) || list.elements.some(ts.isSpreadElement)) {
				reasons.push(`${label} ${callee} has a member that is not a plain array (\`${text(member).slice(0, 40)}\`)`);
				continue;
			}
			const items = list.elements.map((item) => text(item));
			if (callee === 'moduleMetadata' && key === 'imports') result.imports.push(...items);
			else if (callee === 'moduleMetadata' && key === 'providers') result.providers.push(...items);
			else if (callee === 'applicationConfig' && key === 'providers') result.routeProviders.push(...items);
			else reasons.push(`${label} ${callee}.${key} is not supported`);
		}
	}
	return result;
}

/**
 * Handles `render: (args) => ({ props, template })` where the template is a string and the only
 * interpolation in it is `argsToTemplate(args)`.
 */
function readRender(node, args, reasons, text) {
	const result = { props: [], template: '', imports: [], providers: [] };
	if (!node) {
		reasons.push('story has no render function (component-only stories are not supported yet)');
		return result;
	}
	if (!ts.isArrowFunction(node) && !ts.isFunctionExpression(node)) {
		reasons.push('render is not an inline function');
		return result;
	}

	let argsName;
	if (node.parameters.length > 1) reasons.push('render takes more than one parameter');
	const parameter = node.parameters[0];
	if (parameter) {
		if (ts.isIdentifier(parameter.name)) {
			argsName = parameter.name.text;
		} else if (
			ts.isObjectBindingPattern(parameter.name) &&
			parameter.name.elements.length === 1 &&
			parameter.name.elements[0].dotDotDotToken &&
			ts.isIdentifier(parameter.name.elements[0].name)
		) {
			argsName = parameter.name.elements[0].name.text;
		} else {
			reasons.push(`render parameter \`${text(parameter)}\` is not \`args\` or \`{ ...args }\``);
		}
	}

	let returned;
	if (ts.isBlock(node.body)) {
		const only = node.body.statements.length === 1 ? node.body.statements[0] : undefined;
		if (only && ts.isReturnStatement(only) && only.expression) returned = unwrap(only.expression);
		else reasons.push('render body has more than a single return');
	} else {
		returned = unwrap(node.body);
	}
	if (!returned || !ts.isObjectLiteralExpression(returned)) {
		if (returned) reasons.push('render does not return an object literal');
		return result;
	}

	for (const member of returned.properties) {
		const key = member.name && ts.isIdentifier(member.name) ? member.name.text : undefined;
		if (key !== 'props' && key !== 'template' && key !== 'moduleMetadata') {
			reasons.push(
				`render returns \`${key ?? text(member).slice(0, 30)}\`, only props, template and moduleMetadata are supported`,
			);
		}
	}

	// `moduleMetadata: { imports, providers }` returned from render means the same as the decorator.
	const metadata = property(returned, 'moduleMetadata');
	if (metadata) {
		const config = unwrap(metadata);
		if (!ts.isObjectLiteralExpression(config)) {
			reasons.push('render moduleMetadata is not an object literal');
		} else {
			for (const member of config.properties) {
				const key = ts.isPropertyAssignment(member) && ts.isIdentifier(member.name) ? member.name.text : undefined;
				const list = key ? unwrap(member.initializer) : undefined;
				const plain = list && ts.isArrayLiteralExpression(list) && !list.elements.some(ts.isSpreadElement);
				if ((key !== 'imports' && key !== 'providers') || !plain) {
					reasons.push(`render moduleMetadata member \`${text(member).slice(0, 40)}\` is not supported`);
					continue;
				}
				result[key].push(...list.elements.map((item) => text(item)));
			}
		}
	}

	const props = property(returned, 'props');
	if (props) {
		const value = unwrap(props);
		if (ts.isIdentifier(value) && value.text === argsName) {
			// `props: args` adds nothing beyond the args themselves
		} else if (ts.isObjectLiteralExpression(value)) {
			for (const member of value.properties) {
				if (ts.isSpreadAssignment(member)) {
					if (!ts.isIdentifier(member.expression) || member.expression.text !== argsName) {
						reasons.push(`props spreads \`${text(member.expression)}\`, only the args can be spread`);
					}
					continue;
				}
				if (!ts.isPropertyAssignment(member) || !ts.isIdentifier(member.name)) {
					reasons.push(`props member \`${text(member).slice(0, 40)}\` is not \`key: value\``);
					continue;
				}
				const initializer = unwrap(member.initializer);
				if (argsName && identifiersIn(text(member.initializer)).has(argsName)) {
					reasons.push(`props member \`${member.name.text}\` computes its value from the args`);
					continue;
				}
				result.props.push({
					key: member.name.text,
					value: text(member.initializer),
					isFunction: ts.isArrowFunction(initializer) || ts.isFunctionExpression(initializer),
				});
			}
		} else {
			reasons.push('props is neither the args nor an object literal');
		}
	}

	const template = property(returned, 'template');
	if (!template) {
		reasons.push('render returns no template');
		return result;
	}
	const literal = unwrap(template);
	if (ts.isStringLiteralLike(literal)) {
		result.template = literal.text;
	} else if (ts.isTemplateExpression(literal)) {
		let built = literal.head.text;
		for (const span of literal.templateSpans) {
			const bindings = readArgsToTemplate(span.expression, argsName, args, reasons, text);
			built += bindings + span.literal.text;
		}
		result.template = built;
	} else {
		reasons.push('template is not a string');
	}
	return result;
}

/** `argsToTemplate(args)` or `argsToTemplate(args, { include | exclude: [...] })` -> `[a]="a" (b)="b($event)"` */
function readArgsToTemplate(expression, argsName, args, reasons, text) {
	const call = unwrap(expression);
	const isCall =
		ts.isCallExpression(call) && ts.isIdentifier(call.expression) && call.expression.text === 'argsToTemplate';
	const first = isCall ? call.arguments[0] : undefined;
	if (!isCall || !first || !ts.isIdentifier(first) || first.text !== argsName || call.arguments.length > 2) {
		reasons.push(`template interpolates \`${text(expression).slice(0, 50)}\`, only argsToTemplate(args) is supported`);
		return '';
	}

	let include;
	let exclude;
	const options = call.arguments[1] && unwrap(call.arguments[1]);
	if (options) {
		if (!ts.isObjectLiteralExpression(options)) {
			reasons.push('argsToTemplate options is not an object literal');
			return '';
		}
		for (const member of options.properties) {
			const key = ts.isPropertyAssignment(member) && ts.isIdentifier(member.name) ? member.name.text : undefined;
			const list = key ? unwrap(member.initializer) : undefined;
			const literals = list && ts.isArrayLiteralExpression(list) && list.elements.every(ts.isStringLiteralLike);
			if ((key !== 'include' && key !== 'exclude') || !literals) {
				reasons.push(`argsToTemplate option \`${text(member).slice(0, 40)}\` is not supported`);
				return '';
			}
			const names = list.elements.map((element) => element.text);
			if (key === 'include') include = names;
			else exclude = names;
		}
	}

	return args
		.filter((field) => field.value !== 'undefined')
		.filter((field) => !include || include.includes(field.key))
		.filter((field) => !exclude || !exclude.includes(field.key))
		.map((field) => (field.isFunction ? `(${field.key})="${field.key}($event)"` : `[${field.key}]="${field.key}"`))
		.join(' ');
}

/** Every identifier used as a value or a type inside a piece of TypeScript. */
export function identifiersIn(code) {
	const source = ts.createSourceFile('snippet.ts', `const __x = [\n${code}\n];`, ts.ScriptTarget.Latest, true);
	const names = new Set();
	const visit = (node) => {
		if (ts.isIdentifier(node)) names.add(node.text);
		ts.forEachChild(node, visit);
	};
	visit(source);
	names.delete('__x');
	return names;
}

/** Source of a helper declaration with `export` added when it is missing. */
export function exportedHelperText(statement, source) {
	const full = statement.getFullText(source).replace(/^\s*\n/, '');
	if (isExported(statement)) return full;
	const names = declaredNames(statement);
	if (names.length === 0) return full;

	// For a decorated class the keyword goes after the decorators, not before them.
	let insertAt = statement.getStart(source);
	if (ts.isClassDeclaration(statement)) {
		const decorators = (statement.modifiers ?? []).filter(ts.isDecorator);
		const last = decorators[decorators.length - 1];
		if (last) {
			const after = source.text.slice(last.getEnd());
			insertAt = last.getEnd() + after.length - after.trimStart().length;
		}
	}
	const offset = insertAt - statement.getFullStart() - (statement.getFullText(source).length - full.length);
	return `${full.slice(0, offset)}export ${full.slice(offset)}`;
}
