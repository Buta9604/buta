import { AbsoluteFill, Easing, Img, interpolate, random, staticFile } from "remotion";
import { ImpactFlash, LightRays, Vignette } from "../components/Effects";
import { Reveal, useFadeUp } from "../components/Reveal";
import { cameraOn, cameraStyle, JARS, mixCamera } from "../jars";
import { useCurrentFrame } from "../time";
import {
  BG_VIOLET,
  FONT_BODY,
  FONT_DISPLAY,
  FONT_LUXE,
  GOLD_GRADIENT,
  SOFT_SHADOW,
  textFill,
} from "../theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const PM = JARS.permanentMarker;
const LEAVES_PER_SIDE = 8;
const WREATH_RADIUS = 300;
const LEAF_ASPECT = 776 / 926;

/** Laurel wreath grown from the Top Grass leaf, one leaf at a time. */
const Wreath: React.FC = () => {
  const frame = useCurrentFrame();
  const leaves = [];
  for (const side of [-1, 1]) {
    for (let j = 0; j < LEAVES_PER_SIDE; j++) {
      // Angle clockwise from 12 o'clock; the two branches climb from the bottom.
      const along = j / (LEAVES_PER_SIDE - 1);
      const angle = side * interpolate(along, [0, 1], [160, 35]);
      const rad = (angle * Math.PI) / 180;
      const size = interpolate(along, [0, 1], [130, 92]);
      const grow = interpolate(frame, [14 + j * 5, 38 + j * 5], [0, 1], {
        ...clamp,
        easing: Easing.bezier(0.34, 1.3, 0.64, 1),
      });
      leaves.push(
        <Img
          key={`${side}-${j}`}
          src={staticFile("logo-leaf.png")}
          style={{
            position: "absolute",
            left: Math.sin(rad) * WREATH_RADIUS - (size * LEAF_ASPECT) / 2,
            top: -Math.cos(rad) * WREATH_RADIUS - size / 2,
            height: size,
            width: size * LEAF_ASPECT,
            rotate: `${angle - side * 90 + side * 28}deg`,
            scale: String(grow),
            opacity: Math.min(1, grow * 1.5),
            filter: "drop-shadow(0 0 10px rgba(255,200,90,0.5))",
          }}
        />,
      );
    }
  }
  return <div style={{ position: "absolute", left: 0, top: 0 }}>{leaves}</div>;
};

const FACE: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  borderRadius: "50%",
  backfaceVisibility: "hidden",
  WebkitBackfaceVisibility: "hidden",
  background:
    "radial-gradient(circle at 35% 30%, #fff6cf 0%, #f2cf6b 22%, #c99a2e 55%, #8a6a1c 100%)",
  boxShadow:
    "0 0 0 10px #7a5a14, 0 0 0 16px #e9c45c, 0 30px 80px rgba(30,10,90,0.45), 0 0 120px rgba(255,200,90,0.5)",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
};

/** Gold medal that spins in like a flipped coin, then unfurls its ribbons. */
const Medal: React.FC = () => {
  const frame = useCurrentFrame();
  const spinT = interpolate(frame, [0, 46], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.1, 0.7, 0.2, 1),
  });
  const rotateY = (1 - spinT) * 900;
  const ribbon = interpolate(frame, [40, 76], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const sheen = interpolate((frame - 48) % 90, [0, 36], [-60, 160], clamp);

  return (
    <div style={{ position: "absolute", left: -215, top: -215, width: 430, height: 430 }}>
      <svg
        width={430}
        height={620}
        viewBox="0 0 430 620"
        style={{
          position: "absolute",
          left: 0,
          top: 120,
          transformOrigin: "50% 28%",
          scale: `1 ${ribbon}`,
          opacity: ribbon,
        }}
      >
        <path d="M150 180 L95 520 L150 480 L185 545 L215 220 Z" fill={PM.color} />
        <path d="M280 180 L335 520 L280 480 L245 545 L215 220 Z" fill="#5a2bb0" />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          transformStyle: "preserve-3d",
          transform: `perspective(1100px) rotateY(${rotateY}deg)`,
        }}
      >
        <div style={{ ...FACE, transform: "rotateY(180deg)" }}>
          <Img src={staticFile("logo-leaf.png")} style={{ height: 300, opacity: 0.85 }} />
        </div>
        <div style={FACE}>
          <div
            style={{
              position: "absolute",
              inset: 26,
              borderRadius: "50%",
              border: "4px solid rgba(90,60,10,0.55)",
            }}
          />
          <div
            style={{
              fontFamily: FONT_LUXE,
              fontWeight: 900,
              fontSize: 150,
              lineHeight: 0.9,
              color: "#4a3208",
              textShadow: "0 2px 0 rgba(255,240,190,0.7), 0 -1px 0 rgba(60,40,0,0.5)",
            }}
          >
            1<span style={{ fontSize: 70, verticalAlign: "top", marginLeft: 4 }}>ST</span>
          </div>
          <div
            style={{
              marginTop: 8,
              fontFamily: FONT_BODY,
              fontWeight: 700,
              fontSize: 40,
              letterSpacing: "0.35em",
              marginRight: "-0.35em",
              color: "#4a3208",
            }}
          >
            PLACE
          </div>
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(115deg, transparent ${sheen - 20}%, rgba(255,255,240,0.75) ${sheen}%, transparent ${sheen + 20}%)`,
              mixBlendMode: "screen",
            }}
          />
        </div>
      </div>
    </div>
  );
};

/** On the drop: Permanent Marker, 1st place. */
export const Winner: React.FC = () => {
  const frame = useCurrentFrame();

  const medalIn = interpolate(frame, [0, 24], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  // The medal glides to the top of the frame as the winning jar comes up.
  const lift = interpolate(frame, [84, 124], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.65, 0, 0.35, 1),
  });
  const badgeY = interpolate(lift, [0, 1], [820, 450]);
  const badgeScale =
    interpolate(medalIn, [0, 1], [0.5, 1]) * interpolate(lift, [0, 1], [1, 0.62]);
  const float = Math.sin(frame / 22) * 7 * (1 - lift);

  const jarIn = interpolate(frame, [88, 128], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const cam = mixCamera(
    cameraOn(PM.x, PM.y, 1.55, -200),
    cameraOn(PM.x, PM.y, 1.75, -200),
    interpolate(frame, [88, 180], [0, 1], clamp),
  );
  const cup = useFadeUp(34, 26, 20);
  const thc = useFadeUp(128, 24, 22);

  return (
    <AbsoluteFill style={{ background: BG_VIOLET, overflow: "hidden" }}>
      <LightRays
        y={`${(badgeY / 19.2).toFixed(1)}%`}
        opacity={interpolate(frame, [0, 30], [0, 0.85], clamp) * (1 - jarIn * 0.55)}
        speed={0.16}
      />
      <AbsoluteFill style={{ opacity: jarIn }}>
        <Img
          src={staticFile("jars-still.jpg")}
          style={{ ...cameraStyle(cam), filter: "saturate(1.15) brightness(1.04)" }}
        />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          opacity: jarIn,
          background:
            "linear-gradient(180deg, rgba(54,30,128,0.62) 0%, rgba(54,30,128,0.2) 30%, rgba(54,30,128,0) 46%, rgba(54,30,128,0) 64%, rgba(54,30,128,0.5) 100%)",
        }}
      />

      {/* Slow gold flakes, only in this scene */}
      {new Array(34).fill(0).map((_, i) => {
        const x = random(`flx${i}`) * 1080;
        const speed = 1.6 + random(`fls${i}`) * 2.2;
        const y = -60 + ((frame * speed + random(`fly${i}`) * 1920) % 2000);
        const size = 10 + random(`flz${i}`) * 16;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x + Math.sin(frame / 18 + i) * 30,
              top: y,
              width: size,
              height: size * 0.55,
              borderRadius: 3,
              background: GOLD_GRADIENT,
              backgroundSize: "300% 100%",
              backgroundPosition: `${(i * 23) % 100}% 0`,
              rotate: `${frame * (random(`flr${i}`) * 5 - 2.5) + i * 40}deg`,
              opacity: interpolate(frame, [6, 30], [0, 0.9], clamp),
            }}
          />
        );
      })}

      <div
        style={{
          position: "absolute",
          left: 540,
          top: badgeY + float,
          scale: String(badgeScale),
          opacity: Math.min(1, medalIn * 2),
        }}
      >
        <Wreath />
        <Medal />
      </div>

      <div
        style={{
          position: "absolute",
          top: interpolate(lift, [0, 1], [270, 70]),
          width: "100%",
          textAlign: "center",
          fontFamily: FONT_BODY,
          fontWeight: 700,
          fontSize: 38,
          letterSpacing: "0.28em",
          color: "#fff",
          textShadow: SOFT_SHADOW,
          ...cup,
        }}
      >
        HIGH TIMES · NEW YORK CANNABIS CUP
      </div>

      <div
        style={{
          position: "absolute",
          top: interpolate(lift, [0, 1], [1280, 1490]),
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {["PERMANENT", "MARKER"].map((word, i) => (
          <Reveal
            key={word}
            at={46 + i * 14}
            dur={34}
            style={{ display: "inline-block" }}
            innerStyle={{
              fontFamily: FONT_DISPLAY,
              fontWeight: 900,
              fontSize: 96,
              lineHeight: 1.06,
              whiteSpace: "nowrap",
              filter: "drop-shadow(0 4px 16px rgba(30,10,90,0.6))",
              ...textFill(GOLD_GRADIENT, `${(frame * 0.7) % 100}% 0`),
            }}
          >
            {word}
          </Reveal>
        ))}
        <div
          style={{
            marginTop: 24,
            fontFamily: FONT_BODY,
            fontWeight: 700,
            fontSize: 56,
            letterSpacing: "0.12em",
            color: "#fff",
            textShadow: SOFT_SHADOW,
            ...thc,
          }}
        >
          THC {PM.thc}%
        </div>
      </div>

      <Vignette strength={0.14} />
      <ImpactFlash at={0} length={18} color="#ffe9a8" peak={0.45} />
    </AbsoluteFill>
  );
};
