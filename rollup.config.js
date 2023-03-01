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
import image from '@rollup/plugin-image';
import dts from 'rollup-plugin-dts';
import pkg from './package.json';

process.env.NODE_ENV = 'production';



const input = './src/index.ts';

const baseConfig = {
  cache: false,
  // inlineDynamicImports: true,
  input,
  watch: {
    chokidar: false,
  },
};


const externalDependencies = [
  /@babel/,
  /dayjs/,
  /emoji-mart/,
  'react', 
  'date-fns', 
  'tslib',
  'i18next',
  'react-date-picker',
  'react-redux',
  'redux',
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
  image(),
  resolve({
    browser: useBrowserResolve,
  }),
  typescript(),
  babel({
    babelHelpers: 'runtime', // 动态引入，以减少转换后代码的体积，需要在运行时提供这些辅助函数
    // babelHelpers: 'bundled', // 将所有辅助函数打包到一个单独文件
    // babelHelpers: 'inline',
    exclude: 'node_modules/**',
    // extensions: ['.js', '.jsx', '.es6', '.es', '.mjs', 'ts', 'tsx'],
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
  // terser(),
  process.env.BUNDLE_SIZE ? visualizer() : null,
];

const output = [
  {
    exports: 'auto',
    preserveModules: true,
    preserveModulesRoot: './src',
    dir: './dist/cjs',
    // file: pkg.main,
    format: 'cjs',
    sourcemap: true,
  },
  {
    exports: 'auto',
    preserveModules: true,
    preserveModulesRoot: './src',
    dir: './dist/esm',
    // file: pkg.module,
    format: 'esm',
    sourcemap: true,
  },
];

const normalBundle = {
  ...baseConfig,
  external: externalDependencies,
  output,
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
    min ? terser() : null,
  ],
});

const dtsBundle = {
  input,
  output,
  plugins: [
    postcss({
      extract: true,
      plugins: [],
    }),
    json(),
    dts(),
  ]
};

export default () =>
  process.env.ROLLUP_WATCH
    ? [normalBundle]
    : [normalBundle, fullBrowserBundle({ min: true }), fullBrowserBundle(), dtsBundle];