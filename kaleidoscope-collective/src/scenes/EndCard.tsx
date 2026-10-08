import { AbsoluteFill, Easing, interpolate } from "remotion";
import { GoldDust, GoldLogo, ImpactFlash, LightRays, Vignette } from "../components/Effects";
import { Reveal, useFadeUp } from "../components/Reveal";
import { useCurrentFrame } from "../time";
import {
  BG_VIOLET,
  FONT_BODY,
  FONT_DISPLAY,
  FONT_LUXE,
  GOLD_GRADIENT,
  PRISM_BRIGHT,
  SOFT_SHADOW,
  textFill,
} from "../theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const Pin: React.FC = () => (
  <svg width={52} height={68} viewBox="0 0 24 32">
    <path
      d="M12 0C5.4 0 0 5.2 0 11.7 0 20.4 12 32 12 32s12-11.6 12-20.3C24 5.2 18.6 0 12 0zm0 16.4a4.8 4.8 0 1 1 0-9.6 4.8 4.8 0 0 1 0 9.6z"
      fill="#f3d98a"
    />
  </svg>
);

/** Logo, product, address, and the 21+ notice. */
export const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const logoIn = interpolate(frame, [0, 34], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const pill = useFadeUp(52, 26, 24);
  const address = useFadeUp(66, 26, 24);
  const legal = useFadeUp(86, 30, 14);
  const bob = Math.sin(frame / 26) * 6;

  return (
    <AbsoluteFill style={{ background: BG_VIOLET, overflow: "hidden" }}>
      <LightRays y="24%" opacity={0.6} speed={0.08} />
      <GoldDust count={30} seed="end" opacity={0.5} drift={0.5} />

      <AbsoluteFill style={{ alignItems: "center", paddingTop: 190 }}>
        <div
          style={{
            opacity: logoIn,
            scale: String(interpolate(logoIn, [0, 1], [1.1, 1])),
            translate: `0 ${bob}px`,
          }}
        >
          <GoldLogo
            size={520}
            sheen={interpolate(frame % 110, [14, 70], [0, 1], clamp)}
            glow={0.9}
          />
        </div>

        <Reveal
          at={18}
          dur={34}
          style={{ marginTop: 26 }}
          innerStyle={{
            fontFamily: FONT_LUXE,
            fontWeight: 800,
            fontSize: 136,
            letterSpacing: "0.1em",
            marginRight: "-0.1em",
            whiteSpace: "nowrap",
            filter: "drop-shadow(0 4px 20px rgba(30,10,90,0.5))",
            ...textFill(GOLD_GRADIENT, `${frame * 0.5}% 0`),
          }}
        >
          TOP GRASS
        </Reveal>

        <Reveal
          at={32}
          dur={30}
          style={{ marginTop: 6 }}
          innerStyle={{
            fontFamily: FONT_DISPLAY,
            fontWeight: 800,
            fontSize: 56,
            lineHeight: 1.16,
            textAlign: "center",
            filter: "drop-shadow(0 3px 12px rgba(30,10,90,0.5))",
            ...textFill(PRISM_BRIGHT, `${(frame * 0.7) % 100}% 0`, "250% 100%"),
          }}
        >
          THE KALEIDOSCOPE
          <br />
          COLLECTIVE
        </Reveal>

        <div
          style={{
            marginTop: 50,
            padding: "22px 56px",
            borderRadius: 999,
            background: GOLD_GRADIENT,
            backgroundSize: "300% 100%",
            backgroundPosition: `${frame * 0.6}% 0`,
            fontFamily: FONT_BODY,
            fontWeight: 700,
            fontSize: 48,
            letterSpacing: "0.24em",
            color: "#2a1a05",
            boxShadow: "0 14px 44px rgba(233,196,92,0.4)",
            ...pill,
          }}
        >
          AVAILABLE NOW
        </div>

        <div
          style={{
            marginTop: 70,
            display: "flex",
            alignItems: "center",
            gap: 26,
            ...address,
          }}
        >
          <Pin />
          <div style={{ fontFamily: FONT_BODY, color: "#fff", lineHeight: 1.2, textShadow: SOFT_SHADOW }}>
            <div style={{ fontWeight: 700, fontSize: 64 }}>28 Sawgrass Drive</div>
            <div style={{ fontWeight: 500, fontSize: 52, color: "#f1e7c6" }}>Bellport, NY 11713</div>
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill
        style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 120, ...legal }}
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
            color: "#e8e0ff",
          }}
        >
          <div
            style={{
              flexShrink: 0,
              width: 88,
              height: 88,
              borderRadius: 44,
              border: "5px solid #ff4d66",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontWeight: 800,
              fontSize: 34,
              color: "#fff",
            }}
          >
            21+
          </div>
          <div>
            For use only by adults 21 and older. Keep out of reach of children and pets. In case of
            accidental ingestion or overconsumption, call Poison Control at 1-800-222-1222 or
            9-1-1. Please consume responsibly.
          </div>
        </div>
      </AbsoluteFill>

      <Vignette strength={0.18} />
      <ImpactFlash at={0} length={16} peak={0.25} />
    </AbsoluteFill>
  );
};
