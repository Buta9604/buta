// 30 fps, 120 BPM: one beat = 15 frames, one bar = 60 frames.
// Every scene starts on a downbeat of the soundtrack (scripts/make-music.py).
export const FPS = 30;
export const BEAT = 15;
export const WIDTH = 1080;
export const HEIGHT = 1920;

export const SCENES = {
  intro: { from: 0, duration: 120 },
  title: { from: 120, duration: 120 },
  arriving: { from: 240, duration: 120 },
  kaleido: { from: 360, duration: 120 },
  strains: { from: 480, duration: 240 },
  scope: { from: 720, duration: 180 },
  cup: { from: 900, duration: 60 },
  end: { from: 960, duration: 180 },
} as const;

export const TOTAL_FRAMES = 1140;

// Source clip (public/footage.mp4, 30 fps) landmarks, in source frames.
export const FOOTAGE = {
  train: 0, // model train passing the display
  jars: 60, // stained-glass jars, 60-130
  microscope: 130, // AmScope camera to the monitor, 130-180
  trichomes: 180, // magnified trichomes on the monitor, 180-354
  last: 354,
};

// Frame-sequence copy of the footage (720x1280) used by the kaleidoscope.
export const frameSrc = (index: number) =>
  `frames/${String(index).padStart(4, "0")}.jpg`;
