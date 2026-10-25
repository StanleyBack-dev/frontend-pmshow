import { graphql } from "@/server/graphql/generated";

export const songFieldsFragment = graphql(`
  fragment SongFields on Song {
    id
    title
    artistId
    artist {
      id
      name
    }
    stage
    arranger
    category
    musicalKey
    bpm
    durationSeconds
    lyrics
    notes
    tags
    archivedAt
    createdAt
    updatedAt
  }
`);

export const mediaAssetFieldsFragment = graphql(`
  fragment MediaAssetFields on MediaAsset {
    id
    songId
    kind
    status
    title
    mimeType
    sizeBytes
    durationSeconds
    youtubeVideoId
    thumbnailUrl
    createdAt
  }
`);

export const songsDocument = graphql(`
  query Songs($filter: SongFilterInput, $page: PageInput, $archived: Boolean!) {
    songs(filter: $filter, page: $page) {
      total
      page
      limit
      totalPages
      items {
        ...SongFields
        media {
          id
          kind
          title
          youtubeVideoId
        }
      }
    }
    songTags
    songTitles(archived: $archived)
    artists(includeArchived: false) {
      id
      name
      archived
    }
  }
`);

export const songDocument = graphql(`
  query Song($id: ID!) {
    song(id: $id) {
      ...SongFields
      media {
        ...MediaAssetFields
      }
    }
  }
`);

export const createSongDocument = graphql(`
  mutation CreateSong($input: SongInput!) {
    createSong(input: $input) {
      ...SongFields
    }
  }
`);

export const updateSongDocument = graphql(`
  mutation UpdateSong($id: ID!, $input: SongInput!) {
    updateSong(id: $id, input: $input) {
      ...SongFields
    }
  }
`);

export const setSongArchivedDocument = graphql(`
  mutation SetSongArchived($id: ID!, $archived: Boolean!) {
    setSongArchived(id: $id, archived: $archived) {
      ...SongFields
    }
  }
`);

export const addYoutubeVideoDocument = graphql(`
  mutation AddYoutubeVideo($input: AddYoutubeVideoInput!) {
    addYoutubeVideo(input: $input) {
      ...MediaAssetFields
    }
  }
`);

export const requestAudioUploadDocument = graphql(`
  mutation RequestAudioUpload($input: RequestAudioUploadInput!) {
    requestAudioUpload(input: $input) {
      asset {
        ...MediaAssetFields
      }
      upload {
        url
        fields
        expiresAt
      }
    }
  }
`);

export const confirmAudioUploadDocument = graphql(`
  mutation ConfirmAudioUpload($input: ConfirmAudioUploadInput!) {
    confirmAudioUpload(input: $input) {
      ...MediaAssetFields
    }
  }
`);

export const renameMediaDocument = graphql(`
  mutation RenameMedia($id: ID!, $title: String!) {
    renameMedia(id: $id, title: $title) {
      ...MediaAssetFields
    }
  }
`);

export const removeMediaDocument = graphql(`
  mutation RemoveMedia($id: ID!) {
    removeMedia(id: $id)
  }
`);

export const audioPlaybackUrlDocument = graphql(`
  query AudioPlaybackUrl($assetId: ID!) {
    audioPlaybackUrl(assetId: $assetId)
  }
`);

export const audioDownloadUrlDocument = graphql(`
  query AudioDownloadUrl($assetId: ID!) {
    audioDownloadUrl(assetId: $assetId)
  }
`);

export const findLyricsDocument = graphql(`
  query FindLyrics($artist: String!, $title: String!) {
    findLyrics(artist: $artist, title: $title) {
      artist
      title
      lyrics
      sourceUrl
    }
  }
`);

export const searchYoutubeDocument = graphql(`
  query SearchYoutube($query: String!) {
    searchYoutube(query: $query) {
      videoId
      title
      channelTitle
      thumbnailUrl
      publishedAt
      durationSeconds
    }
  }
`);
