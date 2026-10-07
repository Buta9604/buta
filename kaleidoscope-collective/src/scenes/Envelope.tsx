import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { Vignette } from "../components/Effects";
import { cameraOn, cameraStyle, JARS, mixCamera } from "../jars";
import { FONT_BODY, FONT_LUXE, GOLD_GRADIENT, textFill } from "../theme";
import { BEAT } from "../timeline";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const Line: React.FC<{ at: number; children: React.ReactNode; style: React.CSSProperties }> = ({
  at,
  children,
  style,
}) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [at, at + 10], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  return (
    <div style={{ opacity: t, translate: `0 ${interpolate(t, [0, 1], [20, 0])}px`, ...style }}>
      {children}
    </div>
  );
};

/** 22-24 s. Under the drum roll: "And 1st place goes to..." */
export const Envelope: React.FC = () => {
  const frame = useCurrentFrame();
  const pm = JARS.permanentMarker;
  const cam = mixCamera(
    cameraOn(pm.x, pm.y, 1.3, -190),
    cameraOn(pm.x, pm.y, 1.6, -190),
    interpolate(frame, [0, 60], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) }),
  );
  const dots = Math.min(3, Math.max(0, Math.floor((frame - 2 * BEAT) / (BEAT / 2)) + 1));

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      <Img
        src={staticFile("jars-still.jpg")}
        style={{
          ...cameraStyle(cam),
          filter: "blur(18px) brightness(0.45) saturate(0.9)",
        }}
      />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 10,
          opacity: interpolate(frame, [54, 60], [1, 0], clamp),
        }}
      >
        <Line
          at={0}
          style={{
            fontFamily: FONT_BODY,
            fontWeight: 600,
            fontSize: 48,
            letterSpacing: "0.4em",
            marginRight: "-0.4em",
            color: "#f5ecd6",
          }}
        >
          AND
        </Line>
        <Line
          at={BEAT}
          style={{
            fontFamily: FONT_LUXE,
            fontWeight: 900,
            fontSize: 150,
            lineHeight: 1.05,
            ...textFill(GOLD_GRADIENT, `${frame * 1.5}% 0`),
            filter: "drop-shadow(0 0 24px rgba(255,200,90,0.35))",
          }}
        >
          1ST PLACE
        </Line>
        <Line
          at={2 * BEAT}
          style={{
            fontFamily: FONT_BODY,
            fontWeight: 600,
            fontSize: 48,
            letterSpacing: "0.4em",
            marginRight: "-0.4em",
            color: "#f5ecd6",
          }}
        >
          GOES TO{".".repeat(dots)}
          <span style={{ opacity: 0 }}>{".".repeat(3 - dots)}</span>
        </Line>
      </AbsoluteFill>
      <Vignette strength={0.7} />
    </AbsoluteFill>
  );
};
