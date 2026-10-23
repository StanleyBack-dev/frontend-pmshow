"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { ApiClientError, apiRequest } from "@/shared/lib/api-client";

export type Track = {
  assetId: string;
  title: string;
  songTitle: string;
};

type PlayerState = {
  queue: Track[];
  index: number;
  playing: boolean;
  loading: boolean;
  position: number;
  duration: number;
  error: string | null;
};

type PlayerApi = PlayerState & {
  current: Track | null;
  /** Plays `track`; `queue` (containing it) becomes the play order. */
  play: (track: Track, queue?: Track[]) => void;
  toggle: () => void;
  next: () => void;
  previous: () => void;
  seek: (seconds: number) => void;
  close: () => void;
};

const PlayerContext = createContext<PlayerApi | null>(null);

const INITIAL: PlayerState = {
  queue: [],
  index: -1,
  playing: false,
  loading: false,
  position: 0,
  duration: 0,
  error: null,
};

// One <audio> for the whole signed-in area, so playback survives page
// navigation. Each track asks the BFF for a fresh signed URL when it starts.
export function PlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [state, setState] = useState<PlayerState>(INITIAL);
  const current = state.queue[state.index] ?? null;

  const load = useCallback(async (queue: Track[], index: number) => {
    const audio = audioRef.current;
    const track = queue[index];
    if (!audio || !track) return;

    setState((s) => ({
      ...s,
      queue,
      index,
      loading: true,
      position: 0,
      duration: 0,
      error: null,
    }));
    try {
      const { url } = await apiRequest<{ url: string }>(
        `/media/${track.assetId}/play`,
      );
      audio.src = url;
      await audio.play();
    } catch (cause) {
      const message =
        cause instanceof ApiClientError
          ? cause.message
          : cause instanceof DOMException && cause.name === "NotAllowedError"
            ? null // autoplay blocked: the user presses play
            : "Não foi possível tocar este áudio.";
      setState((s) => ({
        ...s,
        loading: false,
        playing: false,
        error: message,
      }));
    }
  }, []);

  const play = useCallback(
    (track: Track, queue?: Track[]) => {
      const list = queue?.length ? queue : [track];
      const index = Math.max(
        0,
        list.findIndex((item) => item.assetId === track.assetId),
      );
      void load(list, index);
    },
    [load],
  );

  const next = useCallback(() => {
    if (state.index < state.queue.length - 1) {
      void load(state.queue, state.index + 1);
    }
  }, [load, state.index, state.queue]);

  const previous = useCallback(() => {
    const audio = audioRef.current;
    // Like most players: back to the start first, previous track on a
    // second press.
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }
    if (state.index > 0) void load(state.queue, state.index - 1);
  }, [load, state.index, state.queue]);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !current) return;
    if (audio.paused) void audio.play().catch(() => undefined);
    else audio.pause();
  }, [current]);

  const seek = useCallback((seconds: number) => {
    const audio = audioRef.current;
    if (audio && Number.isFinite(seconds)) audio.currentTime = seconds;
  }, []);

  const close = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
    }
    setState(INITIAL);
  }, []);

  // <audio> events → state.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const sync = () =>
      setState((s) => ({
        ...s,
        playing: !audio.paused,
        position: audio.currentTime,
        duration: Number.isFinite(audio.duration) ? audio.duration : s.duration,
      }));
    const onPlaying = () =>
      setState((s) => ({ ...s, loading: false, playing: true }));
    const onWaiting = () => setState((s) => ({ ...s, loading: true }));
    const onError = () =>
      setState((s) =>
        s.index < 0
          ? s
          : {
              ...s,
              loading: false,
              playing: false,
              error: "Falha ao carregar o áudio.",
            },
      );
    audio.addEventListener("timeupdate", sync);
    audio.addEventListener("loadedmetadata", sync);
    audio.addEventListener("pause", sync);
    audio.addEventListener("playing", onPlaying);
    audio.addEventListener("waiting", onWaiting);
    audio.addEventListener("error", onError);
    return () => {
      audio.removeEventListener("timeupdate", sync);
      audio.removeEventListener("loadedmetadata", sync);
      audio.removeEventListener("pause", sync);
      audio.removeEventListener("playing", onPlaying);
      audio.removeEventListener("waiting", onWaiting);
      audio.removeEventListener("error", onError);
    };
  }, []);

  // Auto-advance through the queue.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onEnded = () => next();
    audio.addEventListener("ended", onEnded);
    return () => audio.removeEventListener("ended", onEnded);
  }, [next]);

  // Lock-screen / headset controls.
  useEffect(() => {
    if (!("mediaSession" in navigator)) return;
    const session = navigator.mediaSession;
    session.metadata = current
      ? new MediaMetadata({
          title: current.title,
          artist: current.songTitle,
          album: "PM SHOW",
          artwork: [
            { src: "/pwa-icon/512", sizes: "512x512", type: "image/png" },
          ],
        })
      : null;
    const handlers: [MediaSessionAction, MediaSessionActionHandler | null][] = [
      ["play", current ? toggle : null],
      ["pause", current ? toggle : null],
      ["nexttrack", current ? next : null],
      ["previoustrack", current ? previous : null],
      ["seekto", current ? (details) => seek(details.seekTime ?? 0) : null],
    ];
    for (const [action, handler] of handlers) {
      try {
        session.setActionHandler(action, handler);
      } catch {
        // Action not supported by this browser.
      }
    }
  }, [current, next, previous, seek, toggle]);

  const api = useMemo<PlayerApi>(
    () => ({ ...state, current, play, toggle, next, previous, seek, close }),
    [state, current, play, toggle, next, previous, seek, close],
  );

  return (
    <PlayerContext.Provider value={api}>
      {children}
      <audio ref={audioRef} preload="metadata" className="hidden" />
    </PlayerContext.Provider>
  );
}

export function usePlayer(): PlayerApi {
  const player = useContext(PlayerContext);
  if (!player) throw new Error("usePlayer must be used inside PlayerProvider");
  return player;
}
