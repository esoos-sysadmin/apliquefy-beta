import { nextJsConfig } from "@repo/eslint-config/next-js";

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...nextJsConfig,
  {
    // next.config.js roda no Node, mas o preset compartilhado só declara os
    // globais de service worker — sem isto o `process.env` daqui vira no-undef.
    files: ["*.config.js"],
    languageOptions: { globals: { process: "readonly" } },
  },
];
