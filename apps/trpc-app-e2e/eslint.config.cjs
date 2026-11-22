const baseConfig = require('../../eslint.config.cjs');

module.exports = [
	...baseConfig,
	{
		files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
		rules: {
			'@angular-eslint/prefer-output-readonly': 'off',
			'@angular-eslint/prefer-on-push-component-change-detection': 'off',
		},
	},
];
