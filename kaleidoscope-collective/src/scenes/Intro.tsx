import { AbsoluteFill, Easing, Img, interpolate, staticFile } from "remotion";
import { GoldDust, GoldLogo, LightRays, Vignette } from "../components/Effects";
import { Reveal, useFadeUp } from "../components/Reveal";
import { useCurrentFrame } from "../time";
import { BG_VIOLET, FONT_BODY, FONT_LUXE, GOLD_GRADIENT, SOFT_SHADOW, textFill } from "../theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Where the finished logo sits, and how big it is.
const LOGO = { x: 540, y: 840, size: 560 };
const LEAF_ASPECT = 776 / 926; // logo-leaf.png
const SETTLE = 98; // design frame the leaves land exactly on the logo

const wrapDeg = (deg: number) => ((((deg + 180) % 360) + 360) % 360) - 180;

/**
 * Nine gold leaves (one per leaf of the logo) glide in one after another,
 * straighten up and land exactly on top of each other, so the logo is
 * assembled from them instead of popping in.
 */
export const Intro: React.FC = () => {
  const frame = useCurrentFrame();

  const spin = interpolate(frame, [0, SETTLE], [-150, 0], {
    ...clamp,
    easing: Easing.bezier(0.3, 0.1, 0.2, 1),
  });
  const handover = interpolate(frame, [SETTLE - 2, SETTLE + 8], [0, 1], clamp);
  const glow = interpolate(frame, [SETTLE - 6, SETTLE + 26], [0.15, 1], {
    ...clamp,
    easing: Easing.out(Easing.quad),
  });
  const dolly = interpolate(frame, [0, 120], [1, 1.05], {
    ...clamp,
    easing: Easing.inOut(Easing.sin),
  });
  const tracking = interpolate(frame, [58, 120], [0.2, 0.1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const rule = interpolate(frame, [84, 112], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const presents = useFadeUp(92, 24, 18);

  return (
    <AbsoluteFill style={{ background: BG_VIOLET, overflow: "hidden" }}>
      <LightRays y="44%" opacity={interpolate(frame, [20, 100], [0, 0.7], clamp)} />
      <GoldDust count={34} seed="intro" opacity={0.55} drift={0.5} />

      <AbsoluteFill style={{ scale: String(dolly) }}>
        {new Array(9).fill(0).map((_, i) => {
          const p = interpolate(frame, [6 + i * 4, SETTLE], [0, 1], {
            ...clamp,
            easing: Easing.bezier(0.5, 0, 0.12, 1),
          });
          const orbit = i * 40 + spin;
          const rad = (orbit * Math.PI) / 180;
          const radius = interpolate(p, [0, 1], [680, 0]);
          const size = interpolate(p, [0, 1], [170, LOGO.size]);
          const width = size * LEAF_ASPECT;
          const x = LOGO.x + Math.sin(rad) * radius;
          const y = LOGO.y - Math.cos(rad) * radius;
          const appear = interpolate(frame, [4 + i * 4, 20 + i * 4], [0, 1], clamp);
          return (
            <Img
              key={i}
              src={staticFile("logo-leaf.png")}
              style={{
                position: "absolute",
                left: x - width / 2,
                top: y - size / 2,
                width,
                height: size,
                rotate: `${wrapDeg(orbit) * (1 - p)}deg`,
                opacity: appear * (1 - handover),
                filter: "drop-shadow(0 0 16px rgba(255,200,90,0.45))",
              }}
            />
          );
        })}

        <div
          style={{
            position: "absolute",
            left: LOGO.x - (LOGO.size * LEAF_ASPECT) / 2,
            top: LOGO.y - LOGO.size / 2,
            opacity: handover,
          }}
        >
          <GoldLogo
            size={LOGO.size}
            sheen={interpolate(frame, [SETTLE + 4, SETTLE + 24], [0, 1], clamp)}
            glow={glow}
          />
        </div>

        <div
          style={{
            position: "absolute",
            top: 1190,
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Reveal
            at={58}
            dur={34}
            style={{ display: "inline-block" }}
            innerStyle={{
              fontFamily: FONT_LUXE,
              fontWeight: 800,
              fontSize: 118,
              letterSpacing: `${tracking}em`,
              marginRight: `-${tracking}em`,
              whiteSpace: "nowrap",
              filter: "drop-shadow(0 6px 22px rgba(30,10,90,0.45))",
              ...textFill(GOLD_GRADIENT, `${interpolate(frame, [58, 130], [0, 70])}% 0`),
            }}
          >
            TOP GRASS
          </Reveal>
        </div>

        <div
          style={{
            position: "absolute",
            top: 1368,
            left: 540 - 210,
            width: 420,
            height: 3,
            background:
              "linear-gradient(90deg, rgba(233,196,92,0), #f3d98a 50%, rgba(233,196,92,0))",
            scale: `${rule} 1`,
            opacity: rule,
          }}
        />

        <div
          style={{
            position: "absolute",
            top: 1400,
            width: "100%",
            textAlign: "center",
            fontFamily: FONT_BODY,
            fontWeight: 600,
            fontSize: 44,
            letterSpacing: "0.6em",
            marginRight: "-0.6em",
            color: "#f6ebc6",
            textShadow: SOFT_SHADOW,
            ...presents,
          }}
        >
          PRESENTS
        </div>
      </AbsoluteFill>

      <Vignette strength={0.25} />
    </AbsoluteFill>
  );
};
