import { AbsoluteFill, Easing, interpolate } from "remotion";
import { ImpactFlash } from "../components/Effects";
import { Reveal, useFadeUp } from "../components/Reveal";
import { StainedGlass } from "../components/StainedGlass";
import { useCurrentFrame } from "../time";
import {
  BG_VIOLET,
  FONT_BODY,
  FONT_DISPLAY,
  FONT_LUXE,
  GOLD_GRADIENT,
  glassPanel,
  PRISM_BRIGHT,
  SOFT_SHADOW,
  textFill,
} from "../theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Stained glass blooms out of the centre, a frosted plaque settles on it, and the whole pane shatters at the end. */
export const Title: React.FC = () => {
  const frame = useCurrentFrame();

  const reveal = interpolate(frame, [0, 50], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const shatter = interpolate(frame, [100, 122], [0, 1], {
    ...clamp,
    easing: Easing.in(Easing.quad),
  });
  const plaque = interpolate(frame, [14, 46], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const textOut = interpolate(frame, [98, 114], [0, 1], {
    ...clamp,
    easing: Easing.in(Easing.quad),
  });
  const tag = useFadeUp(76, 24, 20, 98);

  return (
    <AbsoluteFill style={{ background: BG_VIOLET, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          rotate: `${interpolate(frame, [0, 120], [-3, 4])}deg`,
          scale: String(interpolate(frame, [0, 120], [1.16, 1.28])),
        }}
      >
        <StainedGlass
          width={1080}
          height={1920}
          count={150}
          seed="title"
          reveal={reveal}
          shatter={shatter}
          shimmer={frame / 70}
        />
      </AbsoluteFill>

      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            ...glassPanel("rgba(52, 28, 124, 0.66)"),
            width: 960,
            padding: "70px 0 74px",
            borderRadius: 48,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            opacity: plaque * (1 - textOut),
            scale: String(interpolate(plaque, [0, 1], [0.94, 1])),
            translate: `0 ${interpolate(textOut, [0, 1], [0, -40])}px`,
          }}
        >
          <Reveal
            at={22}
            style={{ display: "inline-block" }}
            innerStyle={{
              fontFamily: FONT_LUXE,
              fontWeight: 700,
              fontSize: 54,
              letterSpacing: "0.55em",
              marginRight: "-0.55em",
              ...textFill(GOLD_GRADIENT, `${frame * 0.6}% 0`),
            }}
          >
            THE
          </Reveal>

          <Reveal
            at={32}
            dur={34}
            style={{ display: "inline-block", marginTop: 14 }}
            innerStyle={{
              fontFamily: FONT_DISPLAY,
              fontWeight: 900,
              fontSize: 82,
              whiteSpace: "nowrap",
              filter: "drop-shadow(0 4px 14px rgba(24,8,80,0.5))",
              ...textFill(PRISM_BRIGHT, `${(frame * 0.9) % 100}% 0`, "260% 100%"),
            }}
          >
            KALEIDOSCOPE
          </Reveal>

          <Reveal
            at={46}
            dur={34}
            style={{ display: "inline-block", marginTop: 8 }}
            innerStyle={{
              fontFamily: FONT_LUXE,
              fontWeight: 800,
              fontSize: 118,
              letterSpacing: `${interpolate(frame, [46, 100], [0.3, 0.1], {
                ...clamp,
                easing: Easing.out(Easing.cubic),
              })}em`,
              marginRight: "-0.1em",
              whiteSpace: "nowrap",
              filter: "drop-shadow(0 4px 16px rgba(24,8,80,0.45))",
              ...textFill(GOLD_GRADIENT, `${interpolate(frame, [46, 130], [0, 80])}% 0`),
            }}
          >
            COLLECTIVE
          </Reveal>

          <div
            style={{
              marginTop: 40,
              width: 360,
              height: 3,
              background:
                "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.8) 50%, rgba(255,255,255,0))",
              scale: `${interpolate(frame, [66, 90], [0, 1], clamp)} 1`,
            }}
          />

          <div
            style={{
              marginTop: 36,
              fontFamily: FONT_BODY,
              fontWeight: 700,
              fontSize: 46,
              letterSpacing: "0.3em",
              marginRight: "-0.3em",
              color: "#fff",
              textShadow: SOFT_SHADOW,
              ...tag,
            }}
          >
            NEW AT TOP GRASS
          </div>
        </div>
      </AbsoluteFill>

      <ImpactFlash at={0} length={16} peak={0.22} />
    </AbsoluteFill>
  );
};
