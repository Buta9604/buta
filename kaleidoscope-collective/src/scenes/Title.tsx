import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { ImpactFlash, Vignette } from "../components/Effects";
import { StainedGlass } from "../components/StainedGlass";
import {
  FONT_BODY,
  FONT_DISPLAY,
  FONT_LUXE,
  GOLD_GRADIENT,
  JEWELS,
  PRISM_GRADIENT,
  textFill,
} from "../theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const WORD = "KALEIDOSCOPE";

/** 4-8 s. Stained glass assembles around the title, then blows apart. */
export const Title: React.FC = () => {
  const frame = useCurrentFrame();

  const reveal = interpolate(frame, [0, 34], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const shatter = interpolate(frame, [104, 120], [0, 1], {
    ...clamp,
    easing: Easing.in(Easing.quad),
  });
  const textOut = interpolate(frame, [104, 116], [1, 0], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: "#0d0b10", overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          rotate: `${interpolate(frame, [0, 120], [-4, 6])}deg`,
          scale: String(interpolate(frame, [0, 120], [1.18, 1.3])),
        }}
      >
        <StainedGlass
          width={1080}
          height={1920}
          count={150}
          seed="title"
          reveal={reveal}
          shatter={shatter}
          shimmer={frame / 50}
        />
      </AbsoluteFill>

      {/* Dark lens so the type reads over the glass */}
      <AbsoluteFill
        style={{
          opacity: interpolate(frame, [10, 30], [0, 1], clamp) * textOut,
          background:
            "radial-gradient(ellipse 62% 30% at 50% 50%, rgba(8,6,12,0.92) 0%, rgba(8,6,12,0.75) 55%, rgba(8,6,12,0) 100%)",
        }}
      />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          opacity: textOut,
          scale: String(interpolate(frame, [0, 120], [1, 1.06])),
        }}
      >
        <div
          style={{
            fontFamily: FONT_LUXE,
            fontWeight: 700,
            fontSize: 54,
            letterSpacing: "0.55em",
            marginRight: "-0.55em",
            opacity: interpolate(frame, [8, 22], [0, 1], clamp),
            ...textFill(GOLD_GRADIENT, `${frame}% 0`),
          }}
        >
          THE
        </div>

        <div
          style={{
            display: "flex",
            fontFamily: FONT_DISPLAY,
            fontWeight: 900,
            fontSize: 88,
            letterSpacing: "-0.01em",
            marginTop: 18,
          }}
        >
          {WORD.split("").map((ch, i) => {
            const t = interpolate(frame, [12 + i * 2.2, 30 + i * 2.2], [0, 1], {
              ...clamp,
              easing: Easing.bezier(0.34, 1.56, 0.64, 1),
            });
            const settle = interpolate(frame, [48, 70], [0, 1], clamp);
            return (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  opacity: Math.min(1, t * 1.5),
                  scale: String(t),
                  rotate: `${interpolate(t, [0, 1], [i % 2 ? 90 : -90, 0])}deg`,
                  translate: `0 ${Math.sin(frame / 9 + i * 0.7) * 6 * settle}px`,
                  ...(settle > 0
                    ? textFill(
                        PRISM_GRADIENT,
                        `${(i * 9 + frame * 1.4) % 100}% 0`,
                        "900% 100%",
                      )
                    : { color: JEWELS[i % JEWELS.length] }),
                  textShadow: settle > 0 ? undefined : "0 0 30px rgba(255,255,255,0.35)",
                  filter: "drop-shadow(0 6px 18px rgba(0,0,0,0.6))",
                }}
              >
                {ch}
              </span>
            );
          })}
        </div>

        <div
          style={{
            fontFamily: FONT_LUXE,
            fontWeight: 800,
            fontSize: 112,
            marginTop: 6,
            letterSpacing: `${interpolate(frame, [30, 70], [0.5, 0.14], {
              ...clamp,
              easing: Easing.out(Easing.cubic),
            })}em`,
            marginRight: "-0.14em",
            opacity: interpolate(frame, [30, 46], [0, 1], clamp),
            ...textFill(GOLD_GRADIENT, `${interpolate(frame, [30, 120], [0, 100])}% 0`),
            filter: "drop-shadow(0 0 22px rgba(255,200,90,0.35))",
          }}
        >
          COLLECTIVE
        </div>

        <div
          style={{
            marginTop: 54,
            fontFamily: FONT_BODY,
            fontWeight: 600,
            fontSize: 44,
            letterSpacing: "0.3em",
            marginRight: "-0.3em",
            color: "#f5ecd6",
            opacity: interpolate(frame, [58, 74], [0, 1], clamp),
            translate: `0 ${interpolate(frame, [58, 74], [24, 0], {
              ...clamp,
              easing: Easing.out(Easing.cubic),
            })}px`,
          }}
        >
          NEW AT TOP GRASS
        </div>
      </AbsoluteFill>

      <Vignette strength={0.6} />
      <ImpactFlash at={0} length={14} peak={0.35} />
    </AbsoluteFill>
  );
};
