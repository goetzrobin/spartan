const baseConfig = require('../../eslint.config.cjs');

module.exports = [
	...baseConfig,
	{
		files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
		rules: {},
	},
	{
		files: ['**/*.ts', '**/*.tsx'],
		rules: {},
	},
	{
		files: ['**/*.js', '**/*.jsx'],
		rules: {},
	},
	{
		files: ['./package.json', './executors.json'],
		rules: {
			'@nx/nx-plugin-checks': 'error',
			'@nx/dependency-checks': [
				'error',
				{
					ignoredFiles: ['{projectRoot}/eslint.config.{js,cjs,mjs}'],
				},
			],
		},
		languageOptions: {
			parser: require('jsonc-eslint-parser'),
		},
	},
];
