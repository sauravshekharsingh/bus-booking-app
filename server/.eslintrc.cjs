const path = require("path");
const pkg = require("./package.json");

// eslint-disable-next-line no-underscore-dangle
const aliases = Object.entries(pkg._moduleAliases).map((e) => [
  e[0],
  path.resolve(__dirname, e[1]),
]);

module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    mocha: true,
  },
  extends: ["airbnb-base"],
  ignorePatterns: ["node_modules"],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    "max-len": ["error", { code: 140 }],
    "max-lines-per-function": ["error", { max: 100 }],
  },
  settings: {
    "import/resolver": {
      alias: {
        map: aliases,
        extensions: [".js", "json"],
      },
    },
  },
};
