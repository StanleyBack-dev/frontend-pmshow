// Contract types shared by the BFF routes and the UI — types only, no runtime
// code. Backend response types come from GraphQL codegen
// (src/server/graphql/generated); this file holds what the BFF itself returns.

/** Error shape returned by every BFF route. */
export type ApiError = {
  code: string;
  message: string;
  details?: unknown;
};
