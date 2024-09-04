import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsdoc from "eslint-plugin-tsdoc";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [{
    ignores: ["**/node_modules", "**/out", "**/*.json"],
}, ...compat.extends("eslint:recommended", "plugin:@typescript-eslint/recommended"), {
    plugins: {
        "@typescript-eslint": typescriptEslint,
        tsdoc,
    },

    languageOptions: {
        globals: {
            ...globals.node,
            ...globals.mocha,
        },

        parser: tsParser,
        ecmaVersion: 12,
        sourceType: "module",
    },

    rules: {},
}];