import { graphql } from "@/server/graphql/generated";

export const systemLogsDocument = graphql(`
  query SystemLogs($filter: SystemLogFilterInput, $page: PageInput) {
    systemLogs(filter: $filter, page: $page) {
      items {
        id
        level
        category
        source
        message
        details
        userId
        userName
        ip
        statusCode
        durationMs
        environment
        createdAt
      }
      total
      page
      limit
      totalPages
    }
  }
`);

export const systemLogSummaryDocument = graphql(`
  query SystemLogSummary {
    systemLogSummary {
      level
      last24h
      last7d
    }
  }
`);

export const reportClientErrorDocument = graphql(`
  mutation ReportClientError(
    $message: String!
    $url: String!
    $digest: String
  ) {
    reportClientError(message: $message, url: $url, digest: $digest)
  }
`);
