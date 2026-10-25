export type RawSearchParams = Record<string, string | string[] | undefined>;

export function firstParam(
  params: RawSearchParams,
  key: string,
): string | undefined {
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
}

export function pageParam(params: RawSearchParams): number {
  const page = Number(firstParam(params, "page"));
  return Number.isInteger(page) && page > 0 ? page : 1;
}

/** "Itens por página" of paginated lists (amoremio pattern). */
export const PAGE_SIZES = [10, 20, 50, 100] as const;
export const DEFAULT_PAGE_SIZE = 10;

/** `?por-pagina=` as one of PAGE_SIZES (10 by default). */
export function pageSizeParam(params: RawSearchParams): number {
  const size = Number(firstParam(params, "por-pagina"));
  return (PAGE_SIZES as readonly number[]).includes(size)
    ? size
    : DEFAULT_PAGE_SIZE;
}

/** The page size in links: omitted when it is the default. */
export const pageSizeQuery = (size: number) =>
  size === DEFAULT_PAGE_SIZE ? undefined : size;

export function oneOf<T extends string>(
  value: string | undefined,
  allowed: readonly T[],
): T | undefined {
  return allowed.includes(value as T) ? (value as T) : undefined;
}

/** Builds `path?query` dropping empty values. */
export function buildHref(
  path: string,
  query: Record<string, string | number | undefined>,
): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (
      value !== undefined &&
      value !== "" &&
      !(key === "page" && value === 1)
    ) {
      search.set(key, String(value));
    }
  }
  const qs = search.toString();
  return qs ? `${path}?${qs}` : path;
}
