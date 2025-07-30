import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

const production = !process.env.ROLLUP_WATCH;

export default [
  // ES Module build with React support
  {
    input: 'src/index.ts',
    external: ['react', 'react-dom', 'next/navigation'],
    output: {
      file: 'dist/index.esm.js',
      format: 'es',
      sourcemap: true
    },
    plugins: [
      nodeResolve(),
      typescript({
        declaration: true,
        declarationDir: 'dist',
        rootDir: 'src'
      }),
      production && terser()
    ]
  },
  // CommonJS build with React support
  {
    input: 'src/index.ts',
    external: ['react', 'react-dom', 'next/navigation'],
    output: {
      file: 'dist/index.js',
      format: 'cjs',
      sourcemap: true,
      exports: 'named'
    },
    plugins: [
      nodeResolve(),
      typescript(),
      production && terser()
    ]
  },
  // UMD build for CDN (vanilla JS only - no React)
  {
    input: 'src/tracker.ts',
    output: {
      file: 'dist/clickchutney.min.js',
      format: 'umd',
      name: 'ClickChutney',
      sourcemap: true
    },
    plugins: [
      nodeResolve(),
      typescript(),
      terser()
    ]
  }
];