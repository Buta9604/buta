import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  random,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { ImpactFlash, Vignette } from "../components/Effects";
import { FONT_BODY, FONT_LUXE, GOLD_GRADIENT, JEWELS, textFill } from "../theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** 30-32 s. Punch into the High Times Cannabis Cup lid with a confetti burst. */
export const Cup: React.FC = () => {
  const frame = useCurrentFrame();
  const s = interpolate(frame, [0, 60], [2.2, 2.75], {
    ...clamp,
    easing: Easing.out(Easing.quad),
  });
  const lid = { x: Math.min(1080 - 540 / s, 905), y: 1100 };
  const badge = interpolate(frame, [2, 16], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.34, 1.56, 0.64, 1),
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      <Img
        src={staticFile("jars-still.jpg")}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 1080,
          height: 1920,
          transformOrigin: "0 0",
          translate: `${540 - lid.x * s}px ${1180 - lid.y * s}px`,
          scale: String(s),
          rotate: `${interpolate(frame, [0, 60], [-3, 2])}deg`,
          filter: "saturate(1.25) contrast(1.05)",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(7,6,10,0.92) 0%, rgba(7,6,10,0.6) 30%, rgba(7,6,10,0) 50%)",
        }}
      />

      {/* Confetti of glass shards */}
      {new Array(46).fill(0).map((_, i) => {
        const angle = random(`ca${i}`) * Math.PI * 2;
        const v = 18 + random(`cv${i}`) * 34;
        const t = Math.max(0, frame - 2);
        const x = 540 + Math.cos(angle) * v * t;
        const y = 1180 + Math.sin(angle) * v * t + 0.9 * t * t;
        const size = 14 + random(`cs${i}`) * 26;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: size,
              height: size * 0.6,
              background: JEWELS[i % JEWELS.length],
              rotate: `${t * (random(`cr${i}`) * 30 - 15)}deg`,
              clipPath: "polygon(0 0, 100% 20%, 70% 100%, 10% 80%)",
              opacity: interpolate(frame, [40, 58], [1, 0], clamp),
            }}
          />
        );
      })}

      <AbsoluteFill
        style={{
          alignItems: "center",
          paddingTop: 230,
          opacity: badge,
          scale: String(interpolate(badge, [0, 1], [0.6, 1])),
        }}
      >
        <div
          style={{
            fontFamily: FONT_BODY,
            fontWeight: 700,
            fontSize: 40,
            letterSpacing: "0.4em",
            marginRight: "-0.4em",
            color: "#f5ecd6",
          }}
        >
          HIGH TIMES · NEW YORK
        </div>
        <div
          style={{
            marginTop: 14,
            fontFamily: FONT_LUXE,
            fontWeight: 900,
            fontSize: 118,
            lineHeight: 1,
            textAlign: "center",
            ...textFill(GOLD_GRADIENT, `${frame * 2}% 0`),
            filter: "drop-shadow(0 0 30px rgba(255,200,90,0.5))",
          }}
        >
          CANNABIS
          <br />
          CUP WINNER
        </div>
      </AbsoluteFill>

      <Vignette strength={0.5} />
      <ImpactFlash at={0} length={10} color="#ffe9a8" />
    </AbsoluteFill>
  );
};
