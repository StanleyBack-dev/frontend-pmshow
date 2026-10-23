import "server-only";
import { connection } from "next/server";

/**
 * The current time of the incoming request, for Server Components that
 * depend on "now" (today's agenda, upcoming events). connection() makes
 * sure it is never frozen into a prerendered page.
 */
export async function requestTime(): Promise<Date> {
  await connection();
  return new Date();
}
