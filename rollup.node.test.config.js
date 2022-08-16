import merge from "webpack-merge"
import commonMod from "./rollup.node.common.config"


export default merge(commonMod, {
  input: 'test/src/test.ts',
  output: {
    file: 'test/dist/test.js',
    format: 'cjs',
  },
})
