import type { YoutubeVideoResult } from "@/shared/contracts/repertoire";

/** Same normalization as the backend's artist key (case and accents). */
export function artistKey(name: string): string {
  return name
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

// "(Ao Vivo)", "[Clipe Oficial]", "| DVD 2024"…
const NOISE = /\s*(\([^)]*\)|\[[^\]]*\]|\|.*$)/g;
const CHANNEL_NOISE = /\s*(vevo|- topic|oficial|official)\s*$/i;

/**
 * Best guess of artist and song from a YouTube result, used to look up the
 * lyrics. Music videos are usually titled "Artist - Song"; otherwise the
 * channel name stands for the artist.
 */
export function guessFromVideo(
  video: YoutubeVideoResult,
  fallbackTitle: string,
): { artist: string; title: string } {
  const clean = video.title.replace(NOISE, "").trim();
  const separator = clean.match(/\s[-–—]\s/);
  if (separator?.index !== undefined) {
    return {
      artist: clean.slice(0, separator.index).trim(),
      title: clean.slice(separator.index + separator[0].length).trim(),
    };
  }
  return {
    artist: video.channelTitle.replace(CHANNEL_NOISE, "").trim(),
    title: fallbackTitle.trim() || clean,
  };
}

export const youtubeWatchUrl = (videoId: string) =>
  `https://www.youtube.com/watch?v=${videoId}`;
