import { JEWELS } from "./theme";

// Jar centres in public/jars-still.jpg (1080x1920). Names and THC figures are
// read straight off the labels in the footage; Berry Float's THC figure is not
// legible in the clip, so it is not shown.
export const JARS = {
  blueZushi: { name: "BLUE ZUSHI", thc: 26.2, color: JEWELS[1], x: 420, y: 800 },
  permanentMarker: { name: "PERMANENT MARKER", thc: 26.7, color: JEWELS[4], x: 560, y: 1300 },
  mob: { name: "MOB", thc: 25.5, color: JEWELS[0], x: 880, y: 1380 },
  berryFloat: { name: "BERRY FLOAT", thc: null, color: JEWELS[6], x: 220, y: 1190 },
} as const;

export type Camera = { x: number; y: number; s: number };

export const OVERVIEW: Camera = { x: 540, y: 960, s: 1.15 };

/** Camera centred on a point of the still, kept inside the photo's edges. */
export const cameraOn = (x: number, y: number, s: number, lift = 80): Camera => {
  const hw = 540 / s;
  const hh = 960 / s;
  return {
    x: Math.min(1080 - hw, Math.max(hw, x)),
    y: Math.min(1920 - hh, Math.max(hh, y + lift / s)),
    s,
  };
};

export const mixCamera = (a: Camera, b: Camera, t: number): Camera => ({
  x: a.x + (b.x - a.x) * t,
  y: a.y + (b.y - a.y) * t,
  s: a.s + (b.s - a.s) * t,
});

/** Style for an <Img> of the 1080x1920 still so that `cam` fills the frame. */
export const cameraStyle = (cam: Camera): React.CSSProperties => ({
  position: "absolute",
  left: 0,
  top: 0,
  width: 1080,
  height: 1920,
  transformOrigin: "0 0",
  translate: `${540 - cam.x * cam.s}px ${960 - cam.y * cam.s}px`,
  scale: String(cam.s),
});
