import "server-only";
import { backendGraphql } from "@/server/graphql/client";
import {
  bandFunctionsDocument,
  bandFunctionsPageDocument,
  createBandFunctionDocument,
  updateBandFunctionDocument,
} from "@/server/graphql/operations/band-functions.operations";
import type { Paginated } from "@/shared/contracts/api";
import type {
  BandFunction,
  BandFunctionListItem,
} from "@/shared/contracts/members";

// Functions in the band (regente, motorista…): Gestor and Administrador
// geral only.
export const bandFunctionsService = {
  async list(token: string, includeArchived = false): Promise<BandFunction[]> {
    const { bandFunctions } = await backendGraphql(bandFunctionsDocument, {
      token,
      variables: { includeArchived },
    });
    return bandFunctions;
  },

  async page(
    token: string,
    query: { search: string; archived: boolean; page: number; limit: number },
  ): Promise<Paginated<BandFunctionListItem>> {
    const { bandFunctionsPage } = await backendGraphql(
      bandFunctionsPageDocument,
      {
        token,
        variables: {
          filter: {
            search: query.search || undefined,
            archived: query.archived,
          },
          page: { page: query.page, limit: query.limit },
        },
      },
    );
    return bandFunctionsPage;
  },

  async create(token: string, input: { name: string }): Promise<BandFunction> {
    const { createBandFunction } = await backendGraphql(
      createBandFunctionDocument,
      { token, variables: { input } },
    );
    return createBandFunction;
  },

  async update(
    token: string,
    id: string,
    input: { name?: string; archived?: boolean },
  ): Promise<BandFunction> {
    const { updateBandFunction } = await backendGraphql(
      updateBandFunctionDocument,
      { token, variables: { id, input } },
    );
    return updateBandFunction;
  },
};
