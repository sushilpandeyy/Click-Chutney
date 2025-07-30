import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

const production = !process.env.ROLLUP_WATCH;

export default [
  // ES Module build
  {
    input: 'src/index.tsx',
    external: ['react', 'react-dom', 'next/navigation', '@click-chutney/analytics'],
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
  // CommonJS build
  {
    input: 'src/index.tsx',
    external: ['react', 'react-dom', 'next/navigation', '@click-chutney/analytics'],
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
  }
];