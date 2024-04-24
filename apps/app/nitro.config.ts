import { typescriptPaths } from 'rollup-plugin-typescript-paths';

export default defineNitroConfig({
	rollupConfig: {
		plugins: [typescriptPaths({ tsConfigPath: 'tsconfig.base.json', preserveExtensions: true })],
	},
	node: true,
});
