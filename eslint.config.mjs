import js from "@eslint/js";
import nextPlugin from "@next/eslint-plugin-next";
import reactPlugin from "eslint-plugin-react";
import jsxA11yPlugin from "eslint-plugin-jsx-a11y";
import reactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import globals from "globals";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  js.configs.recommended,
  jsxA11yPlugin.flatConfigs.strict,
  // https://typescript-eslint.io/getting-started/typed-linting/
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
        ...globals.jest,
      },
    },

    files: ["**/*.{js,jsx,ts,tsx}"],

    settings: {
      react: {
        version: "detect",
      },
      "import/resolver": {
        node: {
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
      },
    },

    plugins: {
      "@next/next": nextPlugin,
      react: reactPlugin,
      "react-hooks": reactHooks,
    },

    rules: {
      // NOTE: 0 is "off", 1 is "warn", 2 is "error"
      "import/extensions": "off",
      "global-require": "off",
      "react/jsx-filename-extension": [
        "warn",
        { extensions: [".js", ".jsx", ".ts", ".tsx"] },
      ],
      "react/jsx-props-no-spreading": "off",
      // NOTE: turn the following errors into warn for now so we don't block anything, need to turn this back on
      "@typescript-eslint/no-unsafe-assignment": "warn",
      "@typescript-eslint/no-unsafe-return": "warn",
      "@typescript-eslint/no-unsafe-argument": "warn",
      "no-useless-escape": "warn",
      "@typescript-eslint/no-redundant-type-constituents": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/restrict-template-expressions": "warn",

      camelcase: "warn",
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "no-unsafe-call": "off",
      "no-unsafe-member-access": "off",
      "@typescript-eslint/no-floating-promises": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
      "react/prop-types": "off",
      "react/display-name": "off",
      "@typescript-eslint/no-use-before-define": "off",
      "react/react-in-jsx-scope": "off", // Not needed with modern Next.js/React
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-require-imports": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "@typescript-eslint/no-misused-promises": [
        "error",
        {
          checksVoidReturn: {
            attributes: false,
          },
        },
      ],

      // NOTE: These are nice to have
      "@typescript-eslint/require-await": "off",
      "@typescript-eslint/only-throw-error": "off",
    },
  },
  globalIgnores([
    "**.config.*",
    ".next/**",
    ".vercel/**",
    ".vscode/**",
    "node_modules/**",
    "__tests__/**",
    "playwright-report/**",
    "public/**",
    "https-server.js",
    "next-env.d.ts",
    "newrelic.js",
  ]),
  // Prettier config must be last to override other formatting rules
  eslintPluginPrettierRecommended,
]);
