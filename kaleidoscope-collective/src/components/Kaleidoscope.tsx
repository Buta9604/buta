import { useLayoutEffect, useRef } from "react";
import {
  cancelRender,
  continueRender,
  delayRender,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { FOOTAGE, frameSrc, HEIGHT, WIDTH } from "../timeline";

const cache = new Map<string, HTMLImageElement>();

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const cached = cache.get(src);
    if (cached) {
      resolve(cached);
      return;
    }
    const img = new Image();
    img.onload = () => {
      cache.set(src, img);
      resolve(img);
    };
    img.onerror = () => reject(new Error(`Could not load ${src}`));
    img.src = src;
  });

type Props = {
  /** First source frame of the footage to sample. */
  sourceFrom: number;
  /** Last source frame; playback ping-pongs between the two. */
  sourceTo: number;
  /** Source frames advanced per composition frame. */
  speed?: number;
  segments?: number;
  /** Sample centre inside the 720x1280 source frame. */
  cx: number;
  cy: number;
  zoom: number;
  /** Rotation of the whole mandala, degrees. */
  rotation: number;
  /** Rotation of the sampled source inside each wedge, degrees. */
  sourceRotation?: number;
  style?: React.CSSProperties;
};

/**
 * A true mirror kaleidoscope: every other wedge is reflected so neighbouring
 * edges line up, sampling live frames of the dispensary footage.
 */
export const Kaleidoscope: React.FC<Props> = ({
  sourceFrom,
  sourceTo,
  speed = 1,
  segments = 12,
  cx,
  cy,
  zoom,
  rotation,
  sourceRotation = 0,
  style,
}) => {
  const frame = useCurrentFrame();
  const canvas = useRef<HTMLCanvasElement>(null);

  const span = Math.max(1, sourceTo - sourceFrom);
  const travelled = Math.floor(frame * speed) % (span * 2);
  const index = Math.min(
    FOOTAGE.last,
    sourceFrom + (travelled <= span ? travelled : span * 2 - travelled),
  );
  const src = staticFile(frameSrc(index));

  useLayoutEffect(() => {
    const handle = delayRender(`Kaleidoscope frame ${index}`);
    let cancelled = false;
    let released = false;
    const release = () => {
      if (!released) {
        released = true;
        continueRender(handle);
      }
    };
    loadImage(src)
      .then((img) => {
        if (cancelled || !canvas.current) return;
        const ctx = canvas.current.getContext("2d");
        if (!ctx) return;
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
        const wedge = (Math.PI * 2) / segments;
        const radius = Math.hypot(WIDTH, HEIGHT) / 2 + 20;
        const overlap = 0.006;
        for (let i = 0; i < segments; i++) {
          ctx.save();
          ctx.translate(WIDTH / 2, HEIGHT / 2);
          ctx.rotate(i * wedge + (rotation * Math.PI) / 180);
          if (i % 2 === 1) ctx.scale(-1, 1);
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.arc(
            0,
            0,
            radius,
            -Math.PI / 2 - wedge / 2 - overlap,
            -Math.PI / 2 + wedge / 2 + overlap,
          );
          ctx.closePath();
          ctx.clip();
          ctx.rotate((sourceRotation * Math.PI) / 180);
          ctx.scale(zoom, zoom);
          ctx.drawImage(img, -cx, -cy);
          ctx.restore();
        }
      })
      .catch((err) => cancelRender(err))
      .finally(release);
    return () => {
      cancelled = true;
      release();
    };
  }, [src, index, segments, cx, cy, zoom, rotation, sourceRotation]);

  return (
    <canvas
      ref={canvas}
      width={WIDTH}
      height={HEIGHT}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", ...style }}
    />
  );
};
