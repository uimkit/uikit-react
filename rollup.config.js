import { babel } from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import commonjs from '@rollup/plugin-commonjs';
import replace from 'rollup-plugin-re';
import dts from 'rollup-plugin-dts';
import { terser } from 'rollup-plugin-terser';
import postcss from 'rollup-plugin-postcss';
import autoprefixer from 'autoprefixer';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import url from '@rollup/plugin-url';

const baseConfig = {
  input: [
    './src/index.ts',
  ],
  output: [
    {
      exports: 'auto',
      preserveModules: true,
      preserveModulesRoot: './src',
      dir: './dist/esm/',
      format: 'esm',
      // sourcemap: true,
    },
    {
      exports: 'auto',
      preserveModules: true,
      preserveModulesRoot: './src',
      dir: './dist/cjs/',
      format: 'cjs',
      // sourcemap: true,
    },
  ],
};

export default [
  {
    ...baseConfig,
    plugins: [
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
        ]
      }),
      commonjs(),
      json(),
      url(),
      postcss({
        extract: true,
        minimize: true,
        plugins: [
          autoprefixer(),
        ],
      }),
      peerDepsExternal(),
      resolve({
        browser: true, // 指定打包浏览器端，否则 webpubsub 会引入 node 端的，进而引发在浏览器端找不到node端对应的库
      }),
      babel({
        extensions: ['.js', '.jsx', '.es6', '.es', '.mjs', 'ts', 'tsx'],
        // exclude: 'node_modules/**',
      }),
      typescript(),
      terser(),
    ],
    external: ['react', 'react-dom', 'date-fns', 'tslib', 'react-date-picker'],
  },
  {
    ...baseConfig,
    plugins: [
      postcss({
        extract: true,
        plugins: [],
      }),
      dts(),
    ],
  },
];