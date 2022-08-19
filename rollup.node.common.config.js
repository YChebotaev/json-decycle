import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonJS from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'


export default {
  input: './repl/src/repl.ts',
  output: {
    file: 'repl/dist/jsonDecycle.js',
    format: 'cjs'
  },
  plugins: [
    typescript({tsconfig: "./tsconfig.dev.json", noEmitOnError: false, sourceMap: true}), 
    resolve({modulesOnly: true, preferBuiltins: true}),
    commonJS({
      include: 'node_modules/**'
    }),
    json()
  ]
};
