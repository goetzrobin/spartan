export function startCase(exportName) {
	return exportName
		.replace(/([a-z0-9])([A-Z])/g, '$1 $2')
		.replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
		.replace(/([a-zA-Z])([0-9])/g, '$1 $2')
		.replace(/([0-9])([a-zA-Z])/g, '$1 $2')
		.replace(/[_-]+/g, ' ')
		.trim();
}

export function sanitize(text) {
	return text
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

export function titleId(title) {
	return sanitize(title);
}

export function storyId(exportName) {
	return sanitize(startCase(exportName));
}

export function splitFullId(fullId) {
	const index = fullId.indexOf('--');
	if (index < 1) throw new Error(`Not a story id: ${fullId}`);
	return { title: fullId.slice(0, index), story: fullId.slice(index + 2) };
}

export function pageClassName(title, exportName) {
	const pascal = (text) =>
		sanitize(text)
			.split('-')
			.filter(Boolean)
			.map((part) => part[0].toUpperCase() + part.slice(1))
			.join('');
	return `${pascal(title)}${pascal(startCase(exportName))}TestPage`;
}
