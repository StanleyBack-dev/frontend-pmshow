import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  // Layers: client components and the design system never import the BFF
  // (server-only code that holds secrets).
  {
    files: [
      "src/design-system/**/*.{ts,tsx}",
      "src/features/**/components/**/*.{ts,tsx}",
    ],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/server/*", "@/server/**"],
              message: "Components must not import the server (BFF) layer.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["src/design-system/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/features/*", "@/features/**", "@/server/**"],
              message: "The design system is domain-agnostic.",
            },
          ],
        },
      ],
    },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "src/server/graphql/generated/**",
    "src/shared/graphql/schema-enums.ts",
  ]),
]);
