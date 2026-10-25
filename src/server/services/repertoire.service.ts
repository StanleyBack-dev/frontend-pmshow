import "server-only";
import { backendGraphql } from "@/server/graphql/client";
import {
  addYoutubeVideoDocument,
  audioDownloadUrlDocument,
  audioPlaybackUrlDocument,
  confirmAudioUploadDocument,
  createSongDocument,
  findLyricsDocument,
  removeMediaDocument,
  renameMediaDocument,
  requestAudioUploadDocument,
  searchYoutubeDocument,
  setSongArchivedDocument,
  songDocument,
  songsDocument,
  updateSongDocument,
} from "@/server/graphql/operations/repertoire.operations";
import type { Paginated } from "@/shared/contracts/api";
import type {
  Artist,
  AudioUploadTicket,
  LyricsResult,
  MediaAsset,
  Song,
  SongCategory,
  SongInput,
  SongListItem,
  SongStage,
  SongWithMedia,
  YoutubeVideoResult,
} from "@/shared/contracts/repertoire";

export type SongListQuery = {
  search?: string;
  title?: string;
  artistId?: string;
  stage?: SongStage;
  category?: SongCategory;
  tag?: string;
  archived: boolean;
  page: number;
  /** Page size (default 10, the backend allows up to 100). */
  limit?: number;
};

export type SongListPage = {
  songs: Paginated<SongListItem>;
  tags: string[];
  titles: string[];
  artists: Artist[];
};

export const repertoireService = {
  async songs(token: string, query: SongListQuery): Promise<SongListPage> {
    const { songs, songTags, songTitles, artists } = await backendGraphql(
      songsDocument,
      {
        token,
        variables: {
          filter: {
            search: query.search || undefined,
            title: query.title || undefined,
            artistId: query.artistId,
            stage: query.stage,
            category: query.category,
            tag: query.tag,
            archived: query.archived,
          },
          page: { page: query.page, limit: query.limit ?? 10 },
          archived: query.archived,
        },
      },
    );
    return { songs, tags: songTags, titles: songTitles, artists };
  },

  async findLyrics(
    token: string,
    artist: string,
    title: string,
  ): Promise<LyricsResult | null> {
    const { findLyrics } = await backendGraphql(findLyricsDocument, {
      token,
      variables: { artist, title },
    });
    return findLyrics ?? null;
  },

  async searchYoutube(
    token: string,
    query: string,
  ): Promise<YoutubeVideoResult[]> {
    const { searchYoutube } = await backendGraphql(searchYoutubeDocument, {
      token,
      variables: { query },
    });
    return searchYoutube;
  },

  async song(token: string, id: string): Promise<SongWithMedia> {
    const { song } = await backendGraphql(songDocument, {
      token,
      variables: { id },
    });
    return song;
  },

  async createSong(token: string, input: SongInput): Promise<Song> {
    const { createSong } = await backendGraphql(createSongDocument, {
      token,
      variables: { input },
    });
    return createSong;
  },

  async updateSong(token: string, id: string, input: SongInput): Promise<Song> {
    const { updateSong } = await backendGraphql(updateSongDocument, {
      token,
      variables: { id, input },
    });
    return updateSong;
  },

  async setArchived(
    token: string,
    id: string,
    archived: boolean,
  ): Promise<Song> {
    const { setSongArchived } = await backendGraphql(setSongArchivedDocument, {
      token,
      variables: { id, archived },
    });
    return setSongArchived;
  },

  async addVideo(
    token: string,
    input: { songId: string; link: string; title: string | null },
  ): Promise<MediaAsset> {
    const { addYoutubeVideo } = await backendGraphql(addYoutubeVideoDocument, {
      token,
      variables: { input },
    });
    return addYoutubeVideo;
  },

  async requestAudioUpload(
    token: string,
    input: {
      songId: string;
      title: string;
      mimeType: string;
      sizeBytes: number;
    },
  ): Promise<AudioUploadTicket> {
    const { requestAudioUpload } = await backendGraphql(
      requestAudioUploadDocument,
      { token, variables: { input } },
    );
    return requestAudioUpload as AudioUploadTicket;
  },

  async confirmAudioUpload(
    token: string,
    assetId: string,
    durationSeconds: number | null,
  ): Promise<MediaAsset> {
    const { confirmAudioUpload } = await backendGraphql(
      confirmAudioUploadDocument,
      { token, variables: { input: { assetId, durationSeconds } } },
    );
    return confirmAudioUpload;
  },

  async renameMedia(
    token: string,
    id: string,
    title: string,
  ): Promise<MediaAsset> {
    const { renameMedia } = await backendGraphql(renameMediaDocument, {
      token,
      variables: { id, title },
    });
    return renameMedia;
  },

  async removeMedia(token: string, id: string): Promise<void> {
    await backendGraphql(removeMediaDocument, { token, variables: { id } });
  },

  async playbackUrl(token: string, assetId: string): Promise<string> {
    const { audioPlaybackUrl } = await backendGraphql(
      audioPlaybackUrlDocument,
      { token, variables: { assetId } },
    );
    return audioPlaybackUrl;
  },

  async downloadUrl(token: string, assetId: string): Promise<string> {
    const { audioDownloadUrl } = await backendGraphql(
      audioDownloadUrlDocument,
      { token, variables: { assetId } },
    );
    return audioDownloadUrl;
  },
};
