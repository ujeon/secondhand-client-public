module.exports = {
  extends: ['airbnb', 'prettier', 'prettier/react'],
  parser: 'babel-eslint',
  env: {
    jest: true
  },
  rules: {
    'no-use-before-define': 'off',
    'react/jsx-filename-extension': 'off',
    'react/prop-types': 'off',
    'import/no-unresolved': 'off',
    'react/prefer-stateless-function': 'off',
    'react/jsx-boolean-value': 'off'
  }
};
