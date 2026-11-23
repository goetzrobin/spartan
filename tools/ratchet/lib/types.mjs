const ANSI = new RegExp(`${String.fromCharCode(27)}\\[[0-9;]*m`, 'g');
const ERROR = / error (TS|NG)/;

export function errorLines(output) {
	return output
		.replace(ANSI, '')
		.split(/\r?\n/)
		.filter((line) => ERROR.test(line));
}

export function countCompilerErrors(output, library) {
	return errorLines(output).filter((line) => {
		const file = line.split(/[(:]/, 1)[0];
		if (file.endsWith('test-setup.ts')) return false;
		return !(library === 'helm' && file.startsWith('../brain/'));
	}).length;
}
