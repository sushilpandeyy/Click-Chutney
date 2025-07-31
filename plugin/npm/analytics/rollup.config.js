import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

const production = !process.env.ROLLUP_WATCH;

export default [
  // Main library - ES Module build
  {
    input: 'src/index.ts',
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
  // Main library - CommonJS build
  {
    input: 'src/index.ts',
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
  // React components - ES Module build
  {
    input: 'src/react.tsx',
    external: ['react', 'react-dom', 'next/navigation'],
    output: {
      file: 'dist/react.esm.js',
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
  // React components - CommonJS build
  {
    input: 'src/react.tsx',
    external: ['react', 'react-dom', 'next/navigation'],
    output: {
      file: 'dist/react.js',
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
    input: 'src/index.ts',
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