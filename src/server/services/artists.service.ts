import "server-only";
import { backendGraphql } from "@/server/graphql/client";
import {
  artistsDocument,
  artistsPageDocument,
  createArtistDocument,
  updateArtistDocument,
} from "@/server/graphql/operations/artists.operations";
import type { Paginated } from "@/shared/contracts/api";
import type { Artist, ArtistListItem } from "@/shared/contracts/repertoire";

export type ArtistPageQuery = {
  search?: string;
  archived: boolean;
  withSongs?: boolean;
  page: number;
  limit?: number;
};

export const artistsService = {
  async list(token: string, includeArchived = false): Promise<Artist[]> {
    const { artists } = await backendGraphql(artistsDocument, {
      token,
      variables: { includeArchived },
    });
    return artists;
  },

  async page(
    token: string,
    query: ArtistPageQuery,
  ): Promise<Paginated<ArtistListItem>> {
    const { artistsPage } = await backendGraphql(artistsPageDocument, {
      token,
      variables: {
        filter: {
          search: query.search || undefined,
          archived: query.archived,
          withSongs: query.withSongs,
        },
        page: { page: query.page, limit: query.limit ?? 10 },
      },
    });
    return artistsPage;
  },

  async create(token: string, name: string): Promise<Artist> {
    const { createArtist } = await backendGraphql(createArtistDocument, {
      token,
      variables: { input: { name } },
    });
    return createArtist;
  },

  async update(
    token: string,
    id: string,
    input: { name: string; archived?: boolean },
  ): Promise<Artist> {
    const { updateArtist } = await backendGraphql(updateArtistDocument, {
      token,
      variables: { id, input },
    });
    return updateArtist;
  },
};
