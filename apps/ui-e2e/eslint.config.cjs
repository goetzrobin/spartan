const baseConfig = require('../../eslint.config.cjs');

module.exports = [
	...baseConfig,
	{
		files: ['**/*.ts'],
		rules: {
			// Playwright fixtures must destructure their first argument, as in `async ({}, use) => ...`.
			'no-empty-pattern': 'off',
		},
	},
];
