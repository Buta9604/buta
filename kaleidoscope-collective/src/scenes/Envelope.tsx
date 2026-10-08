import { AbsoluteFill, Easing, Img, interpolate, staticFile } from "remotion";
import { Vignette } from "../components/Effects";
import { Reveal } from "../components/Reveal";
import { cameraOn, cameraStyle, JARS, mixCamera } from "../jars";
import { useCurrentFrame } from "../time";
import { FONT_BODY, FONT_LUXE, GOLD_GRADIENT, SOFT_SHADOW, textFill } from "../theme";
import { BEAT } from "../timeline";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Under the drum roll: "And 1st place goes to..." */
export const Envelope: React.FC = () => {
  const frame = useCurrentFrame();
  const pm = JARS.permanentMarker;
  const cam = mixCamera(
    cameraOn(pm.x, pm.y, 1.3, -190),
    cameraOn(pm.x, pm.y, 1.6, -190),
    interpolate(frame, [0, 60], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) }),
  );
  const dots = Math.min(3, Math.max(0, Math.floor((frame - 2 * BEAT) / (BEAT / 2)) + 1));
  const glow = 0.5 + 0.5 * Math.sin(frame / 5);

  return (
    <AbsoluteFill style={{ backgroundColor: "#3a2a7a", overflow: "hidden" }}>
      <Img
        src={staticFile("jars-still.jpg")}
        style={{
          ...cameraStyle(cam),
          filter: "blur(20px) saturate(1.4) brightness(0.95)",
        }}
      />
      <AbsoluteFill style={{ background: "rgba(80, 48, 170, 0.38)" }} />
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 50%, rgba(255,214,120,${0.12 + glow * 0.1}) 0%, rgba(255,214,120,0) 55%)`,
        }}
      />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 14,
        }}
      >
        <Reveal
          at={0}
          dur={20}
          innerStyle={{
            fontFamily: FONT_BODY,
            fontWeight: 700,
            fontSize: 56,
            letterSpacing: "0.4em",
            marginRight: "-0.4em",
            color: "#fff",
            textShadow: SOFT_SHADOW,
          }}
        >
          AND
        </Reveal>
        <Reveal
          at={BEAT * 0.8}
          dur={30}
          innerStyle={{
            fontFamily: FONT_LUXE,
            fontWeight: 900,
            fontSize: 168,
            lineHeight: 1.05,
            whiteSpace: "nowrap",
            filter: "drop-shadow(0 6px 24px rgba(30,10,90,0.55))",
            ...textFill(GOLD_GRADIENT, `${frame * 1.4}% 0`),
          }}
        >
          1ST PLACE
        </Reveal>
        <Reveal
          at={BEAT * 2}
          dur={24}
          innerStyle={{
            fontFamily: FONT_BODY,
            fontWeight: 700,
            fontSize: 56,
            letterSpacing: "0.34em",
            color: "#fff",
            textShadow: SOFT_SHADOW,
            whiteSpace: "nowrap",
          }}
        >
          GOES TO{".".repeat(dots)}
          <span style={{ opacity: 0 }}>{".".repeat(3 - dots)}</span>
        </Reveal>
      </AbsoluteFill>

      <Vignette strength={0.12} />
    </AbsoluteFill>
  );
};
