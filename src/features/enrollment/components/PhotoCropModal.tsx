"use client";

import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import { Check, ZoomIn, ZoomOut } from "lucide-react";
import { Button, Modal } from "@/design-system";

const MAX_ZOOM = 4;
/** Arrow keys move the photo by this share of the visible square. */
const KEY_STEP = 0.05;

/** Square of the photo to keep, in the photo's own pixels. */
export type PhotoCrop = { x: number; y: number; side: number };

type View = {
  /** Center of the visible square, in photo pixels. */
  cx: number;
  cy: number;
  /** 1 = the photo's short side fills the square. */
  zoom: number;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

/** Keeps the zoom in range and the photo covering the whole square. */
function fit(view: View, width: number, height: number): View {
  const zoom = clamp(view.zoom, 1, MAX_ZOOM);
  const half = Math.min(width, height) / zoom / 2;
  return {
    zoom,
    cx: clamp(view.cx, half, width - half),
    cy: clamp(view.cy, half, height - half),
  };
}

// Positions the picked photo inside the round frame shown across the app
// (profile, sidebar, tables): drag (or arrow keys) to move it, pinch, the
// mouse wheel or the slider to zoom. The whole square is kept; the circle
// only shows what the avatar will look like.
export function PhotoCropModal({
  photo,
  onCancel,
  onConfirm,
}: {
  /** The picked photo, already decoded (EXIF orientation applied). */
  photo: { url: string; width: number; height: number } | null;
  onCancel: () => void;
  onConfirm: (crop: PhotoCrop) => void;
}) {
  const frame = useRef<HTMLDivElement>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const width = photo?.width ?? 1;
  const height = photo?.height ?? 1;
  // Starts centered, filling the frame (the parent remounts it per photo).
  const [view, setView] = useState<View>({
    cx: width / 2,
    cy: height / 2,
    zoom: 1,
  });
  const side = Math.min(width, height) / view.zoom;

  /** Photo pixels per screen pixel of the frame. */
  function scale(): number {
    const box = frame.current?.getBoundingClientRect().width || 1;
    return Math.min(width, height) / view.zoom / box;
  }

  function update(next: (current: View) => View) {
    setView((current) => fit(next(current), width, height));
  }

  // React's wheel listener is passive: preventDefault (keep the page from
  // scrolling while zooming) needs a native one.
  useEffect(() => {
    const element = frame.current;
    if (!element) return;
    function onWheel(event: WheelEvent) {
      event.preventDefault();
      const factor = Math.exp(-event.deltaY * 0.0015);
      setView((current) =>
        fit({ ...current, zoom: current.zoom * factor }, width, height),
      );
    }
    element.addEventListener("wheel", onWheel, { passive: false });
    return () => element.removeEventListener("wheel", onWheel);
  }, [width, height]);

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    pointers.current.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY,
    });
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    const previous = pointers.current.get(event.pointerId);
    if (!previous) return;
    const current = { x: event.clientX, y: event.clientY };
    const others = [...pointers.current.entries()].filter(
      ([id]) => id !== event.pointerId,
    );
    pointers.current.set(event.pointerId, current);
    const ratio = scale();

    if (others.length === 0) {
      // One finger (or the mouse): drag the photo along.
      update((view) => ({
        ...view,
        cx: view.cx - (current.x - previous.x) * ratio,
        cy: view.cy - (current.y - previous.y) * ratio,
      }));
      return;
    }
    // Two fingers: pinch zooms, the midpoint moving drags.
    const other = others[0][1];
    const before = Math.hypot(previous.x - other.x, previous.y - other.y);
    const after = Math.hypot(current.x - other.x, current.y - other.y);
    if (before < 1) return;
    update((view) => ({
      zoom: view.zoom * (after / before),
      cx: view.cx - ((current.x - previous.x) / 2) * ratio,
      cy: view.cy - ((current.y - previous.y) / 2) * ratio,
    }));
  }

  function onPointerUp(event: PointerEvent<HTMLDivElement>) {
    pointers.current.delete(event.pointerId);
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const step = side * KEY_STEP;
    const moves: Record<string, [number, number]> = {
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
      ArrowUp: [0, -step],
      ArrowDown: [0, step],
    };
    const move = moves[event.key];
    if (move) {
      event.preventDefault();
      update((view) => ({
        ...view,
        cx: view.cx + move[0],
        cy: view.cy + move[1],
      }));
    } else if (event.key === "+" || event.key === "-") {
      event.preventDefault();
      update((view) => ({
        ...view,
        zoom: view.zoom * (event.key === "+" ? 1.1 : 1 / 1.1),
      }));
    }
  }

  function confirm() {
    onConfirm({ x: view.cx - side / 2, y: view.cy - side / 2, side });
  }

  return (
    <Modal
      open={photo !== null}
      onClose={onCancel}
      title="Ajustar foto"
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
          <Button
            type="button"
            icon={<Check className="size-4" />}
            onClick={confirm}
          >
            Usar foto
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <p>
          Arraste para posicionar o rosto no círculo. Use o controle abaixo (ou
          os dois dedos) para aproximar.
        </p>
        <div
          ref={frame}
          role="application"
          tabIndex={0}
          aria-label="Posição da foto. Use as setas para mover e + ou - para aproximar."
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onKeyDown={onKeyDown}
          className="relative mx-auto aspect-square w-full max-w-72 cursor-grab touch-none overflow-hidden rounded-md bg-black select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent active:cursor-grabbing"
        >
          {photo && (
            // eslint-disable-next-line @next/next/no-img-element -- local blob preview
            <img
              src={photo.url}
              alt=""
              draggable={false}
              className="pointer-events-none absolute max-w-none"
              style={{
                width: `${(width / side) * 100}%`,
                height: `${(height / side) * 100}%`,
                left: `${(-(view.cx - side / 2) / side) * 100}%`,
                top: `${(-(view.cy - side / 2) / side) * 100}%`,
              }}
            />
          )}
          {/* Darkens what falls outside the avatar circle. */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-full shadow-[0_0_0_9999px_rgba(0,0,0,0.55)] ring-2 ring-white/80"
          />
        </div>
        <div className="mx-auto flex max-w-72 items-center gap-3">
          <ZoomOut className="size-4 shrink-0 text-soft" aria-hidden />
          <input
            type="range"
            aria-label="Zoom"
            min={1}
            max={MAX_ZOOM}
            step={0.01}
            value={view.zoom}
            onChange={(event) =>
              update((view) => ({
                ...view,
                zoom: Number(event.target.value),
              }))
            }
            className="block h-1.5 w-full cursor-pointer accent-[var(--brand-gold)]"
          />
          <ZoomIn className="size-4 shrink-0 text-soft" aria-hidden />
        </div>
      </div>
    </Modal>
  );
}
