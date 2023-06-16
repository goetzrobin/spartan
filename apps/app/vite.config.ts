/// <reference types="vitest" />

import analog from '@analogjs/platform';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig, Plugin, splitVendorChunkPlugin } from 'vite';
import tsConfigPaths from 'vite-tsconfig-paths';
import replace from '@rollup/plugin-replace';
import * as path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    publicDir: 'src/public',
    server: {
      host: '127.0.0.1'
    },
    optimizeDeps: {
      include: ['@angular/common', '@angular/forms', 'isomorphic-fetch']
    },
    ssr: {
      noExternal: ['@analogjs/trpc/**', '@ng-spartan/**', '@angular/cdk/**', 'ng-signal-forms/**']
    },
    build: {
      target: ['es2020']
    },
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './src')
      }
    },
    plugins: [
      replace({
        preventAssignment: true,
        'http://127.0.0.1:4200': 'https://spartan-goetzrobin.vercel.app',
        '__LASTMOD__': new Date().toISOString()
      }),
      analog({
        vite: {
          tsconfig: mode === 'test' ? 'apps/app/tsconfig.spec.json' : 'apps/app/tsconfig.app.json'
        },
        nitro: {
          preset: 'vercel',
          prerender: {routes: ['/','/typography']},
          output: {
            dir: '../../../../.vercel/output',
            publicDir: '../../../../.vercel/output/static'
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
