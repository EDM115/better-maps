/* eslint-disable import-x/no-named-as-default-member */
// eslint-disable no-explicit-any
import withNuxt from "./.nuxt/eslint.config.mjs"

import js from "@eslint/js"
import stylistic from "@stylistic/eslint-plugin"
import tsParser from "@typescript-eslint/parser"
import eslintPluginImportX from "eslint-plugin-import-x"
import oxlint from "eslint-plugin-oxlint"
import pluginVue from "eslint-plugin-vue"
import globals from "globals"
import tseslint from "typescript-eslint"

import { createTypeScriptImportResolver } from "eslint-import-resolver-typescript"

export default withNuxt(
  {
    ignores: [ "**/.nuxt/", "**/.output", "**/dist/", "**/node_modules/" ],
  },
  js.configs.all,
  ...tseslint.configs.recommended as any,
  eslintPluginImportX.flatConfigs.recommended as any,
  eslintPluginImportX.flatConfigs.typescript as any,
  ...pluginVue.configs["flat/recommended"],
  {
    files: [ "**/*.{js,ts,vue}" ],
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
        google: "readonly",
      },
      parserOptions: {
        ecmaVersion: "latest",
        extraFileExtensions: [ ".vue" ],
        parser: tsParser,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      "@stylistic": stylistic,
    },
    settings: {
      "import-x/parsers": {
        "@typescript-eslint/parser": [ ".ts" ],
        "vue-eslint-parser": [ ".vue" ],
      },
      "import-x/resolver-next": [
        createTypeScriptImportResolver({
          alwaysTryTypes: false,
          project: "tsconfig.json",
        }),
      ],
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          ignoreRestSiblings: true,
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@stylistic/array-bracket-newline": [ "warn", { multiline: true }],
      "@stylistic/array-bracket-spacing": [ "warn", "always", { objectsInArrays: false, arraysInArrays: false }],
      "@stylistic/array-element-newline": [ "warn", "consistent" ],
      "@stylistic/arrow-parens": [ "warn", "always" ],
      "@stylistic/arrow-spacing": [ "warn", { before: true, after: true }],
      "@stylistic/block-spacing": [ "warn", "always" ],
      "@stylistic/brace-style": [ "warn", "1tbs", { allowSingleLine: true }],
      "@stylistic/comma-dangle": [ "warn", "always-multiline" ],
      "@stylistic/comma-spacing": [ "warn", { before: false, after: true }],
      "@stylistic/comma-style": [ "warn", "last" ],
      "@stylistic/computed-property-spacing": [ "warn", "never" ],
      "@stylistic/curly-newline": [ "warn", { minElements: 1 }],
      "@stylistic/dot-location": [ "warn", "property" ],
      "@stylistic/eol-last": [ "warn", "always" ],
      "@stylistic/function-call-argument-newline": [ "warn", "consistent" ],
      "@stylistic/function-call-spacing": [ "warn", "never" ],
      "@stylistic/function-paren-newline": [ "warn", "multiline" ],
      "@stylistic/generator-star-spacing": [ "warn", { before: true, after: false }],
      "@stylistic/implicit-arrow-linebreak": [ "warn", "beside" ],
      "@stylistic/indent": [ "warn", 2, { SwitchCase: 1, VariableDeclarator: "first", outerIIFEBody: 1, MemberExpression: 1, FunctionDeclaration: { parameters: "first", body: 1 }, FunctionExpression: { parameters: "first", body: 1 }, StaticBlock: { body: 1 }, CallExpression: { arguments: "first" }, ArrayExpression: "first", ObjectExpression: "first", ImportDeclaration: "first", flatTernaryExpressions: false, offsetTernaryExpressions: true, ignoreComments: true }],
      "@stylistic/indent-binary-ops": [ "warn", 2 ],
      "@stylistic/key-spacing": [ "warn", { beforeColon: false, afterColon: true, mode: "strict" }],
      "@stylistic/keyword-spacing": [ "warn", { before: true, after: true }],
      "@stylistic/linebreak-style": [ "warn", "unix" ],
      "@stylistic/line-comment-position": [ "warn", { position: "above" }],
      "@stylistic/lines-around-comment": [ "warn", { beforeBlockComment: true, afterBlockComment: false, beforeLineComment: false, afterLineComment: false, allowBlockStart: true, allowBlockEnd: false, allowObjectStart: true, allowObjectEnd: false, allowArrayStart: true, allowArrayEnd: false, allowClassStart: true, allowClassEnd: false }],
      "@stylistic/lines-between-class-members": [ "warn", "always", { exceptAfterSingleLine: true }],
      "@stylistic/multiline-comment-style": [ "off", "starred-block" ],
      "@stylistic/multiline-ternary": [ "warn", "always-multiline" ],
      "@stylistic/new-parens": [ "warn", "always" ],
      "@stylistic/newline-per-chained-call": [ "warn", { ignoreChainWithDepth: 3 }],
      "@stylistic/no-confusing-arrow": [ "warn", { allowParens: true }],
      "@stylistic/no-floating-decimal": "warn",
      "@stylistic/no-mixed-operators": "warn",
      "@stylistic/no-mixed-spaces-and-tabs": "warn",
      "@stylistic/no-multi-spaces": "warn",
      "@stylistic/no-multiple-empty-lines": [ "warn", { max: 2, maxEOF: 1, maxBOF: 0 }],
      "@stylistic/no-tabs": "warn",
      "@stylistic/no-trailing-spaces": "warn",
      "@stylistic/no-whitespace-before-property": "warn",
      "@stylistic/object-curly-spacing": [ "warn", "always" ],
      "@stylistic/operator-linebreak": [ "warn", "before" ],
      "@stylistic/padded-blocks": [ "warn", "never" ],
      "@stylistic/padding-line-between-statements": [
        "warn",
        { blankLine: "always", prev: "*", next: [ "throw", "return" ] },
        { blankLine: "always", prev: [ "const", "let", "var" ], next: "*" },
        { blankLine: "any", prev: [ "const", "let", "var" ], next: [ "const", "let", "var" ] },
        { blankLine: "always", prev: "*", next: [ "if", "for", "function", "class", "switch", "while", "with" ] },
      ],
      "@stylistic/quote-props": [ "warn", "consistent-as-needed" ],
      "@stylistic/quotes": [ "warn", "double" ],
      "@stylistic/rest-spread-spacing": [ "warn", "never" ],
      "@stylistic/semi": [ "warn", "never" ],
      "@stylistic/space-before-blocks": [ "warn", "always" ],
      "@stylistic/space-before-function-paren": [ "warn", { anonymous: "always", named: "never", asyncArrow: "always" }],
      "@stylistic/space-in-parens": [ "warn", "never" ],
      "@stylistic/space-infix-ops": "warn",
      "@stylistic/space-unary-ops": [ "warn", { words: true, nonwords: false }],
      "@stylistic/spaced-comment": [ "warn", "always" ],
      "@stylistic/switch-colon-spacing": [ "warn", { after: true, before: false }],
      "@stylistic/template-curly-spacing": [ "warn", "never" ],
      "@stylistic/template-tag-spacing": [ "warn", "never" ],
      "@stylistic/type-annotation-spacing": [ "warn", { before: false, after: true }],
      "@stylistic/type-generic-spacing": "warn",
      "@stylistic/wrap-iife": [ "warn", "outside" ],
      "@stylistic/wrap-regex": "warn",
      "@stylistic/yield-star-spacing": [ "warn", "before" ],
      "@typescript-eslint/no-explicit-any": "warn",
      "capitalized-comments": "off",
      "curly": [ "warn", "all" ],
      "id-length": "off",
      "import-x/no-named-as-default": "off",
      "import-x/no-unresolved": [ "warn", { ignore: [ "^~icons/" ] }],
      "max-statements": "off",
      "no-underscore-dangle": "off",
      "no-useless-assignment": "off",
      "nuxt/nuxt-config-keys-order": "warn",
      "one-var": "off",
      "prefer-named-capture-group": "off",
      "require-unicode-regexp": "off",
      "vue/multi-word-component-names": "off",
      "vue/no-mutating-props": "off",
    },
  },
  ...oxlint.configs["flat/all"],
)
