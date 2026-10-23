// Copies the backend's generated schema (backend-pmshow/src/graphql/schema.gql)
// into this repo, so codegen and CI work without the backend checked out.
// Run after `npm run schema:generate` in the backend, then `npm run codegen`.
import { copyFileSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const source = resolve(
  process.env.BACKEND_DIR ?? resolve(root, "../backend-pmshow"),
  "src/graphql/schema.gql",
);
const target = resolve(root, "schema/schema.gql");

if (!existsSync(source)) {
  console.error(`Backend schema not found at ${source}.`);
  console.error(
    "Set BACKEND_DIR or run `npm run schema:generate` in the backend.",
  );
  process.exit(1);
}
copyFileSync(source, target);
console.log(`schema.gql synced from ${source}`);
