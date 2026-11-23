const path = require('node:path');
const unicorn = require('eslint-plugin-unicorn');

const classMemberOrder = {
	memberTypes: [['signature', 'field', 'accessor'], 'constructor', ['get', 'set', 'method']],
	order: 'as-written',
};

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
		plugins: { unicorn: unicorn.default ?? unicorn },
		rules: {
			'@typescript-eslint/no-unnecessary-type-arguments': 'error',
			'@typescript-eslint/no-unnecessary-type-assertion': 'error',
			'@typescript-eslint/no-confusing-void-expression': 'error',
			'@typescript-eslint/prefer-optional-chain': 'error',
			'@typescript-eslint/no-non-null-assertion': 'error',
			'@typescript-eslint/no-floating-promises': 'error',
			'@typescript-eslint/no-extraneous-class': ['error', { allowWithDecorator: true }],
			'@typescript-eslint/member-ordering': [
				'error',
				{
					default: 'never',
					classes: classMemberOrder,
					classExpressions: classMemberOrder,
					interfaces: 'never',
					typeLiterals: 'never',
				},
			],
			'unicorn/throw-new-error': 'error',
			'@angular-eslint/use-injectable-provided-in': 'off',
			'@angular-eslint/prefer-signal-model': 'off',
		},
	},
];
