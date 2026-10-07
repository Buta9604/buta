import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  random,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { GoldDust, GoldLogo, Vignette } from "../components/Effects";
import { FONT_BODY, FONT_LUXE, GOLD_GRADIENT, INK, textFill } from "../theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const BRAND = "TOP GRASS";

/**
 * 0-4 s. Nine gold leaves (one per leaf of the logo) spiral in out of the dark,
 * lock into a mandala, and fuse into the logo as the riser peaks.
 */
export const Intro: React.FC = () => {
  const frame = useCurrentFrame();

  const converge = interpolate(frame, [0, 96], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.55, 0, 0.25, 1),
  });
  const ringRadius = interpolate(converge, [0, 1], [760, 0]);
  const ringSpin = interpolate(frame, [0, 100], [-200, 0], {
    ...clamp,
    easing: Easing.bezier(0.2, 0.6, 0.3, 1),
  });
  const leafOpacity = interpolate(frame, [4, 24, 88, 100], [0, 1, 1, 0], clamp);

  const logoIn = interpolate(frame, [86, 104], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const pushIn = interpolate(frame, [108, 120], [1, 6], {
    ...clamp,
    easing: Easing.in(Easing.cubic),
  });
  const exitFade = interpolate(frame, [112, 120], [1, 0], clamp);

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 46%, #1d1608 0%, ${INK} 62%)`,
        overflow: "hidden",
      }}
    >
      <GoldDust count={70} seed="intro" opacity={0.7} drift={0.6} />

      {/* Light rays behind the mandala */}
      <AbsoluteFill
        style={{
          opacity: interpolate(frame, [30, 100], [0, 0.55], clamp) * exitFade,
          background:
            "repeating-conic-gradient(from 0deg at 50% 46%, rgba(255,214,120,0.16) 0deg 6deg, rgba(0,0,0,0) 6deg 20deg)",
          rotate: `${frame * 0.4}deg`,
          scale: "1.8",
        }}
      />

      <AbsoluteFill style={{ scale: String(pushIn), opacity: exitFade }}>
        {/* Nine-leaf mandala */}
        {new Array(9).fill(0).map((_, i) => {
          const angle = (i * 360) / 9 + ringSpin;
          const rad = (angle * Math.PI) / 180;
          const wobble = 1 + 0.15 * random(`leaf${i}`);
          const x = 540 + Math.sin(rad) * ringRadius * wobble;
          const y = 880 - Math.cos(rad) * ringRadius * wobble;
          const size = interpolate(converge, [0, 1], [190, 330]);
          return (
            <Img
              key={i}
              src={staticFile("logo-leaf.png")}
              style={{
                position: "absolute",
                left: x - (size * 0.84) / 2,
                top: y - size / 2,
                height: size,
                rotate: `${angle}deg`,
                opacity: leafOpacity * 0.9,
                filter: "drop-shadow(0 0 18px rgba(255,200,90,0.55))",
              }}
            />
          );
        })}

        {/* The logo itself */}
        <div
          style={{
            position: "absolute",
            left: 540,
            top: 880,
            translate: "-50% -50%",
            opacity: logoIn,
            scale: String(interpolate(logoIn, [0, 1], [0.6, 1])),
          }}
        >
          <GoldLogo
            size={560}
            sheen={interpolate(frame, [92, 118], [0, 1], clamp)}
            glow={1}
          />
        </div>

        {/* Brand name */}
        <div
          style={{
            position: "absolute",
            top: 1260,
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
            const t = interpolate(frame, [40 + i * 4, 60 + i * 4], [0, 1], {
              ...clamp,
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            });
            return (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  whiteSpace: "pre",
                  opacity: t,
                  translate: `0 ${interpolate(t, [0, 1], [40, 0])}px`,
                  filter: `blur(${interpolate(t, [0, 1], [12, 0])}px)`,
                  ...textFill(
                    GOLD_GRADIENT,
                    `${interpolate(frame, [40, 120], [0, 100])}% 0`,
                  ),
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
            top: 1410,
            width: "100%",
            textAlign: "center",
            fontFamily: FONT_BODY,
            fontWeight: 500,
            fontSize: 40,
            letterSpacing: "0.6em",
            color: "#e9d39a",
            opacity: interpolate(frame, [76, 92], [0, 1], clamp),
          }}
        >
          PRESENTS
        </div>
      </AbsoluteFill>

      <Vignette strength={0.85} />
    </AbsoluteFill>
  );
};
