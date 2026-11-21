const baseConfig = require('../../eslint.config.cjs');

module.exports = [
	...baseConfig,
	{
		files: ['**/*.ts'],
		rules: {
			// Playwright fixtures are declared as `async ({}, use) => ...`.
			'no-empty-pattern': 'off',
		},
	},
];
