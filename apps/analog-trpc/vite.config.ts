/// <reference types="vitest" />

import analog from '@analogjs/platform';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig, Plugin, splitVendorChunkPlugin } from 'vite';
import tsConfigPaths from 'vite-tsconfig-paths';

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
      analog({
        ssrBuildDir: '../../dist/apps/analog-trpc/ssr',
        entryServer: 'apps/analog-trpc/src/main.server.ts',
        vite: {
          inlineStylesExtension: 'css',
          tsconfig:
            mode === 'test'
              ? 'apps/analog-trpc/tsconfig.spec.json'
              : 'apps/analog-trpc/tsconfig.app.json'
        },
        nitro: {
          preset: 'vercel-edge',
          rootDir: 'apps/analog-trpc',
          output: {
            dir: '../../../dist/apps/analog-trpc/analog',
            publicDir: '../../../dist/apps/analog-trpc/analog/public'
          },
          publicAssets: [{ dir: `../../../dist/apps/analog-trpc/client` }],
          serverAssets: [
            { baseName: 'public', dir: `./dist/apps/analog-trpc/client` }
          ],
          buildDir: '../../dist/apps/analog-trpc/.nitro',
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
