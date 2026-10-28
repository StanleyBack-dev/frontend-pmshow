import { graphql } from "@/server/graphql/generated";

export const playlistFieldsFragment = graphql(`
  fragment PlaylistFields on Playlist {
    id
    name
    description
    shared
    ownerId
    ownerName
    songCount
    updatedAt
  }
`);

export const playlistsDocument = graphql(`
  query Playlists {
    playlists {
      ...PlaylistFields
    }
  }
`);

export const playlistDocument = graphql(`
  query Playlist($id: ID!) {
    playlist(id: $id) {
      ...PlaylistFields
      songs {
        position
        songId
        song {
          id
          title
          musicalKey
          durationSeconds
          lyrics
          archivedAt
          media {
            id
            kind
            title
            youtubeVideoId
          }
        }
      }
    }
  }
`);

export const createPlaylistDocument = graphql(`
  mutation CreatePlaylist($input: PlaylistInput!) {
    createPlaylist(input: $input) {
      ...PlaylistFields
    }
  }
`);

export const updatePlaylistDocument = graphql(`
  mutation UpdatePlaylist($id: ID!, $input: PlaylistInput!) {
    updatePlaylist(id: $id, input: $input) {
      ...PlaylistFields
    }
  }
`);

export const deletePlaylistDocument = graphql(`
  mutation DeletePlaylist($id: ID!) {
    deletePlaylist(id: $id)
  }
`);
