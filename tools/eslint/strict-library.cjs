const path = require('node:path');

module.exports = [
	{
		files: ['**/*.ts'],
		ignores: [
			'**/*.spec.ts',
			'**/*.test.ts',
			'**/__tests__/**',
			'**/test-setup.ts',
			'**/src/testing/**',
			'**/*.stories.ts',
		],
		languageOptions: {
			parserOptions: {
				projectService: true,
				tsconfigRootDir: path.resolve(__dirname, '../..'),
			},
		},
		rules: {
			'@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
			'@typescript-eslint/no-unnecessary-type-arguments': 'error',
			'@typescript-eslint/no-unnecessary-type-assertion': 'error',
			'@typescript-eslint/no-confusing-void-expression': 'error',
			'@typescript-eslint/prefer-optional-chain': 'error',
			'@typescript-eslint/no-extraneous-class': ['error', { allowWithDecorator: true }],
			'@angular-eslint/use-injectable-provided-in': 'off',
			'@angular-eslint/prefer-signal-model': 'off',
		},
	},
];
