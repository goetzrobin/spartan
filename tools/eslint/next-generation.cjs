const retired = 'is a 1.x foundation that 2.0 retires. Build on the brain building blocks instead.';

module.exports = [
	{
		files: ['*-next/**/*.ts'],
		rules: {
			'no-restricted-imports': [
				'error',
				{
					paths: [
						{ name: '@angular/cdk', message: `The Angular CDK ${retired}` },
						{ name: '@spartan-ng/brain/overlay', message: `BrnOverlay ${retired}` },
					],
					patterns: [{ group: ['@angular/cdk/*'], message: `The Angular CDK ${retired}` }],
				},
			],
			'no-restricted-syntax': [
				'error',
				{
					selector: 'ClassDeclaration[superClass], ClassExpression[superClass]',
					message: 'Compose small building blocks instead of extending a base class.',
				},
				{
					selector: "CallExpression[callee.name='effect']",
					message: 'Return commands from the state model and run them; effect() hides when state changes.',
				},
				{
					selector: "CallExpression[callee.name='model']",
					message: 'Use an input, an output and a default input instead of model().',
				},
			],
		},
	},
];
