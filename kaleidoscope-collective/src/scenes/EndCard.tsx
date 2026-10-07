import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { GoldDust, GoldLogo, ImpactFlash } from "../components/Effects";
import {
  FONT_BODY,
  FONT_DISPLAY,
  FONT_LUXE,
  GOLD_GRADIENT,
  INK,
  PRISM_GRADIENT,
  textFill,
} from "../theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const rise = (frame: number, at: number) => {
  const t = interpolate(frame, [at, at + 16], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  return { opacity: t, translate: `0 ${interpolate(t, [0, 1], [36, 0])}px` };
};

const Pin: React.FC = () => (
  <svg width={50} height={66} viewBox="0 0 24 32">
    <path
      d="M12 0C5.4 0 0 5.2 0 11.7 0 20.4 12 32 12 32s12-11.6 12-20.3C24 5.2 18.6 0 12 0zm0 16.4a4.8 4.8 0 1 1 0-9.6 4.8 4.8 0 0 1 0 9.6z"
      fill="#e9c45c"
    />
  </svg>
);

/** 34-40 s. Logo, product, address, and the 21+ notice. */
export const EndCard: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: INK, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 80% 45% at 50% 28%, #241b0a 0%, ${INK} 100%)`,
        }}
      />
      <GoldDust count={30} seed="end" opacity={0.45} drift={0.5} />

      <AbsoluteFill style={{ alignItems: "center", paddingTop: 210 }}>
        <div
          style={{
            opacity: interpolate(frame, [0, 14], [0, 1], clamp),
            scale: String(
              interpolate(frame, [0, 26], [1.08, 1], {
                ...clamp,
                easing: Easing.bezier(0.16, 1, 0.3, 1),
              }),
            ),
          }}
        >
          <GoldLogo
            size={520}
            sheen={interpolate(frame % 90, [10, 60], [0, 1], clamp)}
            glow={0.8}
          />
        </div>

        <div
          style={{
            marginTop: 26,
            fontFamily: FONT_LUXE,
            fontWeight: 800,
            fontSize: 132,
            letterSpacing: "0.1em",
            marginRight: "-0.1em",
            ...textFill(GOLD_GRADIENT, `${frame * 0.8}% 0`),
            filter: "drop-shadow(0 0 26px rgba(255,200,90,0.35))",
            ...rise(frame, 6),
          }}
        >
          TOP GRASS
        </div>

        <div
          style={{
            marginTop: 8,
            fontFamily: FONT_DISPLAY,
            fontWeight: 800,
            fontSize: 58,
            letterSpacing: "0.02em",
            textAlign: "center",
            lineHeight: 1.15,
            ...textFill(PRISM_GRADIENT, `${(frame * 1.2) % 100}% 0`, "250% 100%"),
            ...rise(frame, 14),
          }}
        >
          THE KALEIDOSCOPE COLLECTIVE
        </div>

        <div
          style={{
            marginTop: 48,
            padding: "22px 52px",
            borderRadius: 999,
            background: GOLD_GRADIENT,
            backgroundSize: "300% 100%",
            backgroundPosition: `${frame}% 0`,
            fontFamily: FONT_BODY,
            fontWeight: 700,
            fontSize: 48,
            letterSpacing: "0.24em",
            color: "#1a1206",
            boxShadow: "0 12px 40px rgba(233,196,92,0.35)",
            ...rise(frame, 22),
          }}
        >
          AVAILABLE NOW
        </div>

        <div
          style={{
            marginTop: 76,
            display: "flex",
            alignItems: "center",
            gap: 24,
            ...rise(frame, 30),
          }}
        >
          <Pin />
          <div style={{ fontFamily: FONT_BODY, color: "#f5ecd6", lineHeight: 1.2 }}>
            <div style={{ fontWeight: 700, fontSize: 64 }}>28 Sawgrass Drive</div>
            <div style={{ fontWeight: 500, fontSize: 52, color: "#d8c9a4" }}>
              Bellport, NY 11713
            </div>
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          justifyContent: "flex-end",
          alignItems: "center",
          paddingBottom: 120,
          ...rise(frame, 40),
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 22,
            width: 920,
            fontFamily: FONT_BODY,
            fontSize: 28,
            lineHeight: 1.35,
            color: "#bdb19a",
          }}
        >
          <div
            style={{
              flexShrink: 0,
              width: 86,
              height: 86,
              borderRadius: 43,
              border: "5px solid #e8243c",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontWeight: 800,
              fontSize: 34,
              color: "#f5ecd6",
            }}
          >
            21+
          </div>
          <div>
            For use only by adults 21 and older. Keep out of reach of children and
            pets. In case of accidental ingestion or overconsumption, call Poison
            Control at 1-800-222-1222 or 9-1-1. Please consume responsibly.
          </div>
        </div>
      </AbsoluteFill>

      <ImpactFlash at={0} length={14} peak={0.3} />
    </AbsoluteFill>
  );
};
