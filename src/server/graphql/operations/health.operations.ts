import { graphql } from "@/server/graphql/generated";

export const pingDocument = graphql(`
  query Ping {
    ping
  }
`);
