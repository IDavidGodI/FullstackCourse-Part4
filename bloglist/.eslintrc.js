module.exports = {
  "env": {
    "commonjs": true,
    "node": true,
    "es2021": true,
    "jest": true
  },
  "extends": "eslint:recommended",
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "rules": {
    "no-unused-vars": "warn",
    "eqeqeq": "warn",
    "no-trailing-spaces": "warn",
    "object-curly-spacing": [
      "error", "always"
    ],
    "space-infix-ops": ["warn"],
    "arrow-spacing": [
      "error", { "before": true, "after": true }
    ],
    "indent": [
      "error",
      2
    ],
    "linebreak-style": [
      "error",
      "windows"
    ],
    "quotes": [
      "warn",
      "double"
    ]
  }
};
