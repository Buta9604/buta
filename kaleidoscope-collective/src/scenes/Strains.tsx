import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { GoldDust, PrismFlash, Sparkle, Vignette } from "../components/Effects";
import { StainedGlass } from "../components/StainedGlass";
import { FONT_BODY, FONT_DISPLAY, JEWELS } from "../theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const PER_STRAIN = 60;
const ZOOM = 1.9;

// Read straight off the jar labels in the footage. Berry Float's THC figure
// is not legible in the clip, so it is not shown.
const STRAINS = [
  { name: "BLUE ZUSHI", thc: 26.2, color: JEWELS[1], jar: { x: 420, y: 800 } },
  { name: "PERMANENT MARKER", thc: 26.7, color: JEWELS[4], jar: { x: 560, y: 1300 } },
  { name: "MOB", thc: 25.5, color: JEWELS[0], jar: { x: 880, y: 1380 } },
  { name: "BERRY FLOAT", thc: null, color: JEWELS[6], jar: { x: 220, y: 1190 } },
] as const;

const OVERVIEW = { x: 540, y: 960, s: 1.15 };

const clampCam = (x: number, y: number, s: number) => {
  const hw = 540 / s;
  const hh = 960 / s;
  return {
    x: Math.min(1080 - hw, Math.max(hw, x)),
    y: Math.min(1920 - hh, Math.max(hh, y + 80 / s)),
    s,
  };
};

const StrainCard: React.FC<{ index: number }> = ({ index }) => {
  const frame = useCurrentFrame();
  const strain = STRAINS[index];
  const cardIn = interpolate(frame, [6, 22], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const cardOut = interpolate(frame, [52, 60], [0, 1], {
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
          background: "rgba(10, 8, 14, 0.78)",
          border: `2px solid ${strain.color}aa`,
          boxShadow: `0 30px 90px rgba(0,0,0,0.65), 0 0 60px ${strain.color}55`,
          opacity: cardIn * (1 - cardOut),
          translate: `${interpolate(cardIn, [0, 1], [260, 0]) - cardOut * 260}px 0`,
        }}
      >
        <div style={{ position: "relative", width: 120, flexShrink: 0, overflow: "hidden" }}>
          <StainedGlass
            width={120}
            height={420}
            count={14}
            seed={`card${index}`}
            reveal={1}
            shimmer={frame / 30}
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
              color: strain.color,
              filter: "brightness(1.4)",
            }}
          >
            STRAIN {String(index + 1).padStart(2, "0")} / 04
          </div>
          <div
            style={{
              fontFamily: FONT_DISPLAY,
              fontWeight: 900,
              fontSize: strain.name.length > 12 ? 70 : 92,
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
              <span style={{ letterSpacing: "0.12em" }}>COMPLETE THE SET</span>
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

/** 16-24 s. The camera glides jar to jar, one card per strain, one per bar. */
export const Strains: React.FC = () => {
  const frame = useCurrentFrame();
  const k = Math.min(3, Math.floor(frame / PER_STRAIN));
  const local = frame - k * PER_STRAIN;
  const from = k === 0 ? OVERVIEW : clampCam(STRAINS[k - 1].jar.x, STRAINS[k - 1].jar.y, ZOOM);
  const to = clampCam(STRAINS[k].jar.x, STRAINS[k].jar.y, ZOOM);
  const t = interpolate(local, [0, 16], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.65, 0, 0.35, 1),
  });
  const drift = 1 + 0.07 * interpolate(local, [16, 60], [0, 1], clamp);
  const cam = {
    x: from.x + (to.x - from.x) * t,
    y: from.y + (to.y - from.y) * t,
    s: (from.s + (to.s - from.s) * t) * drift,
  };
  const moving = Math.sin(t * Math.PI);
  const jar = STRAINS[k].jar;
  const jarScreen = { x: 540 + (jar.x - cam.x) * cam.s, y: 960 + (jar.y - cam.y) * cam.s };

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
          translate: `${540 - cam.x * cam.s}px ${960 - cam.y * cam.s}px`,
          scale: String(cam.s),
          filter: `saturate(1.2) contrast(1.05) blur(${moving * 5}px)`,
        }}
      />

      {/* Strain-coloured light wash */}
      <AbsoluteFill
        style={{
          mixBlendMode: "soft-light",
          background: `radial-gradient(circle at ${jarScreen.x}px ${jarScreen.y}px, ${STRAINS[k].color}cc 0%, rgba(0,0,0,0) 55%)`,
          opacity: interpolate(local, [10, 24], [0, 1], clamp),
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(7,6,10,0.55) 0%, rgba(7,6,10,0) 22%, rgba(7,6,10,0) 55%, rgba(7,6,10,0.85) 100%)",
        }}
      />

      {[0, 1, 2].map((i) => (
        <Sparkle
          key={i}
          x={jarScreen.x + (i - 1) * 220}
          y={jarScreen.y - 240 + i * 90}
          size={90 - i * 20}
          progress={interpolate(local, [18 + i * 6, 40 + i * 6], [0, 1], clamp)}
        />
      ))}

      {STRAINS.map((s, i) => (
        <Sequence key={s.name} from={i * PER_STRAIN} durationInFrames={PER_STRAIN} layout="none">
          <StrainCard index={i} />
        </Sequence>
      ))}

      <GoldDust count={20} seed="strains" opacity={0.5} />
      <Vignette strength={0.45} />
      {[60, 120, 180].map((at) => (
        <PrismFlash key={at} at={at} length={12} />
      ))}
    </AbsoluteFill>
  );
};
