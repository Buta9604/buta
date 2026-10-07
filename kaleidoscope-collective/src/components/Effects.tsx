import {
  AbsoluteFill,
  Img,
  interpolate,
  random,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { JEWELS } from "../theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Gold 9-leaf logo with a travelling specular sheen. */
export const GoldLogo: React.FC<{
  size: number;
  sheen: number;
  glow?: number;
  style?: React.CSSProperties;
}> = ({ size, sheen, glow = 0.6, style }) => {
  const logo = staticFile("logo-leaf.png");
  const width = size * (776 / 926);
  return (
    <div style={{ position: "relative", width, height: size, ...style }}>
      <Img
        src={logo}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          filter: `drop-shadow(0 0 ${40 * glow}px rgba(255, 196, 70, ${0.55 * glow})) drop-shadow(0 18px 30px rgba(0,0,0,0.6))`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          WebkitMaskImage: `url(${logo})`,
          maskImage: `url(${logo})`,
          WebkitMaskSize: "100% 100%",
          maskSize: "100% 100%",
          backgroundImage:
            "linear-gradient(115deg, transparent 38%, rgba(255,255,255,0.0) 42%, rgba(255,255,240,0.95) 50%, rgba(255,255,255,0) 58%, transparent 62%)",
          backgroundSize: "300% 100%",
          backgroundPosition: `${interpolate(sheen, [0, 1], [100, 0])}% 0`,
          mixBlendMode: "screen",
        }}
      />
    </div>
  );
};

/** Quick chromatic light leak used on the cuts. */
export const PrismFlash: React.FC<{ at: number; length?: number }> = ({
  at,
  length = 14,
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at - length / 2, at + length / 2], [0, 1], clamp);
  if (p <= 0 || p >= 1) return null;
  const intensity = Math.sin(p * Math.PI);
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        mixBlendMode: "screen",
        opacity: intensity,
        backgroundImage: `linear-gradient(${110 + p * 40}deg, transparent ${-40 + p * 100}%, ${JEWELS[6]}aa ${-25 + p * 100}%, ${JEWELS[3]}cc ${-12 + p * 100}%, #ffffffee ${-4 + p * 100}%, ${JEWELS[5]}cc ${6 + p * 100}%, ${JEWELS[4]}99 ${18 + p * 100}%, transparent ${34 + p * 100}%)`,
      }}
    />
  );
};

/** Plain white/gold flash for the big impacts. */
export const ImpactFlash: React.FC<{ at: number; length?: number; color?: string }> = ({
  at,
  length = 12,
  color = "#fff6dc",
}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [at - 1, at, at + length], [0, 1, 0], clamp);
  if (o <= 0) return null;
  return <AbsoluteFill style={{ backgroundColor: color, opacity: o, pointerEvents: "none" }} />;
};

/** Floating gold dust / sparkles. */
export const GoldDust: React.FC<{
  count: number;
  seed: string;
  opacity?: number;
  drift?: number;
}> = ({ count, seed, opacity = 1, drift = 1 }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity }}>
      {new Array(count).fill(0).map((_, i) => {
        const x0 = random(`${seed}x${i}`) * 1080;
        const y0 = random(`${seed}y${i}`) * 1920;
        const speed = (0.4 + random(`${seed}s${i}`) * 1.6) * drift;
        const size = 2 + random(`${seed}r${i}`) * 7;
        const twinkle =
          0.35 + 0.65 * Math.abs(Math.sin(frame * 0.08 + random(`${seed}t${i}`) * 6.28));
        const y = (((y0 - frame * speed) % 1920) + 1920) % 1920;
        const x = x0 + Math.sin(frame * 0.02 + i) * 18;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: size,
              height: size,
              borderRadius: "50%",
              background: "radial-gradient(circle, #fff8d8 0%, #f1c75b 45%, rgba(241,199,91,0) 75%)",
              opacity: twinkle,
              boxShadow: `0 0 ${size * 2}px rgba(255, 210, 110, 0.8)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

export const Vignette: React.FC<{ strength?: number }> = ({ strength = 0.75 }) => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      background: `radial-gradient(ellipse 75% 60% at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,${strength}) 100%)`,
    }}
  />
);

/** Four-point star sparkle. */
export const Sparkle: React.FC<{
  x: number;
  y: number;
  size: number;
  progress: number;
  color?: string;
}> = ({ x, y, size, progress, color = "#fff7d6" }) => {
  if (progress <= 0 || progress >= 1) return null;
  const s = Math.sin(progress * Math.PI);
  return (
    <svg
      width={size}
      height={size}
      viewBox="-50 -50 100 100"
      style={{
        position: "absolute",
        left: x - size / 2,
        top: y - size / 2,
        scale: String(s),
        rotate: `${progress * 90}deg`,
        filter: `drop-shadow(0 0 12px ${color})`,
      }}
    >
      <path d="M0,-50 C4,-8 8,-4 50,0 C8,4 4,8 0,50 C-4,8 -8,4 -50,0 C-8,-4 -4,-8 0,-50Z" fill={color} />
    </svg>
  );
};
