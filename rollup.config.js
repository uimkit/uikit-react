import { babel } from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import commonjs from '@rollup/plugin-commonjs';
import replace from 'rollup-plugin-re';
import globals from 'rollup-plugin-node-globals';
// import { prepend } from 'rollup-plugin-insert';
import { terser } from 'rollup-plugin-terser';
import postcss from 'rollup-plugin-postcss';
import visualizer from 'rollup-plugin-visualizer';
import autoprefixer from 'autoprefixer';
import external from 'rollup-plugin-peer-deps-external';
import url from '@rollup/plugin-url';

import pkg from './package.json';

console.warn('rollup');

const baseConfig = {
  cache: false,
  inlineDynamicImports: true,
  input: 'src/index.ts',
  watch: {
    chokidar: false,
  },
};


const externalDependencies = [
  /@babel/,
  /dayjs/,
  // /emoji-mart/,
  'react', 
  'date-fns', 
  'tslib',
  'i18next',
  'react-date-picker'
];


const basePlugins = ({ useBrowserResolve = false }) => [
  // HACK: removes formidable's attempt to overwrite `require`
  replace({
    patterns: [
      // 这玩意是谁依赖的
      {
        // regexp match with resolved path
        match: /formidable(\/|\\)lib/,
        // string or regexp
        test: 'if (global.GENTLY) require = GENTLY.hijack(require);',
        // string or function to replaced with
        replace: '',
      },
    ],
    preventAssignment: true,
    'process.env.NODE_ENV': JSON.stringify('production'),
  }),
  // Remove peer-dependencies from final bundle
  external(),
  // image(),
  resolve({
    browser: useBrowserResolve,
  }),
  babel({
    babelHelpers: 'runtime',
    exclude: 'node_modules/**',
    extensions: ['.js', '.jsx', '.es6', '.es', '.mjs', 'ts', 'tsx'],
    env: {
      production: {
        presets: [
          [
            '@babel/env',
            {
              modules: false,
            },
          ],
        ],
      },
      test: {
        plugins: ['transform-es2015-modules-commonjs'],
        presets: [
          [
            '@babel/preset-env',
            {
              modules: 'commonjs',
            },
          ],
        ],
      },
    },
    ignore: ['src/@types/*'],
    plugins: [
      '@babel/plugin-proposal-class-properties',
      '@babel/plugin-transform-runtime',
      'babel-plugin-dynamic-import-node',
    ],
    presets: ['@babel/preset-typescript', '@babel/env', '@babel/preset-react'],

  }),
  commonjs(),
  // import files as data-uris or es modules
  url(),
  /*
  copy({
    targets: [
      { dest: 'dist/assets', src: './node_modules/@stream-io/stream-chat-css/dist/assets/*' },
      { dest: 'dist/css', src: './node_modules/@stream-io/stream-chat-css/dist/css/*' },
      { dest: 'dist/scss', src: './node_modules/@stream-io/stream-chat-css/dist/scss/*' },
      { dest: 'dist/css/v2', src: './node_modules/@stream-io/stream-chat-css/dist/v2/css/*' },
      { dest: 'dist/scss/v2', src: './node_modules/@stream-io/stream-chat-css/dist/v2/scss/*' },
    ],
    verbose: process.env.VERBOSE,
    watch: process.env.ROLLUP_WATCH,
  }),
  */
  postcss({
    extract: true,
    minimize: true,
    plugins: [
      autoprefixer(),
    ],
  }),
  // Json to ES modules conversion
  json({ compact: true }),
  typescript(),
  terser(),
  process.env.BUNDLE_SIZE ? visualizer() : null,
];

const normalBundle = {
  ...baseConfig,
  external: externalDependencies,
  output: [
    {
      exports: 'auto',
      // preserveModules: true,
      preserveModulesRoot: './src',
      file: './dist/cjs/index.js',
      // file: pkg.main,
      format: 'cjs',
      sourcemap: true,
    },
    {
      exports: 'auto',
      // preserveModules: true,
      preserveModulesRoot: './src',
      file: './dist/esm/index.js',
      format: 'esm',
      sourcemap: true,
    },
  ],
  plugins: [...basePlugins({ useBrowserResolve: false })],
};

const fullBrowserBundle = ({ min } = { min: false }) => ({
  ...baseConfig,
  output: [
    {
      file: min ? pkg.jsdelivr : pkg.jsdelivr.replace('.min', ''),
      format: 'iife',
      globals: {
        react: 'React',
        'react-dom': 'ReactDOM',
        'UIM': 'UIM',
      },
      name: 'UIMReact', // write all exported values to window under key UIMReact
      sourcemap: true,
    },
  ],
  plugins: [
    ...basePlugins({ useBrowserResolve: true }),
    /*{
      load: (id) => (id.match(/.s?css$/) ? '' : null),
      name: 'ignore-css-and-scss',
      resolveId: (importee) => (importee.match(/.s?css$/) ? importee : null),
    },*/
    // builtins(),
    globals({
      buffer: false,
      dirname: false,
      filename: false,
      globals: false,
      process: true,
    }),
    // To work with globals rollup expects them to be namespaced, which is not the case with UIM.
    // This injects some code to define UIM globals as expected by rollup.
    /* prepend(
      'window.UIKit.UIKit=UIKit;window.UIKit.logChatPromiseExecution=logChatPromiseExecution;window.UIM.Channel=Channel;window.ICAL=window.ICAL||{};',
    ),*/
    // min ? terser() : null,
  ],
});

export default () =>
  process.env.ROLLUP_WATCH
    ? [normalBundle]
    : [normalBundle, fullBrowserBundle({ min: true }), fullBrowserBundle()];