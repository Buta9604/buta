import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { GoldDust, GoldLogo, Vignette } from "../components/Effects";
import { FONT_BODY, FONT_LUXE, GOLD_GRADIENT, INK, textFill } from "../theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const BRAND = "TOP GRASS";

// Where the finished logo sits, and how big it is.
const LOGO = { x: 540, y: 860, size: 560 };
const LEAF_ASPECT = 776 / 926; // logo-leaf.png

const wrapDeg = (deg: number) => ((((deg + 180) % 360) + 360) % 360) - 180;

/**
 * 0-4 s. Nine gold leaves (one per leaf of the logo) orbit in, straighten up
 * and settle exactly on top of each other, so the logo is assembled from them
 * rather than popping in.
 */
export const Intro: React.FC = () => {
  const frame = useCurrentFrame();

  const merge = interpolate(frame, [8, 96], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.45, 0, 0.15, 1),
  });
  const radius = interpolate(merge, [0, 1], [640, 0]);
  const spin = interpolate(merge, [0, 1], [-140, 0]);
  const leafSize = interpolate(merge, [0, 1], [190, LOGO.size]);
  const leavesIn = interpolate(frame, [0, 22], [0, 1], clamp);
  // The leaves hand over to the real logo while they are pixel-for-pixel on top of it.
  const handover = interpolate(frame, [94, 104], [0, 1], clamp);
  const glow = interpolate(frame, [92, 118], [0.2, 1], {
    ...clamp,
    easing: Easing.out(Easing.quad),
  });
  const settle = interpolate(frame, [96, 120], [1, 1.04], {
    ...clamp,
    easing: Easing.inOut(Easing.sin),
  });
  const exit = interpolate(frame, [110, 120], [1, 0], {
    ...clamp,
    easing: Easing.in(Easing.quad),
  });

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 45%, #1d1608 0%, ${INK} 62%)`,
        overflow: "hidden",
      }}
    >
      <GoldDust count={40} seed="intro" opacity={0.45} drift={0.5} />

      <AbsoluteFill style={{ opacity: exit, scale: String(settle) }}>
        {new Array(9).fill(0).map((_, i) => {
          const orbit = i * 40 + spin;
          const rad = (orbit * Math.PI) / 180;
          const x = LOGO.x + Math.sin(rad) * radius;
          const y = LOGO.y - Math.cos(rad) * radius;
          const width = leafSize * LEAF_ASPECT;
          return (
            <Img
              key={i}
              src={staticFile("logo-leaf.png")}
              style={{
                position: "absolute",
                left: x - width / 2,
                top: y - leafSize / 2,
                width,
                height: leafSize,
                rotate: `${wrapDeg(orbit) * (1 - merge)}deg`,
                opacity: leavesIn * (1 - handover) * interpolate(merge, [0, 1], [0.85, 1]),
                filter: "drop-shadow(0 0 14px rgba(255,200,90,0.35))",
              }}
            />
          );
        })}

        <div
          style={{
            position: "absolute",
            left: LOGO.x - (LOGO.size * LEAF_ASPECT) / 2,
            top: LOGO.y - LOGO.size / 2,
            opacity: handover,
          }}
        >
          <GoldLogo
            size={LOGO.size}
            sheen={interpolate(frame, [100, 118], [0, 1], clamp)}
            glow={glow}
          />
        </div>

        <div
          style={{
            position: "absolute",
            top: 1230,
            width: "100%",
            display: "flex",
            justifyContent: "center",
            fontFamily: FONT_LUXE,
            fontWeight: 800,
            fontSize: 112,
            letterSpacing: "0.12em",
          }}
        >
          {BRAND.split("").map((ch, i) => {
            const t = interpolate(frame, [56 + i * 3, 80 + i * 3], [0, 1], {
              ...clamp,
              easing: Easing.out(Easing.cubic),
            });
            return (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  whiteSpace: "pre",
                  opacity: t,
                  translate: `0 ${interpolate(t, [0, 1], [24, 0])}px`,
                  ...textFill(GOLD_GRADIENT, `${interpolate(frame, [56, 120], [0, 60])}% 0`),
                }}
              >
                {ch}
              </span>
            );
          })}
        </div>
        <div
          style={{
            position: "absolute",
            top: 1380,
            width: "100%",
            textAlign: "center",
            fontFamily: FONT_BODY,
            fontWeight: 500,
            fontSize: 40,
            letterSpacing: "0.6em",
            color: "#e9d39a",
            opacity: interpolate(frame, [84, 100], [0, 1], clamp),
          }}
        >
          PRESENTS
        </div>
      </AbsoluteFill>

      <Vignette strength={0.85} />
    </AbsoluteFill>
  );
};
