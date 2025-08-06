import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import replace from '@rollup/plugin-replace';

const production = !process.env.ROLLUP_WATCH;

// Plugin to preserve "use client" directive
const preserveUseClient = () => ({
  name: 'preserve-use-client',
  renderChunk(code, chunk) {
    if (chunk.fileName.includes('react') && !code.startsWith('"use client"')) {
      return `"use client";\n${code}`;
    }
    return code;
  }
});

// Common plugins for all builds
const createPlugins = (options = {}) => [
  nodeResolve({
    browser: true,
    preferBuiltins: false
  }),
  commonjs(),
  replace({
    preventAssignment: true,
    'process.env.NODE_ENV': JSON.stringify(production ? 'production' : 'development')
  }),
  typescript({
    declaration: options.declaration || false,
    declarationDir: options.declaration ? 'dist' : undefined,
    rootDir: 'src',
    exclude: ['**/*.test.ts', '**/*.test.tsx']
  }),
  production && terser({
    compress: {
      drop_console: false, // Keep console logs for debugging
      drop_debugger: true
    }
  }),
  options.preserveUseClient && preserveUseClient()
].filter(Boolean);

export default [
  // Main library - ES Module
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.esm.js',
      format: 'es',
      sourcemap: true
    },
    plugins: createPlugins({ declaration: true })
  },

  // Main library - CommonJS
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.js',
      format: 'cjs',
      sourcemap: true,
      exports: 'auto'
    },
    plugins: createPlugins()
  },

  // React components - ES Module
  {
    input: 'src/react.tsx',
    external: ['react', 'react-dom'],
    output: {
      file: 'dist/react.esm.js',
      format: 'es',
      sourcemap: true,
      inlineDynamicImports: true
    },
    plugins: createPlugins({ declaration: true, preserveUseClient: true })
  },

  // React components - CommonJS
  {
    input: 'src/react.tsx',
    external: ['react', 'react-dom'],
    output: {
      file: 'dist/react.js',
      format: 'cjs',
      sourcemap: true,
      exports: 'auto',
      inlineDynamicImports: true
    },
    plugins: createPlugins({ preserveUseClient: true })
  },

  // Browser/CDN build (UMD)
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/clickchutney.min.js',
      format: 'iife',
      name: 'ClickChutney',
      sourcemap: true
    },
    plugins: createPlugins()
  }
];