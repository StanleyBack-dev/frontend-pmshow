import "server-only";
import { backendGraphql } from "@/server/graphql/client";
import {
  createPlaylistDocument,
  deletePlaylistDocument,
  playlistDocument,
  playlistsDocument,
  updatePlaylistDocument,
} from "@/server/graphql/operations/playlists.operations";
import type {
  Playlist,
  PlaylistInput,
  PlaylistWithSongs,
} from "@/shared/contracts/playlists";

export const playlistsService = {
  async list(token: string): Promise<Playlist[]> {
    const { playlists } = await backendGraphql(playlistsDocument, { token });
    return playlists;
  },

  async get(token: string, id: string): Promise<PlaylistWithSongs> {
    const { playlist } = await backendGraphql(playlistDocument, {
      token,
      variables: { id },
    });
    return playlist;
  },

  async create(token: string, input: PlaylistInput): Promise<Playlist> {
    const { createPlaylist } = await backendGraphql(createPlaylistDocument, {
      token,
      variables: { input },
    });
    return createPlaylist;
  },

  async update(
    token: string,
    id: string,
    input: PlaylistInput,
  ): Promise<Playlist> {
    const { updatePlaylist } = await backendGraphql(updatePlaylistDocument, {
      token,
      variables: { id, input },
    });
    return updatePlaylist;
  },

  async remove(token: string, id: string): Promise<void> {
    await backendGraphql(deletePlaylistDocument, {
      token,
      variables: { id },
    });
  },
};
