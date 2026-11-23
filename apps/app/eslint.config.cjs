const nx = require('@nx/eslint-plugin');
const baseConfig = require('../../eslint.config.cjs');

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
					prefix: 'spartan',
					style: 'camelCase',
				},
			],
			'@angular-eslint/component-selector': [
				'error',
				{
					type: 'element',
					prefix: 'spartan',
					style: 'kebab-case',
				},
			],
			'@nx/enforce-module-boundaries': 'off',
			'@angular-eslint/prefer-on-push-component-change-detection': 'off',
			'@angular-eslint/directive-class-suffix': 'off',
			'@angular-eslint/component-class-suffix': 'off',
		},
	},
	{
		// Test pages are generated from the Storybook stories (tools/verify/story-to-test-pages.mjs)
		// and keep the stories' code as it is: their selectors, their member names (which have to
		// match the inputs they bind to) and their loosely typed args. Stories were never linted, so
		// the naming and ordering rules of the docs app do not apply here. Template rules still do.
		files: ['**/src/test-pages/**/*.ts'],
		rules: {
			'@angular-eslint/component-selector': 'off',
			'@typescript-eslint/consistent-type-imports': 'off',
			'@typescript-eslint/explicit-member-accessibility': 'off',
			'@typescript-eslint/naming-convention': 'off',
			'@typescript-eslint/no-explicit-any': 'off',
			'@nx/workspace-component-directive-key-order': 'off',
		},
	},
	{
		files: ['**/*.html'],
		// Override or add rules here
		rules: {
			// We should probably turn this on, but for now it's off
			'@angular-eslint/template/elements-content': 'off',
			'@angular-eslint/template/label-has-associated-control': 'off',
			'@angular-eslint/template/interactive-supports-focus': 'off',
			'@angular-eslint/template/click-events-have-key-events': 'off',
		},
	},
	{
		files: ['**/*.json'],
		// Override or add rules here
		rules: {
			'@nx/dependency-checks': 'off',
		},
	},
];
