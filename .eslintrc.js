
module.exports = {
    root: true,
    parserOptions: {
      parser: "babel-eslint"
    },
    env: {
      browser: true
    },
    extends: [
      "plugin:vue/essential",
    ],
    plugins: ["vue"],
    rules: {
      "space-before-function-paren": 0,
      "generator-star-spacing": "off",
      "comma-dangle": "off",
      "camelcase": "off",
      indent: [2, 'tab'],
      'key-spacing': ['warn', { 'beforeColon': false, 'afterColon': true }],
      "no-tabs":"off",
      'no-unused-vars': 'error',
      "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    'no-multi-spaces': 1, // 不能用多余的空格
    'no-undef': ['error'],
    'prefer-const': 'error',
      quotes: [2, 'single'],
      semi: [2, 'always'],
      'vue/html-indent': ['error', 'tab', {
        'attribute': 1,
        'baseIndent': 1,
        'closeBracket': 0,
        'alignAttributesVertically': true,
        'ignores': []
    }],
    }
  };
  