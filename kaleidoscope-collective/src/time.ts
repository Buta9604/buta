import { createContext, useContext } from "react";
import { useCurrentFrame as useRealFrame } from "remotion";
import { SLOW } from "./timeline";

const Offset = createContext(0);

/** Wraps a scene that starts `offset` real frames early to crossfade in. */
export const SceneOffset = Offset.Provider;

/**
 * Scene-local time in design frames: 0 on the scene's downbeat, advancing
 * 1/SLOW per real frame. Negative while the scene is still fading in.
 */
export const useCurrentFrame = (): number => {
  const frame = useRealFrame();
  const offset = useContext(Offset);
  return (frame - offset) / SLOW;
};
