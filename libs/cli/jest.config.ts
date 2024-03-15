/* eslint-disable */
export default {
	displayName: 'cli',
	preset: '../../jest.preset.cjs',
	transform: {
		'^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
	},
	moduleFileExtensions: ['ts', 'js', 'html'],
	coverageDirectory: '../../coverage/libs/cli',
};
