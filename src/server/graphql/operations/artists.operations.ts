import { graphql } from "@/server/graphql/generated";

export const artistFieldsFragment = graphql(`
  fragment ArtistFields on Artist {
    id
    name
    archived
    createdAt
  }
`);

export const artistsDocument = graphql(`
  query Artists($includeArchived: Boolean!) {
    artists(includeArchived: $includeArchived) {
      ...ArtistFields
    }
  }
`);

export const artistsPageDocument = graphql(`
  query ArtistsPage($filter: ArtistFilterInput, $page: PageInput) {
    artistsPage(filter: $filter, page: $page) {
      total
      page
      limit
      totalPages
      items {
        id
        name
        archived
        createdAt
        songCount
      }
    }
  }
`);

export const createArtistDocument = graphql(`
  mutation CreateArtist($input: ArtistInput!) {
    createArtist(input: $input) {
      ...ArtistFields
    }
  }
`);

export const updateArtistDocument = graphql(`
  mutation UpdateArtist($id: ID!, $input: ArtistInput!) {
    updateArtist(id: $id, input: $input) {
      ...ArtistFields
    }
  }
`);
