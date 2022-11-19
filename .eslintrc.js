module.exports = {
  parser: "@typescript-eslint/parser",
  env: {
    browser: true,
  },
  extends: [
    'eslint:recommended', // eslint basic
    'plugin:@typescript-eslint/recommended', // @typescript-eslint/eslint-plugin
    'prettier/@typescript-eslint',  // eslint의 typescript formatting 기능 제거 (eslint-config-prettier)          
    'plugin:prettier/recommended',  // eslint-plugin-prettier, eslint-config-prettier
    'plugin:vue/essential' 
  ],
  rules: {
    'max-len': [
      'warn',
      {
        code: 150,
        tabWidth: 2,
        comments: 150,
        ignoreComments: false,
        ignoreTrailingComments: true,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreRegExpLiterals: true,
      },
    ],
  },
};