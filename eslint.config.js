const {
  defineConfig,
  globalIgnores,
} = require('eslint/config');

const globals = require('globals');
const react = require('eslint-plugin-react');
const js = require('@eslint/js');

const {
  FlatCompat,
} = require('@eslint/eslintrc');

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

module.exports = defineConfig([{
  languageOptions: {
    globals: {
      ...globals.browser,
      ...globals.node,
    },

    ecmaVersion: 15,
    sourceType: 'module',

    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },

  extends: compat.extends('plugin:react/recommended', 'airbnb'),

  plugins: {
    react,
  },

  rules: {
    'import/no-extraneous-dependencies': 'off',
    'react/jsx-filename-extension': 'off',
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
  },
}, globalIgnores(['**/bundle.js', '**/node_modules/*.js', '**/*.test.js'])]);
