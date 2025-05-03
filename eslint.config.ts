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
      reportUnusedDisableDirectives: false,
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
          alwaysTryTypes: true,
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
      "@typescript-eslint/no-explicit-any": "warn",
      "camelcase": "off",
      "capitalized-comments": "off",
      "curly": [ "warn", "all" ],
      "id-length": "off",
      "import-x/namespace": "off",
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
