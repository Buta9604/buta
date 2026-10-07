import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { GoldDust, Vignette } from "../components/Effects";
import { Kaleidoscope } from "../components/Kaleidoscope";
import { FONT_DISPLAY, PRISM_GRADIENT, textFill } from "../theme";
import { BEAT, FOOTAGE } from "../timeline";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const SEGMENTS = [8, 12, 10, 16, 12, 14, 8, 12];

/**
 * 12-16 s. The jar footage folded into a live kaleidoscope that changes shape
 * on every beat, then irises open onto the real jars.
 */
export const KaleidoJars: React.FC = () => {
  const frame = useCurrentFrame();
  const beat = Math.floor(frame / BEAT);
  const sinceBeat = frame % BEAT;
  const punch = interpolate(sinceBeat, [0, 10], [1.12, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });

  const iris = interpolate(frame, [84, 116], [0, 1200], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ scale: String(punch) }}>
        <Kaleidoscope
          sourceFrom={FOOTAGE.jars}
          sourceTo={FOOTAGE.jars + 70}
          speed={0.7}
          segments={SEGMENTS[beat % SEGMENTS.length]}
          cx={373}
          cy={700}
          zoom={interpolate(frame, [0, 120], [1.25, 2.1])}
          rotation={frame * 1.1}
          sourceRotation={-frame * 0.6}
          style={{ filter: "saturate(1.4) contrast(1.1)" }}
        />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(0,0,0,0.0) 0%, rgba(0,0,0,0.55) 70%)",
        }}
      />
      <AbsoluteFill
        style={{
          opacity: interpolate(frame, [4, 14, 80, 92], [0, 1, 1, 0], clamp),
          background:
            "radial-gradient(ellipse 70% 22% at 50% 50%, rgba(6,5,10,0.85) 0%, rgba(6,5,10,0.6) 55%, rgba(6,5,10,0) 100%)",
        }}
      />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 10,
          opacity: interpolate(frame, [80, 92], [1, 0], clamp),
        }}
      >
        {[
          { text: "FOUR STRAINS.", at: 8, size: 92 },
          { text: "INFINITE", at: 38, size: 140 },
          { text: "COLOR.", at: 46, size: 160 },
        ].map(({ text, at, size }) => {
          const t = interpolate(frame, [at, at + 12], [0, 1], {
            ...clamp,
            easing: Easing.bezier(0.34, 1.56, 0.64, 1),
          });
          return (
            <div
              key={text}
              style={{
                fontFamily: FONT_DISPLAY,
                fontWeight: 900,
                fontSize: size,
                lineHeight: 1.02,
                opacity: Math.min(1, t * 2),
                scale: String(interpolate(t, [0, 1], [1.6, 1])),
                filter: `blur(${interpolate(t, [0, 1], [10, 0])}px) drop-shadow(0 8px 30px rgba(0,0,0,0.85))`,
                ...(text === "FOUR STRAINS."
                  ? { color: "#fff" }
                  : textFill(PRISM_GRADIENT, `${(frame * 2) % 100}% 0`, "500% 100%")),
              }}
            >
              {text}
            </div>
          );
        })}
      </AbsoluteFill>

      {/* Iris reveal onto the real jars */}
      <AbsoluteFill
        style={{
          clipPath: `circle(${iris}px at 50% 52%)`,
        }}
      >
        <Img
          src={staticFile("jars-still.jpg")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            scale: String(interpolate(frame, [84, 120], [1.35, 1.15], clamp)),
            filter: "saturate(1.15)",
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
            boxShadow: "inset 0 0 0 10px rgba(255,236,170,0.9), inset 0 0 60px rgba(255,200,90,0.8)",
            opacity: interpolate(frame, [104, 118], [1, 0], clamp),
          }}
        />
      </AbsoluteFill>

      <GoldDust count={24} seed="kj" opacity={0.7} drift={1.5} />
      <Vignette strength={0.5} />
    </AbsoluteFill>
  );
};
