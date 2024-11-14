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
		files: ['**/*.json'],
		rules: {
			'@nx/nx-plugin-checks': 'error',
			'@nx/dependency-checks': [
				'error',
				{
					ignoredDependencies: ['@nx/js', '@nx/devkit', '@nx/angular', 'enquirer', 'semver'],
				},
			],
		},
		languageOptions: {
			parser: require('jsonc-eslint-parser'),
		},
	},
];