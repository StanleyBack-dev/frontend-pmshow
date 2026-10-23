import type { CodegenConfig } from "@graphql-codegen/cli";

// Types for every GraphQL operation the BFF sends. Operations are written
// with `graphql(...)` inside src/server/graphql; the schema is the copy in
// schema/schema.gql (npm run schema:sync).
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
        scalars: { DateTime: "string" },
      },
    },
  },
};

export default config;
