// 30 fps. The film plays SLOW times slower than the scenes were designed:
// every scene is written in "design frames" (src/time.ts converts), and the
// soundtrack runs at 90 BPM so one bar = 80 real frames and every scene starts
// on a downbeat (scripts/make-music.py).
export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;
export const SLOW = 4 / 3;

/** One beat in design frames (a beat is 20 real frames). */
export const BEAT = 15;

/** Real frames a scene fades in over, on top of the scene before it. */
export const OVERLAP = 16;

const real = (design: number) => Math.round(design * SLOW);

export const SCENES = {
  intro: { from: 0, duration: real(120) },
  title: { from: real(120), duration: real(120) },
  arriving: { from: real(240), duration: real(120) },
  kaleido: { from: real(360), duration: real(120) },
  strains: { from: real(480), duration: real(180) },
  envelope: { from: real(660), duration: real(60) },
  winner: { from: real(720), duration: real(180) },
  scope: { from: real(900), duration: real(120) },
  end: { from: real(1020), duration: real(180) },
} as const;

export const TOTAL_FRAMES = real(1200);

// Source clip (public/footage.mp4, 30 fps) landmarks, in source frames.
export const FOOTAGE = {
  train: 0, // model train passing the display
  jars: 60, // stained-glass jars, 60-130
  microscope: 130, // AmScope camera to the monitor, 130-180
  trichomes: 180, // magnified trichomes on the monitor, 180-354
  monitorFull: 255, // monitor fills the frame from here on
  last: 354,
};

// Frame-sequence copy of the footage (720x1280) used by the kaleidoscope.
export const frameSrc = (index: number) =>
  `frames/${String(index).padStart(4, "0")}.jpg`;
