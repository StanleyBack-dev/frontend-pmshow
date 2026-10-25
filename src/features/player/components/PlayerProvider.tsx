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
import { cn } from "@/design-system";
import {
  loadYoutubeApi,
  YT_STATE,
  type YoutubePlayer,
} from "@/features/player/model/youtube-iframe-api";
import { ApiClientError, apiRequest } from "@/shared/lib/api-client";

export type Track = {
  /** Media asset id (audio file or YouTube video). */
  assetId: string;
  title: string;
  songTitle: string;
  /** Set for YouTube videos: played by the embedded YouTube player. */
  youtubeVideoId?: string | null;
  /** The song's lyrics, readable from the player while it plays. */
  lyrics?: { title: string; text: string | null };
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
  /** A PlayerPanel (e.g. in a drawer) shows the player: the page bar hides. */
  embedded: boolean;
};

const PlayerContext = createContext<PlayerApi | null>(null);

type VideoSlots = {
  register: (element: HTMLElement) => void;
  unregister: (element: HTMLElement) => void;
};

// Places that can show the YouTube video instead of the floating panel
// (e.g. inside a drawer, which covers the page). The last one registered
// wins; see PlayerVideoSlot.
const VideoSlotContext = createContext<VideoSlots | null>(null);

// IFrame API error codes. 101/150: the owner (often the record label)
// doesn't allow this video to play embedded — on every site or only on some
// addresses — even when YouTube lists it as embeddable.
function youtubeErrorMessage(code: number): string {
  if (code === 101 || code === 150) {
    return "O dono do vídeo não permite tocá-lo aqui. Abra no YouTube.";
  }
  if (code === 100) return "Vídeo removido ou privado no YouTube.";
  return "Não foi possível tocar este vídeo. Abra no YouTube.";
}

const INITIAL: PlayerState = {
  queue: [],
  index: -1,
  playing: false,
  loading: false,
  position: 0,
  duration: 0,
  error: null,
};

// One player for the whole signed-in area, so playback survives page
// navigation. Audio files play in an <audio> (each track asks the BFF for a
// fresh signed URL); YouTube videos play in the official embedded player,
// shown small above the player bar (YouTube doesn't allow hiding it) or in
// a registered video slot.
export function PlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const youtubeRef = useRef<YoutubePlayer | null>(null);
  const youtubeVideoIdRef = useRef<string | null>(null);
  // The player's methods exist only after onReady: until then use the
  // position / intent it was created with.
  const youtubeReadyRef = useRef(false);
  const youtubeLastRef = useRef({ position: 0, autoplay: false });
  const panelSlotRef = useRef<HTMLDivElement | null>(null);
  const slotsRef = useRef<HTMLElement[]>([]);
  const nextRef = useRef<() => void>(() => undefined);
  const [state, setState] = useState<PlayerState>(INITIAL);
  const [slotActive, setSlotActive] = useState(false);
  const current = state.queue[state.index] ?? null;
  const isYoutube = Boolean(current?.youtubeVideoId);

  const stopAudio = useCallback(() => {
    const audio = audioRef.current;
    if (!audio?.getAttribute("src")) return;
    audio.pause();
    audio.removeAttribute("src");
    audio.load();
  }, []);

  const stopYoutube = useCallback(() => {
    youtubeRef.current?.destroy();
    youtubeRef.current = null;
    youtubeReadyRef.current = false;
    youtubeVideoIdRef.current = null;
    panelSlotRef.current?.replaceChildren();
    for (const slot of slotsRef.current) slot.replaceChildren();
  }, []);

  const createYoutube = useCallback(
    async (videoId: string, start: number, autoplay: boolean) => {
      const YT = await loadYoutubeApi();
      const host = slotsRef.current.at(-1) ?? panelSlotRef.current;
      if (!host) return;
      // The API replaces the element it gets: give it one React doesn't own.
      const element = document.createElement("div");
      element.className = "size-full";
      host.replaceChildren(element);
      youtubeVideoIdRef.current = videoId;
      youtubeReadyRef.current = false;
      youtubeLastRef.current = { position: start, autoplay };
      youtubeRef.current = new YT.Player(element, {
        host: "https://www.youtube-nocookie.com",
        videoId,
        width: "100%",
        height: "100%",
        playerVars: {
          autoplay: autoplay ? 1 : 0,
          start: Math.floor(start),
          playsinline: 1,
          rel: 0,
        },
        events: {
          onReady: (event) => {
            youtubeReadyRef.current = true;
            const youtube = event.target;
            if (!autoplay) {
              setState((s) => ({ ...s, loading: false, playing: false }));
              return;
            }
            youtube.playVideo();
            // Browsers may block playback with sound that doesn't follow a
            // tap: then the video just waits, so leave the spinner and show
            // the play button for the user to start it.
            window.setTimeout(() => {
              if (youtubeRef.current !== youtube) return;
              const now = youtube.getPlayerState();
              if (now !== YT_STATE.PLAYING && now !== YT_STATE.BUFFERING) {
                setState((s) => ({ ...s, loading: false, playing: false }));
              }
            }, 2500);
          },
          onStateChange: ({ data }) => {
            if (data === YT_STATE.PLAYING) {
              setState((s) => ({ ...s, loading: false, playing: true }));
            } else if (data === YT_STATE.PAUSED) {
              setState((s) => ({ ...s, playing: false }));
            } else if (data === YT_STATE.BUFFERING) {
              setState((s) => ({ ...s, loading: true }));
            } else if (data === YT_STATE.ENDED) {
              setState((s) => ({ ...s, playing: false }));
              nextRef.current();
            }
          },
          onError: ({ data }) =>
            setState((s) => ({
              ...s,
              loading: false,
              playing: false,
              error: youtubeErrorMessage(data),
            })),
        },
      });
    },
    [],
  );

  const playYoutube = useCallback(
    async (videoId: string) => {
      const youtube = youtubeReadyRef.current ? youtubeRef.current : null;
      if (youtube) {
        youtube.loadVideoById(videoId); // starts playing
        youtubeVideoIdRef.current = videoId;
        return;
      }
      youtubeRef.current?.destroy(); // still loading: start over
      youtubeRef.current = null;
      await createYoutube(videoId, 0, true);
    },
    [createYoutube],
  );

  // Moving an iframe reloads it, so the video changes place by creating a
  // new player where it should be shown, from the same second and in the
  // same play / pause state.
  const relocateYoutube = useCallback(() => {
    const youtube = youtubeRef.current;
    const videoId = youtubeVideoIdRef.current;
    if (!youtube || !videoId) return;
    const ready = youtubeReadyRef.current;
    const start = ready
      ? youtube.getCurrentTime()
      : youtubeLastRef.current.position;
    const playing = ready
      ? youtube.getPlayerState() === YT_STATE.PLAYING
      : youtubeLastRef.current.autoplay;
    youtube.destroy();
    youtubeRef.current = null;
    youtubeReadyRef.current = false;
    panelSlotRef.current?.replaceChildren();
    for (const slot of slotsRef.current) slot.replaceChildren();
    void createYoutube(videoId, start, playing);
  }, [createYoutube]);

  const videoSlots = useMemo<VideoSlots>(
    () => ({
      register: (element) => {
        slotsRef.current = [...slotsRef.current, element];
        setSlotActive(true);
        relocateYoutube();
      },
      unregister: (element) => {
        slotsRef.current = slotsRef.current.filter((slot) => slot !== element);
        setSlotActive(slotsRef.current.length > 0);
        relocateYoutube();
      },
    }),
    [relocateYoutube],
  );

  const load = useCallback(
    async (queue: Track[], index: number) => {
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

      if (track.youtubeVideoId) {
        stopAudio();
        try {
          await playYoutube(track.youtubeVideoId);
        } catch {
          setState((s) => ({
            ...s,
            loading: false,
            playing: false,
            error: "Não foi possível carregar o YouTube.",
          }));
        }
        return;
      }

      stopYoutube();
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
    },
    [playYoutube, stopAudio, stopYoutube],
  );

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

  useEffect(() => {
    nextRef.current = next;
  }, [next]);

  const seek = useCallback(
    (seconds: number) => {
      if (!Number.isFinite(seconds)) return;
      if (isYoutube) {
        (youtubeReadyRef.current ? youtubeRef.current : null)?.seekTo(
          seconds,
          true,
        );
        setState((s) => ({ ...s, position: seconds }));
      } else if (audioRef.current) {
        audioRef.current.currentTime = seconds;
      }
    },
    [isYoutube],
  );

  const previous = useCallback(() => {
    // Like most players: back to the start first, previous track on a
    // second press.
    const position = isYoutube
      ? ((youtubeReadyRef.current
          ? youtubeRef.current
          : null
        )?.getCurrentTime() ?? 0)
      : (audioRef.current?.currentTime ?? 0);
    if (position > 3) return seek(0);
    if (state.index > 0) void load(state.queue, state.index - 1);
  }, [isYoutube, load, seek, state.index, state.queue]);

  const toggle = useCallback(() => {
    if (!current) return;
    if (isYoutube) {
      const youtube = youtubeReadyRef.current ? youtubeRef.current : null;
      if (state.playing) youtube?.pauseVideo();
      else youtube?.playVideo();
      return;
    }
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) void audio.play().catch(() => undefined);
    else audio.pause();
  }, [current, isYoutube, state.playing]);

  const close = useCallback(() => {
    stopAudio();
    stopYoutube();
    setState(INITIAL);
  }, [stopAudio, stopYoutube]);

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
        // Ignore the error of clearing the source (switching to YouTube).
        s.index < 0 || !audio.getAttribute("src")
          ? s
          : {
              ...s,
              loading: false,
              playing: false,
              error: "Falha ao carregar o áudio.",
            },
      );
    const onEnded = () => nextRef.current();
    audio.addEventListener("timeupdate", sync);
    audio.addEventListener("loadedmetadata", sync);
    audio.addEventListener("pause", sync);
    audio.addEventListener("playing", onPlaying);
    audio.addEventListener("waiting", onWaiting);
    audio.addEventListener("error", onError);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("timeupdate", sync);
      audio.removeEventListener("loadedmetadata", sync);
      audio.removeEventListener("pause", sync);
      audio.removeEventListener("playing", onPlaying);
      audio.removeEventListener("waiting", onWaiting);
      audio.removeEventListener("error", onError);
      audio.removeEventListener("ended", onEnded);
    };
  }, []);

  // The YouTube player has no time events: poll while it plays.
  useEffect(() => {
    if (!isYoutube || !state.playing) return;
    const timer = window.setInterval(() => {
      const youtube = youtubeReadyRef.current ? youtubeRef.current : null;
      if (!youtube) return;
      const position = youtube.getCurrentTime();
      const duration = youtube.getDuration();
      youtubeLastRef.current.position = position;
      setState((s) => ({
        ...s,
        position,
        duration: duration || s.duration,
      }));
    }, 500);
    return () => window.clearInterval(timer);
  }, [isYoutube, state.playing]);

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
    () => ({
      ...state,
      current,
      play,
      toggle,
      next,
      previous,
      seek,
      close,
      embedded: slotActive,
    }),
    [state, current, play, toggle, next, previous, seek, close, slotActive],
  );

  return (
    <PlayerContext.Provider value={api}>
      <VideoSlotContext.Provider value={videoSlots}>
        {children}
      </VideoSlotContext.Provider>
      <audio ref={audioRef} preload="metadata" className="hidden" />
      <div
        aria-label="Vídeo em reprodução"
        className={cn(
          "fixed right-3 bottom-28 z-40 aspect-video w-56 overflow-hidden rounded-lg border border-chrome-line bg-black shadow-pop sm:right-6 sm:w-72",
          // On errors YouTube's own grey screen adds nothing: the player
          // bar explains it and links to YouTube.
          (!isYoutube || state.error || slotActive) && "hidden",
        )}
      >
        <div ref={panelSlotRef} className="size-full" />
      </div>
    </PlayerContext.Provider>
  );
}

export function usePlayer(): PlayerApi {
  const player = useContext(PlayerContext);
  if (!player) throw new Error("usePlayer must be used inside PlayerProvider");
  return player;
}

/**
 * Shows the playing YouTube video here instead of the floating panel, while
 * mounted (the panel can't appear above a drawer or dialog).
 */
export function PlayerVideoSlot({ className }: { className?: string }) {
  const slots = useContext(VideoSlotContext);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!slots || !element) return;
    slots.register(element);
    return () => slots.unregister(element);
  }, [slots]);

  return <div ref={ref} className={className} />;
}
