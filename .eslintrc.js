module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: ['@nuxtjs', 'plugin:nuxt/recommended'],
  plugins: [],
  // add your custom rules here
  rules: {
    'vue/singleline-html-element-content-newline': 'off',
    'vue/multiline-html-element-content-newline': 'off',
    'space-before-function-paren': 0,
    'vue/html-self-closing': 0,
    'vue/no-unused-vars': 'off',
    'arrow-parens': 'off',
    'handle-callback-err': 'off',
    'no-console': 'off',
    indent: 'off'
  }
}
