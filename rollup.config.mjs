import { babel } from '@rollup/plugin-babel';

const config = {
  input: 'public/index.js',
  output: {
    dir: 'client/bundle.js',
    format: 'es'
  },
  plugins: [babel({ babelHelpers: 'bundled' })]
};