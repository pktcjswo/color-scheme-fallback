import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import pkg from './package.json'
import { terser } from "rollup-plugin-terser"

export default [
  {
    input: 'src/index.js',
    output: {
      name: 'color-scheme-fallback',
      file: pkg.browser,
      format: 'umd'
    },
    plugins: [
      resolve(),
      commonjs(),
      babel({
        exclude: ['node_modules/**']
      })
    ]
  },
  {
    input: 'src/index.js',
    external: ['ms'],
    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.main_cjs, format: 'cjs' },
      { file: pkg.module, format: 'es' }
    ],
    plugins: [
      babel({
        exclude: ['node_modules/**']
      }),
      terser({
        include: [/^.+\.min\.js$/, "*esm*"]
      })
    ]
  }
]
