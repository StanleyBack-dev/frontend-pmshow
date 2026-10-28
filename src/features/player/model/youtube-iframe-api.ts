// Minimal typing and a one-time loader for the YouTube IFrame Player API
// (https://developers.google.com/youtube/iframe_api_reference). The script
// is added by our own (nonce'd) code, so the CSP's 'strict-dynamic' lets it
// and the scripts it loads run.

export type YoutubePlayer = {
  playVideo(): void;
  pauseVideo(): void;
  loadVideoById(videoId: string): void;
  seekTo(seconds: number, allowSeekAhead: boolean): void;
  getCurrentTime(): number;
  getDuration(): number;
  getPlayerState(): number;
  /** 0.25 to 2 (the video decides which rates it offers). */
  setPlaybackRate(rate: number): void;
  destroy(): void;
};

/** Values of `onStateChange` events. */
export const YT_STATE = {
  ENDED: 0,
  PLAYING: 1,
  PAUSED: 2,
  BUFFERING: 3,
} as const;

type YoutubeNamespace = {
  Player: new (
    element: HTMLElement,
    options: {
      host?: string;
      videoId: string;
      width?: string | number;
      height?: string | number;
      playerVars?: Record<string, string | number>;
      events?: {
        onReady?: (event: { target: YoutubePlayer }) => void;
        onStateChange?: (event: { data: number }) => void;
        onError?: (event: { data: number }) => void;
      };
    },
  ) => YoutubePlayer;
};

declare global {
  interface Window {
    YT?: YoutubeNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let loading: Promise<YoutubeNamespace> | null = null;

export function loadYoutubeApi(): Promise<YoutubeNamespace> {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  loading ??= new Promise((resolve, reject) => {
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      if (window.YT) resolve(window.YT);
    };
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    script.onerror = () => {
      loading = null; // allow a retry later
      reject(new Error("YouTube API unavailable"));
    };
    document.head.appendChild(script);
  });
  return loading;
}
