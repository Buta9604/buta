import { Video } from "@remotion/media";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { ImpactFlash, PrismFlash, Vignette } from "../components/Effects";
import { Kaleidoscope } from "../components/Kaleidoscope";
import { FONT_BODY, FONT_DISPLAY, JEWELS } from "../theme";
import { BEAT, FOOTAGE } from "../timeline";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const Reticle: React.FC<{ opacity: number }> = ({ opacity }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ opacity, pointerEvents: "none" }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920">
        <g stroke="#e9fff6" strokeWidth={3} fill="none" opacity={0.85}>
          <circle cx={540} cy={960} r={330} strokeDasharray="6 14" transform={`rotate(${frame * 0.6} 540 960)`} />
          <circle cx={540} cy={960} r={420} opacity={0.5} />
          <line x1={540} y1={560} x2={540} y2={880} />
          <line x1={540} y1={1040} x2={540} y2={1360} />
          <line x1={140} y1={960} x2={460} y2={960} />
          <line x1={620} y1={960} x2={940} y2={960} />
          {new Array(21).fill(0).map((_, i) => (
            <line key={i} x1={340 + i * 20} y1={1500} x2={340 + i * 20} y2={i % 5 === 0 ? 1530 : 1515} />
          ))}
          <path d="M90 230 h90 M90 230 v90 M990 230 h-90 M990 230 v90 M90 1690 h90 M90 1690 v-90 M990 1690 h-90 M990 1690 v-90" strokeWidth={5} />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

const BigWord: React.FC<{ text: string; color: string }> = ({ text, color }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [0, 8], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.34, 1.56, 0.64, 1),
  });
  const out = interpolate(frame, [26, 30], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div
        style={{
          fontFamily: FONT_DISPLAY,
          fontWeight: 900,
          fontSize: Math.min(160, Math.floor(940 / (text.length * 0.95))),
          color: "#fff",
          letterSpacing: "-0.01em",
          scale: String(interpolate(t, [0, 1], [2.2, 1]) * (1 + out * 0.3)),
          opacity: Math.min(1, t * 2) * (1 - out),
          textShadow: `0 0 40px ${color}, 0 0 90px ${color}, 0 10px 30px rgba(0,0,0,0.8)`,
          WebkitTextStroke: `3px ${color}`,
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};

/**
 * 24-30 s, the drop. Through the AmScope onto the trichomes, which then
 * fold into a kaleidoscope pulsing with the beat.
 */
export const Scope: React.FC = () => {
  const frame = useCurrentFrame();
  const kStart = 40;
  const sinceBeat = (frame - kStart) % BEAT;
  const punch = frame >= kStart ? interpolate(sinceBeat, [0, 9], [1.1, 1], { ...clamp, easing: Easing.out(Easing.cubic) }) : 1;
  const kOpacity = interpolate(frame, [kStart - 6, kStart, 160, 168], [0, 1, 1, 0], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      {/* Real footage: microscope camera, then the monitor */}
      <AbsoluteFill
        style={{
          scale: String(interpolate(frame, [0, 40], [1.05, 1.32], clamp)),
          filter: "saturate(1.25) contrast(1.08)",
        }}
      >
        <Video
          src={staticFile("footage.mp4")}
          trimBefore={FOOTAGE.microscope + 10}
          playbackRate={1.2}
          muted
          objectFit="cover"
          style={{ width: "100%", height: "100%" }}
        />
      </AbsoluteFill>

      <AbsoluteFill style={{ opacity: kOpacity, scale: String(punch) }}>
        <Kaleidoscope
          sourceFrom={FOOTAGE.trichomes + 10}
          sourceTo={FOOTAGE.last}
          speed={1}
          segments={frame < 100 ? 10 : 14}
          cx={360}
          cy={560}
          zoom={interpolate(frame, [kStart, 168], [1.4, 2.4], clamp)}
          rotation={-frame * 0.9}
          sourceRotation={frame * 0.4}
          style={{ filter: "saturate(1.6) contrast(1.15) brightness(1.05)" }}
        />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          mixBlendMode: "color",
          opacity: kOpacity * 0.35,
          background: `conic-gradient(from ${frame * 3}deg at 50% 50%, ${[...JEWELS, JEWELS[0]].join(", ")})`,
        }}
      />

      <Reticle opacity={interpolate(frame, [4, 14, 34, 42], [0, 1, 1, 0], clamp)} />
      <AbsoluteFill
        style={{
          alignItems: "center",
          paddingTop: 300,
          opacity: interpolate(frame, [4, 14, 34, 42], [0, 1, 1, 0], clamp),
        }}
      >
        <div
          style={{
            fontFamily: FONT_BODY,
            fontWeight: 700,
            fontSize: 44,
            letterSpacing: "0.35em",
            color: "#e9fff6",
            display: "flex",
            alignItems: "center",
            gap: 18,
          }}
        >
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: 11,
              background: "#ff3b3b",
              opacity: Math.floor(frame / 6) % 2 ? 1 : 0.2,
            }}
          />
          UNDER THE SCOPE
        </div>
      </AbsoluteFill>

      {[
        { text: "FROSTED", at: kStart + 2, color: JEWELS[5] },
        { text: "PURPLE", at: kStart + 32, color: JEWELS[4] },
        { text: "PRISMATIC", at: kStart + 62, color: JEWELS[6] },
      ].map((w) => (
        <Sequence key={w.text} from={w.at} durationInFrames={30} layout="none">
          <BigWord text={w.text} color={w.color} />
        </Sequence>
      ))}

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          opacity: interpolate(frame, [134, 142, 164, 170], [0, 1, 1, 0], clamp),
        }}
      >
        <div
          style={{
            padding: "22px 46px",
            borderRadius: 999,
            background: "rgba(8,6,12,0.75)",
            border: "2px solid rgba(255,255,255,0.35)",
            fontFamily: FONT_BODY,
            fontWeight: 700,
            fontSize: 50,
            letterSpacing: "0.25em",
            color: "#fff",
          }}
        >
          LOOK CLOSER
        </div>
      </AbsoluteFill>

      <Vignette strength={0.6} />
      <ImpactFlash at={0} length={10} />
      <PrismFlash at={kStart} length={12} />
    </AbsoluteFill>
  );
};
