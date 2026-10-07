import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { Vignette } from "../components/Effects";
import { StainedGlass } from "../components/StainedGlass";
import { cameraOn, cameraStyle, JARS, mixCamera, OVERVIEW } from "../jars";
import { FONT_BODY, FONT_DISPLAY } from "../theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const PER_STRAIN = 60;
const ZOOM = 1.9;

// Permanent Marker, the 1st-place winner, gets its own reveal after these.
const LINEUP = [JARS.blueZushi, JARS.mob, JARS.berryFloat];

const StrainCard: React.FC<{ index: number }> = ({ index }) => {
  const frame = useCurrentFrame();
  const strain = LINEUP[index];
  const cardIn = interpolate(frame, [6, 22], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const cardOut = interpolate(frame, [50, 60], [0, 1], {
    ...clamp,
    easing: Easing.in(Easing.cubic),
  });
  const count = interpolate(frame, [12, 34], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 190 }}>
      <div
        style={{
          width: 900,
          display: "flex",
          borderRadius: 34,
          overflow: "hidden",
          background: "rgba(10, 8, 14, 0.8)",
          border: `2px solid ${strain.color}99`,
          boxShadow: "0 30px 90px rgba(0,0,0,0.6)",
          opacity: cardIn * (1 - cardOut),
          translate: `0 ${interpolate(cardIn, [0, 1], [50, 0]) + cardOut * 30}px`,
        }}
      >
        <div style={{ position: "relative", width: 110, flexShrink: 0, overflow: "hidden" }}>
          <StainedGlass
            width={110}
            height={420}
            count={14}
            seed={`card${index}`}
            reveal={1}
            shimmer={0}
            leadWidth={4}
          />
        </div>
        <div style={{ padding: "38px 44px 42px", display: "flex", flexDirection: "column", gap: 14 }}>
          <div
            style={{
              fontFamily: FONT_BODY,
              fontWeight: 600,
              fontSize: 32,
              letterSpacing: "0.3em",
              color: "#cfc3a8",
            }}
          >
            KALEIDOSCOPE COLLECTIVE
          </div>
          <div
            style={{
              fontFamily: FONT_DISPLAY,
              fontWeight: 900,
              fontSize: 84,
              lineHeight: 1.02,
              color: "#fff",
            }}
          >
            {strain.name}
          </div>
          <div
            style={{
              fontFamily: FONT_BODY,
              fontWeight: 700,
              fontSize: 56,
              color: "#f5ecd6",
              display: "flex",
              alignItems: "baseline",
              gap: 16,
            }}
          >
            {strain.thc === null ? (
              <span style={{ fontSize: 44, letterSpacing: "0.12em" }}>NEW DROP</span>
            ) : (
              <>
                <span style={{ fontSize: 36, letterSpacing: "0.2em", color: "#cfc3a8" }}>THC</span>
                <span style={{ fontVariantNumeric: "tabular-nums" }}>
                  {(strain.thc * count).toFixed(1)}%
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** 16-22 s. The camera glides jar to jar, one card per strain, one per bar. */
export const Strains: React.FC = () => {
  const frame = useCurrentFrame();
  const k = Math.min(LINEUP.length - 1, Math.floor(frame / PER_STRAIN));
  const local = frame - k * PER_STRAIN;
  const from = k === 0 ? OVERVIEW : cameraOn(LINEUP[k - 1].x, LINEUP[k - 1].y, ZOOM);
  const to = cameraOn(LINEUP[k].x, LINEUP[k].y, ZOOM);
  const t = interpolate(local, [0, 18], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.65, 0, 0.35, 1),
  });
  const cam = mixCamera(from, to, t);
  cam.s *= 1 + 0.05 * interpolate(local, [18, 60], [0, 1], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      <Img
        src={staticFile("jars-still.jpg")}
        style={{ ...cameraStyle(cam), filter: "saturate(1.15) contrast(1.04)" }}
      />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(7,6,10,0.45) 0%, rgba(7,6,10,0) 22%, rgba(7,6,10,0) 55%, rgba(7,6,10,0.85) 100%)",
        }}
      />

      {LINEUP.map((s, i) => (
        <Sequence key={s.name} from={i * PER_STRAIN} durationInFrames={PER_STRAIN} layout="none">
          <StrainCard index={i} />
        </Sequence>
      ))}

      <Vignette strength={0.4} />
    </AbsoluteFill>
  );
};
