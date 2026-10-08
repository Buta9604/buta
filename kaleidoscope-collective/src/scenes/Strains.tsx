import { AbsoluteFill, Easing, Img, interpolate, staticFile } from "remotion";
import { Vignette } from "../components/Effects";
import { Reveal } from "../components/Reveal";
import { StainedGlass } from "../components/StainedGlass";
import { cameraOn, cameraStyle, JARS, mixCamera, OVERVIEW } from "../jars";
import { useCurrentFrame } from "../time";
import { FONT_BODY, FONT_DISPLAY, glassPanel, SOFT_SHADOW } from "../theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const PER_STRAIN = 60;
const ZOOM = 1.85;

// Permanent Marker, the 1st-place winner, gets its own reveal after these.
const LINEUP = [JARS.blueZushi, JARS.mob, JARS.berryFloat];

const StrainCard: React.FC<{ index: number }> = ({ index }) => {
  const frame = useCurrentFrame();
  const strain = LINEUP[index];
  const t = frame - index * PER_STRAIN;
  const cardIn = interpolate(t, [18, 44], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const cardOut = interpolate(t, [52, 64], [0, 1], {
    ...clamp,
    easing: Easing.in(Easing.quad),
  });
  const count = interpolate(t, [28, 54], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const base = index * PER_STRAIN;

  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 170 }}>
      <div
        style={{
          ...glassPanel("rgba(54, 30, 128, 0.5)"),
          width: 960,
          display: "flex",
          borderRadius: 38,
          overflow: "hidden",
          opacity: cardIn * (1 - cardOut),
          translate: `0 ${interpolate(cardIn, [0, 1], [60, 0]) + cardOut * 24}px`,
        }}
      >
        <div style={{ position: "relative", width: 110, flexShrink: 0, overflow: "hidden" }}>
          <StainedGlass
            width={110}
            height={430}
            count={14}
            seed={`card${index}`}
            reveal={1}
            shimmer={0}
            leadWidth={4}
          />
        </div>
        <div style={{ padding: "40px 44px 44px", display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              fontFamily: FONT_BODY,
              fontWeight: 700,
              fontSize: 34,
              letterSpacing: "0.28em",
              color: "#e4dcff",
              opacity: interpolate(t, [20, 36], [0, 1], clamp),
            }}
          >
            KALEIDOSCOPE COLLECTIVE
          </div>
          <Reveal
            at={base + 24}
            dur={30}
            style={{ alignSelf: "flex-start" }}
            innerStyle={{
              fontFamily: FONT_DISPLAY,
              fontWeight: 900,
              fontSize: 84,
              lineHeight: 1.05,
              color: "#fff",
              whiteSpace: "nowrap",
              textShadow: SOFT_SHADOW,
            }}
          >
            {strain.name}
          </Reveal>
          <div
            style={{
              fontFamily: FONT_BODY,
              fontWeight: 700,
              fontSize: 60,
              color: "#fff",
              display: "flex",
              alignItems: "baseline",
              gap: 18,
              opacity: interpolate(t, [30, 44], [0, 1], clamp),
              textShadow: SOFT_SHADOW,
            }}
          >
            {strain.thc === null ? (
              <span style={{ fontSize: 48, letterSpacing: "0.14em" }}>NEW DROP</span>
            ) : (
              <>
                <span style={{ fontSize: 38, letterSpacing: "0.2em", color: "#e4dcff" }}>THC</span>
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

/** The camera glides jar to jar, one card per strain, one per bar. */
export const Strains: React.FC = () => {
  const frame = useCurrentFrame();
  const k = Math.max(0, Math.min(LINEUP.length - 1, Math.floor(frame / PER_STRAIN)));
  const local = frame - k * PER_STRAIN;
  const from = k === 0 ? OVERVIEW : cameraOn(LINEUP[k - 1].x, LINEUP[k - 1].y, ZOOM);
  const to = cameraOn(LINEUP[k].x, LINEUP[k].y, ZOOM);
  const t = interpolate(local, [0, 40], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.45, 0, 0.25, 1),
  });
  const cam = mixCamera(from, to, t);
  const travel = Math.sin(t * Math.PI);
  // pull back a little mid-move so the glide reads slower, then ease in
  cam.s *= (1 - 0.2 * travel) * (1 + 0.05 * interpolate(local, [40, 60], [0, 1], clamp));
  const sway = Math.sin(frame / 38) * 0.5;

  return (
    <AbsoluteFill style={{ backgroundColor: "#2b1a74", overflow: "hidden" }}>
      <Img
        src={staticFile("jars-still.jpg")}
        style={{
          ...cameraStyle(cam),
          rotate: `${sway}deg`,
          filter: `saturate(1.15) contrast(1.03) brightness(1.05) blur(${travel * 3.5}px)`,
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(54,30,128,0) 58%, rgba(54,30,128,0.38) 100%)",
        }}
      />
      <StrainCard index={k} />
      <Vignette strength={0.12} />
    </AbsoluteFill>
  );
};
