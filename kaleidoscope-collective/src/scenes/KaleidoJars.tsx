import { AbsoluteFill, Easing, Img, interpolate, staticFile } from "remotion";
import { Kaleidoscope } from "../components/Kaleidoscope";
import { Vignette } from "../components/Effects";
import { Reveal } from "../components/Reveal";
import { useCurrentFrame } from "../time";
import { FONT_DISPLAY, glassPanel, PRISM_BRIGHT, SOFT_SHADOW, textFill } from "../theme";
import { FOOTAGE } from "../timeline";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/**
 * The jar footage folded into a slowly turning live kaleidoscope with a
 * frosted caption, then an iris opens onto the real jars.
 */
export const KaleidoJars: React.FC = () => {
  const frame = useCurrentFrame();
  const iris = interpolate(frame, [82, 118], [0, 1250], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const plaque = interpolate(frame, [6, 34], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const plaqueOut = interpolate(frame, [74, 90], [0, 1], {
    ...clamp,
    easing: Easing.in(Easing.quad),
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#2b1a74", overflow: "hidden" }}>
      <AbsoluteFill style={{ scale: String(interpolate(frame, [0, 120], [1.0, 1.08])) }}>
        <Kaleidoscope
          sourceFrom={FOOTAGE.jars}
          sourceTo={FOOTAGE.jars + 70}
          speed={0.6}
          segments={12}
          cx={373}
          cy={700}
          zoom={interpolate(frame, [0, 120], [1.25, 1.9])}
          rotation={frame * 0.5}
          sourceRotation={-frame * 0.25}
          style={{ filter: "saturate(1.35) contrast(1.06) brightness(1.08)" }}
        />
      </AbsoluteFill>

      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            ...glassPanel("rgba(48, 24, 120, 0.7)"),
            padding: "56px 70px 64px",
            borderRadius: 48,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            opacity: plaque * (1 - plaqueOut),
            scale: String(interpolate(plaque, [0, 1], [0.94, 1])),
            translate: `0 ${-plaqueOut * 36}px`,
          }}
        >
          <Reveal
            at={14}
            style={{ display: "inline-block" }}
            innerStyle={{
              fontFamily: FONT_DISPLAY,
              fontWeight: 900,
              fontSize: 88,
              lineHeight: 1.08,
              color: "#fff",
              textShadow: SOFT_SHADOW,
              whiteSpace: "nowrap",
            }}
          >
            FOUR STRAINS.
          </Reveal>
          <Reveal
            at={30}
            dur={32}
            style={{ display: "inline-block", marginTop: 6 }}
            innerStyle={{
              fontFamily: FONT_DISPLAY,
              fontWeight: 900,
              fontSize: 120,
              lineHeight: 1.08,
              whiteSpace: "nowrap",
              filter: "drop-shadow(0 4px 14px rgba(24,8,80,0.5))",
              ...textFill(PRISM_BRIGHT, `${(frame * 0.8) % 100}% 0`, "300% 100%"),
            }}
          >
            INFINITE
          </Reveal>
          <Reveal
            at={42}
            dur={32}
            style={{ display: "inline-block" }}
            innerStyle={{
              fontFamily: FONT_DISPLAY,
              fontWeight: 900,
              fontSize: 120,
              lineHeight: 1.08,
              whiteSpace: "nowrap",
              filter: "drop-shadow(0 4px 14px rgba(24,8,80,0.5))",
              ...textFill(PRISM_BRIGHT, `${(40 + frame * 0.8) % 100}% 0`, "300% 100%"),
            }}
          >
            COLOR.
          </Reveal>
        </div>
      </AbsoluteFill>

      <AbsoluteFill style={{ clipPath: `circle(${iris}px at 50% 52%)` }}>
        <Img
          src={staticFile("jars-still.jpg")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            scale: String(interpolate(frame, [82, 120], [1.3, 1.14], clamp)),
            filter: "saturate(1.12) brightness(1.04)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "52%",
            width: iris * 2,
            height: iris * 2,
            translate: "-50% -50%",
            borderRadius: "50%",
            boxShadow:
              "inset 0 0 0 8px rgba(255,236,170,0.9), inset 0 0 60px rgba(255,200,90,0.7)",
            opacity: interpolate(frame, [102, 118], [1, 0], clamp),
          }}
        />
      </AbsoluteFill>

      <Vignette strength={0.12} />
    </AbsoluteFill>
  );
};
