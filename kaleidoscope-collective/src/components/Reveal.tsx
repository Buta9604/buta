import { Easing, interpolate } from "remotion";
import { useCurrentFrame } from "../time";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/**
 * Text that rises out of an invisible mask line (and optionally leaves
 * upward). Slow expo-out, no overshoot.
 */
export const Reveal: React.FC<{
  at: number;
  dur?: number;
  outAt?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
  innerStyle?: React.CSSProperties;
}> = ({ at, dur = 26, outAt, children, style, innerStyle }) => {
  const frame = useCurrentFrame();
  const inT = interpolate(frame, [at, at + dur], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const outT =
    outAt === undefined
      ? 0
      : interpolate(frame, [outAt, outAt + 14], [0, 1], {
          ...clamp,
          easing: Easing.bezier(0.5, 0, 0.75, 0),
        });
  return (
    <div
      style={{
        overflow: "hidden",
        padding: "0.16em 0.3em",
        margin: "-0.16em -0.3em",
        ...style,
      }}
    >
      <div
        style={{
          translate: `0 ${(1 - inT) * 112 - outT * 112}%`,
          opacity: Math.min(1, inT * 3) * (1 - outT),
          ...innerStyle,
        }}
      >
        {children}
      </div>
    </div>
  );
};

/** Plain eased fade with a small rise, for supporting text. */
export const useFadeUp = (at: number, dur = 22, rise = 26, outAt?: number) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [at, at + dur], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });
  const o =
    outAt === undefined
      ? 0
      : interpolate(frame, [outAt, outAt + 14], [0, 1], {
          ...clamp,
          easing: Easing.in(Easing.quad),
        });
  return {
    opacity: t * (1 - o),
    translate: `0 ${(1 - t) * rise - o * rise * 0.6}px`,
  } as const;
};
