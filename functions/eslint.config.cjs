const js = require("@eslint/js");
const globals = require("globals");

module.exports = [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2023,
      globals: {...globals.node},
    },
    rules: {
      "no-restricted-globals": ["error", "name", "length"],
      "prefer-arrow-callback": "error",
      "quotes": ["error", "double", {"allowTemplateLiterals": true}],
      "max-len": "off",
    },
  },
  {
    files: ["**/*.spec.*"],
    languageOptions: {
      globals: {...globals.mocha},
    },
  },
];
