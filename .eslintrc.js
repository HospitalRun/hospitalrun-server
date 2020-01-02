module.exports = {
  extends: [
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: './',
    // TODO: we need this because of an issue with @typescript-eslint/parser: https://github.com/typescript-eslint/typescript-eslint/issues/864
    createDefaultProgram: true,
  },
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    'arrow-body-style': ['warn', 'as-needed'],
    'react/jsx-one-expression-per-line': 'off',
    'react/jsx-wrap-multilines': 'off',
    'no-param-reassign': ['error', { props: false }],
    'import/prefer-default-export': 'off',
    '@typescript-eslint/member-delimiter-style': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    curly: ['error', 'all'],
    'eol-last': ['error', 'always'],
    'no-debugger': 'error',
    '@typescript-eslint/unified-signatures': 'error',
    'import/no-unresolved': 'off',
    '@typescript-eslint/no-inferrable-types': ['error', { ignoreParameters: true }],
  },
}
