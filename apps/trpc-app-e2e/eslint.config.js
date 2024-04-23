const baseConfig = require('../../eslint.config.js');

module.exports = [
	...baseConfig,
	{
		files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
		rules: {},
	},
	{
		files: ['src/plugins/index.js'],
		rules: {
			'@typescript-eslint/no-var-requires': 'off',
			'no-undef': 'off',
		},
	},
];
