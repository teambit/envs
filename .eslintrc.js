module.exports = {
    parser: "@typescript-eslint/parser", // Specifies the ESLint parser
    extends: [
      "plugin:@typescript-eslint/recommended",
      "prettier/@typescript-eslint", 
      "plugin:prettier/recommended" 
    ],
    parserOptions: {
      ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
      sourceType: "module" // Allows for the use of imports
    },
    rules: {
    }
  };