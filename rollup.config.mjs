import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';

export default {
  input: 'client/index.js',
  output: {
    file: 'public/bundle.js',
    format: 'es'
  },
  plugins: [
    nodeResolve({
      browser: true,
    }),
    commonjs({
      include: [/node_modules/],
    }),
    babel({ babelHelpers: 'inline' }),
    replace({
      preventAssignment: true,
      'process.env.NODE_ENV': '"development"',
    }),
  ],
};
