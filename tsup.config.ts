import { defineConfig } from 'tsup'
import { resolve } from 'node:path'

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/axios.ts',
    'src/supabase.ts',
    'src/zod.ts',
  ],
  format: ['esm', 'cjs'],
  target: 'es2023',
  dts: true,
  sourcemap: true,
  clean: true,
  splitting: false,
  outExtension({ format }) {
    return { js: format === 'cjs' ? '.cjs' : '.js' }
  },
  esbuildOptions(options) {
    options.alias = {
      ...options.alias,
      '@xeno-js/shared': resolve('src'),
    }
  },
  external: [
    '@supabase/supabase-js',
    'axios',
    'zod',
  ],
})