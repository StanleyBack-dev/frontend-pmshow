import { graphql } from "@/server/graphql/generated";

export const bandFunctionsDocument = graphql(`
  query BandFunctions($includeArchived: Boolean!) {
    bandFunctions(includeArchived: $includeArchived) {
      id
      name
      archived
    }
  }
`);

export const bandFunctionsPageDocument = graphql(`
  query BandFunctionsPage($filter: BandFunctionFilterInput, $page: PageInput) {
    bandFunctionsPage(filter: $filter, page: $page) {
      items {
        id
        name
        archived
        memberCount
      }
      total
      page
      limit
      totalPages
    }
  }
`);

export const createBandFunctionDocument = graphql(`
  mutation CreateBandFunction($input: CreateBandFunctionInput!) {
    createBandFunction(input: $input) {
      id
      name
      archived
    }
  }
`);

export const updateBandFunctionDocument = graphql(`
  mutation UpdateBandFunction($id: ID!, $input: UpdateBandFunctionInput!) {
    updateBandFunction(id: $id, input: $input) {
      id
      name
      archived
    }
  }
`);
