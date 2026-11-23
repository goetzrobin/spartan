const path = require('node:path');
const tseslint = require('typescript-eslint');

const root = path.resolve(__dirname, '../..');

module.exports = [
	{
		ignores: [
			'**/dist/**',
			'**/node_modules/**',
			'**/*.spec.ts',
			'**/*.test.ts',
			'**/__tests__/**',
			'**/test-setup.ts',
			'**/src/testing/**',
			'**/*.stories.ts',
		],
	},
	{
		files: ['libs/brain/**/*.ts', 'libs/helm/**/*.ts'],
		languageOptions: {
			parser: tseslint.parser,
			parserOptions: {
				projectService: true,
				tsconfigRootDir: root,
			},
		},
		plugins: {
			'@typescript-eslint': tseslint.plugin,
		},
		linterOptions: {
			reportUnusedDisableDirectives: 'off',
		},
		rules: {
			'@typescript-eslint/no-unsafe-member-access': 'error',
			'@typescript-eslint/no-unsafe-argument': 'error',
			'@typescript-eslint/no-unsafe-assignment': 'error',
			'@typescript-eslint/no-unsafe-call': 'error',
			'@typescript-eslint/no-unsafe-return': 'error',
			'@typescript-eslint/no-explicit-any': 'error',
			'@typescript-eslint/no-unnecessary-condition': 'error',
			'@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }],
		},
	},
];
