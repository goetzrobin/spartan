const nx = require('@nx/eslint-plugin');
const baseConfig = require('../../../../eslint.config.cjs');

module.exports = [
	...baseConfig,
	...nx.configs['flat/angular'],
	...nx.configs['flat/angular-template'],
	{
		files: ['**/*.ts'],
		rules: {
			'@angular-eslint/directive-selector': [
				'error',
				{
					type: 'attribute',
					prefix: 'brn',
					style: 'camelCase',
				},
			],
			'@angular-eslint/component-selector': [
				'error',
				{
					type: 'element',
					prefix: 'brn',
					style: 'kebab-case',
				},
			],
		},
	},
	{
		files: ['**/*.html'],
		// Override or add rules here
		rules: {
			// ideally these should be enabled
			'@angular-eslint/template/label-has-associated-control': 'off',
			'@angular-eslint/template/click-events-have-key-events': 'off',
			'@angular-eslint/template/interactive-supports-focus': 'off',
		},
	},
	{
		files: ['**/tests/**/*.ts'],
		rules: {
			'@angular-eslint/directive-selector': 'off',
			'@angular-eslint/component-selector': 'off',
		},
	},
];
