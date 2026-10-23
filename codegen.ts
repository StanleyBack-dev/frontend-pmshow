import type { CodegenConfig } from "@graphql-codegen/cli";

// Two outputs from schema/schema.gql (npm run schema:sync):
// - server/graphql/generated: typed documents for every operation the BFF
//   sends (written with `graphql(...)` in src/server/graphql/operations);
// - shared/graphql/schema-enums.ts: only the schema's enums as string unions,
//   so UI code can use Permission/UserGroup without touching the server layer.
const config: CodegenConfig = {
  schema: "schema/schema.gql",
  documents: ["src/server/graphql/**/*.ts", "!src/server/graphql/generated/**"],
  ignoreNoDocuments: true,
  generates: {
    "src/server/graphql/generated/": {
      preset: "client",
      presetConfig: { fragmentMasking: false },
      config: {
        // Plain strings: the BFF posts them with fetch, no GraphQL runtime.
        documentMode: "string",
        enumsAsTypes: true,
        useTypeImports: true,
        scalars: { DateTime: "string", JSON: "Record<string, unknown>" },
      },
    },
    "src/shared/graphql/schema-enums.ts": {
      plugins: ["typescript"],
      config: { onlyEnums: true, enumsAsTypes: true },
    },
  },
};

export default config;
