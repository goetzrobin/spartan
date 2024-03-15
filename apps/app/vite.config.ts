/// <reference types="vitest" />

import analog from '@analogjs/platform';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import replace from '@rollup/plugin-replace';
import * as path from 'path';
import { typescriptPaths } from 'rollup-plugin-typescript-paths';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig, Plugin, splitVendorChunkPlugin } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	return {
		root: __dirname,
		publicDir: 'src/public',
		optimizeDeps: {
			include: ['@angular/common', '@angular/forms', 'isomorphic-fetch'],
		},
		ssr: {
			noExternal: ['@spartan-ng/**', '@angular/cdk/**', '@ng-icons/**', 'ngx-scrollbar/**', 'ng-signal-forms/**'],
		},
		build: {
			outDir: '../../dist/apps/app/client',
			reportCompressedSize: true,
			commonjsOptions: { transformMixedEsModules: true },
			target: ['es2020'],
		},
		resolve: {
			alias: {
				'~': path.resolve(__dirname, './src'),
			},
		},
		plugins: [
			replace({
				preventAssignment: true,
				'http://127.0.0.1:4200': 'https://www.spartan.ng',
				__LASTMOD__: new Date().toISOString(),
			}),
			analog({
				prerender: {
					routes: [
						'/',

						'/documentation/introduction',
						'/documentation/about',
						'/documentation/cli',

						'/components/accordion',
						'/components/alert',
						'/components/alert-dialog',
						'/components/aspect-ratio',
						'/components/avatar',
						'/components/badge',
						'/components/button',
						'/components/card',
						'/components/checkbox',
						'/components/collapsible',
						'/components/combobox',
						'/components/command',
						'/components/context-menu',
						'/components/data-table',
						'/components/dialog',
						'/components/dropdown-menu',
						'/components/hover-card',
						'/components/input',
						'/components/label',
						'/components/menubar',
						'/components/popover',
						'/components/progress',
						'/components/radio-group',
						'/components/scroll-area',
						'/components/separator',
						'/components/sheet',
						'/components/skeleton',
						'/components/switch',
						'/components/table',
						'/components/tabs',
						'/components/textarea',
						'/components/toggle',
						'/components/tooltip',

						'/stack/overview',
						'/stack/technologies',
						'/stack/installation',

						'/examples/notes',
						'/examples/typography',
					],
					sitemap: {
						host: 'https://www.spartan.ng',
					},
				},
				nitro: {
					rollupConfig: {
						plugins: [typescriptPaths({ tsConfigPath: 'tsconfig.base.json', preserveExtensions: true })],
					},
				},
			}),
			nxViteTsPaths(),
			visualizer() as Plugin,
			splitVendorChunkPlugin(),
		],
		test: {
			reporters: ['default'],
			coverage: {
				reportsDirectory: '../../coverage/apps/app',
				provider: 'v8',
			},
			globals: true,
			environment: 'jsdom',
			setupFiles: ['src/test-setup.ts'],
			include: ['**/*.spec.ts'],
			cache: {
				dir: `../../node_modules/.vitest`,
			},
		},
		define: {
			'import.meta.vitest': mode !== 'production',
		},
		server: {
			fs: {
				allow: ['../..'],
			},
		},
	};
});
