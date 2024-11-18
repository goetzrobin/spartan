export default {
	displayName: 'eslint-rules',
	preset: '../../jest.preset.cjs',
	transform: {
		'^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
	},
	moduleFileExtensions: ['ts', 'js', 'html'],
	coverageDirectory: '../../coverage/tools/eslint-rules',
};
