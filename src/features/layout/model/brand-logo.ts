import "server-only";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { BRAND_MARK } from "@/features/layout/model/brand-mark";

let cached: Promise<string> | null = null;

/** The logo as a data: URL, for <img> inside ImageResponse renders. */
export function brandLogoSrc(): Promise<string> {
  cached ??= readFile(join(process.cwd(), BRAND_MARK.file), "base64").then(
    (data) => `data:image/png;base64,${data}`,
  );
  return cached;
}
