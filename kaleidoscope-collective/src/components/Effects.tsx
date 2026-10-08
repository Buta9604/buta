import {
  AbsoluteFill,
  Img,
  interpolate,
  random,
  staticFile,
} from "remotion";
import { useCurrentFrame } from "../time";

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
          filter: `drop-shadow(0 0 ${40 * glow}px rgba(255, 196, 70, ${0.55 * glow})) drop-shadow(0 18px 30px rgba(20,8,70,0.45))`,
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
            "linear-gradient(115deg, transparent 43%, rgba(255,255,240,0.0) 46%, rgba(255,250,225,0.7) 50%, rgba(255,255,240,0) 54%, transparent 57%)",
          backgroundSize: "300% 100%",
          backgroundPosition: `${interpolate(sheen, [0, 1], [100, 0])}% 0`,
          mixBlendMode: "screen",
        }}
      />
    </div>
  );
};

/** Soft white/gold flash for the big impacts. */
export const ImpactFlash: React.FC<{
  at: number;
  length?: number;
  color?: string;
  peak?: number;
}> = ({ at, length = 14, color = "#fff6dc", peak = 0.4 }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [at - 2, at, at + length], [0, peak, 0], clamp);
  if (o <= 0) return null;
  return <AbsoluteFill style={{ backgroundColor: color, opacity: o, pointerEvents: "none" }} />;
};

/** Floating gold dust. */
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
        const speed = (0.3 + random(`${seed}s${i}`) * 1.1) * drift;
        const size = 3 + random(`${seed}r${i}`) * 7;
        const twinkle =
          0.4 + 0.6 * Math.abs(Math.sin(frame * 0.05 + random(`${seed}t${i}`) * 6.28));
        const y = (((y0 - frame * speed) % 1920) + 1920) % 1920;
        const x = x0 + Math.sin(frame * 0.015 + i) * 22;
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
              background:
                "radial-gradient(circle, #fff8d8 0%, #f1c75b 45%, rgba(241,199,91,0) 75%)",
              opacity: twinkle,
              boxShadow: `0 0 ${size * 2}px rgba(255, 210, 110, 0.8)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/** Slowly turning rays of light. */
export const LightRays: React.FC<{
  x?: string;
  y?: string;
  opacity?: number;
  color?: string;
  speed?: number;
}> = ({ x = "50%", y = "46%", opacity = 0.5, color = "255,214,120", speed = 0.12 }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        opacity,
        background: `repeating-conic-gradient(from 0deg at ${x} ${y}, rgba(${color},0.22) 0deg 7deg, rgba(${color},0) 7deg 22deg)`,
        rotate: `${frame * speed}deg`,
        scale: "1.9",
        maskImage: `radial-gradient(circle at ${x} ${y}, #000 0%, rgba(0,0,0,0.0) 62%)`,
        WebkitMaskImage: `radial-gradient(circle at ${x} ${y}, #000 0%, rgba(0,0,0,0.0) 62%)`,
      }}
    />
  );
};

/** A soft edge darkening, tinted violet rather than black. */
export const Vignette: React.FC<{ strength?: number }> = ({ strength = 0.2 }) => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      background: `radial-gradient(ellipse 80% 65% at 50% 50%, rgba(30,12,90,0) 55%, rgba(30,12,90,${strength}) 100%)`,
    }}
  />
);
