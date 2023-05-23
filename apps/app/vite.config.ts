/// <reference types="vitest" />

import analog from '@analogjs/platform';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig, Plugin, splitVendorChunkPlugin } from 'vite';
import tsConfigPaths from 'vite-tsconfig-paths';
import replace from '@rollup/plugin-replace';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    publicDir: 'src/public',
    optimizeDeps: {
      include: ['@angular/common', '@angular/forms', 'isomorphic-fetch']
    },
    ssr: {
      noExternal: ['@analogjs/trpc/**', '@ng-spartan/**', 'ng-signal-forms/**']
    },
    build: {
      target: ['es2020']
    },
    plugins: [
      replace({
        preventAssignment: true,
        'http://127.0.0.1:4200': 'https://spartan-goetzrobin.vercel.app'
      }),
      analog({
        ssrBuildDir: '../../dist/apps/app/ssr',
        entryServer: 'apps/app/src/main.server.ts',
        vite: {
          inlineStylesExtension: 'css',
          tsconfig: mode === 'test' ? 'apps/app/tsconfig.spec.json' : 'apps/app/tsconfig.app.json'
        },
        nitro: {
          preset: 'vercel',
          rootDir: 'apps/app',
          output: {
            dir: '../../../.vercel/output',
            publicDir: '../../../.vercel/output/static'
          },
          publicAssets: [{ dir: `../../../dist/apps/app/client` }],
          serverAssets: [{ baseName: 'public', dir: `./dist/apps/app/client` }],
          buildDir: '../../dist/apps/app/.nitro',
          prerender: {
            routes: ['/']
          }
        }
      }),
      tsConfigPaths({
        root: '../../'
      }),
      visualizer() as Plugin,
      splitVendorChunkPlugin()
    ],
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['src/test-setup.ts'],
      include: ['**/*.spec.ts'],
      cache: {
        dir: `../../node_modules/.vitest`
      }
    },
    define: {
      'import.meta.vitest': mode !== 'production'
    }
  };
});
