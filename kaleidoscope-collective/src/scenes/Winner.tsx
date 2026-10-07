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
import { cameraOn, cameraStyle, JARS, mixCamera } from "../jars";
import { FONT_BODY, FONT_DISPLAY, FONT_LUXE, GOLD_GRADIENT, textFill } from "../theme";

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
      // Angle measured clockwise from 12 o'clock; branches climb from the bottom.
      const along = j / (LEAVES_PER_SIDE - 1);
      const angle = side * interpolate(along, [0, 1], [160, 35]);
      const rad = (angle * Math.PI) / 180;
      const size = interpolate(along, [0, 1], [130, 92]);
      const grow = interpolate(frame, [6 + j * 3.5, 22 + j * 3.5], [0, 1], {
        ...clamp,
        easing: Easing.bezier(0.34, 1.4, 0.64, 1),
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
            // Tip follows the branch upward, tilted away from the medal.
            rotate: `${angle - side * 90 + side * 28}deg`,
            scale: String(grow),
            opacity: Math.min(1, grow * 1.5),
            filter: "drop-shadow(0 0 10px rgba(255,200,90,0.45))",
          }}
        />,
      );
    }
  }
  return <div style={{ position: "absolute", left: 0, top: 0 }}>{leaves}</div>;
};

const Medal: React.FC = () => {
  const frame = useCurrentFrame();
  const sheen = interpolate(frame % 75, [20, 55], [-60, 160], clamp);
  return (
    <div style={{ position: "absolute", left: -215, top: -215, width: 430, height: 430 }}>
      {/* Ribbon tails in the strain's colour */}
      <svg
        width={430}
        height={620}
        viewBox="0 0 430 620"
        style={{ position: "absolute", left: 0, top: 120 }}
      >
        <path d="M150 180 L95 520 L150 480 L185 545 L215 220 Z" fill={PM.color} />
        <path d="M280 180 L335 520 L280 480 L245 545 L215 220 Z" fill="#5a2bb0" />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 35% 30%, #fff6cf 0%, #f2cf6b 22%, #c99a2e 55%, #8a6a1c 100%)",
          boxShadow:
            "0 0 0 10px #7a5a14, 0 0 0 16px #e9c45c, 0 30px 80px rgba(0,0,0,0.6), 0 0 120px rgba(255,200,90,0.45)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
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
  );
};

/** 24-30 s, on the drop: Permanent Marker, 1st place. */
export const Winner: React.FC = () => {
  const frame = useCurrentFrame();

  const medalIn = interpolate(frame, [0, 22], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  // The badge lifts to the top of the frame as the winning jar comes up.
  const lift = interpolate(frame, [72, 104], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.65, 0, 0.35, 1),
  });
  const badgeY = interpolate(lift, [0, 1], [820, 450]);
  const badgeScale = interpolate(medalIn, [0, 1], [0.75, 1]) * interpolate(lift, [0, 1], [1, 0.62]);

  const jarIn = interpolate(frame, [76, 108], [0, 1], { ...clamp, easing: Easing.out(Easing.quad) });
  const cam = mixCamera(
    cameraOn(PM.x, PM.y, 1.55, -200),
    cameraOn(PM.x, PM.y, 1.75, -200),
    interpolate(frame, [76, 180], [0, 1], clamp),
  );
  const exit = interpolate(frame, [170, 180], [1, 0], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: "#07060a", overflow: "hidden" }}>
      <AbsoluteFill style={{ opacity: jarIn }}>
        <Img src={staticFile("jars-still.jpg")} style={{ ...cameraStyle(cam), filter: "saturate(1.15)" }} />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% ${badgeY / 19.2}%, rgba(60,44,10,${0.9 - jarIn * 0.5}) 0%, rgba(7,6,10,${1 - jarIn * 0.75}) 55%)`,
        }}
      />
      <AbsoluteFill
        style={{
          opacity: jarIn,
          background:
            "linear-gradient(180deg, rgba(7,6,10,0.92) 0%, rgba(7,6,10,0.55) 32%, rgba(7,6,10,0) 48%, rgba(7,6,10,0) 62%, rgba(7,6,10,0.92) 86%)",
        }}
      />

      {/* Slow gold flakes, only in this scene */}
      {new Array(36).fill(0).map((_, i) => {
        const x = random(`flx${i}`) * 1080;
        const speed = 2.2 + random(`fls${i}`) * 3;
        const y = -60 + ((frame * speed + random(`fly${i}`) * 1920) % 2000);
        const size = 10 + random(`flz${i}`) * 16;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x + Math.sin(frame / 14 + i) * 30,
              top: y,
              width: size,
              height: size * 0.55,
              borderRadius: 3,
              background: GOLD_GRADIENT,
              backgroundSize: "300% 100%",
              backgroundPosition: `${(i * 23) % 100}% 0`,
              rotate: `${frame * (random(`flr${i}`) * 8 - 4) + i * 40}deg`,
              opacity: interpolate(frame, [4, 20], [0, 0.9], clamp) * exit,
            }}
          />
        );
      })}

      <AbsoluteFill style={{ opacity: exit }}>
        <div
          style={{
            position: "absolute",
            left: 540,
            top: badgeY,
            scale: String(badgeScale),
            opacity: medalIn,
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
            fontSize: 36,
            letterSpacing: "0.3em",
            color: "#f5ecd6",
            opacity: interpolate(frame, [26, 40], [0, 1], clamp),
          }}
        >
          HIGH TIMES · NEW YORK CANNABIS CUP
        </div>

        <div
          style={{
            position: "absolute",
            top: interpolate(lift, [0, 1], [1290, 1500]),
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              fontFamily: FONT_DISPLAY,
              fontWeight: 900,
              fontSize: 92,
              lineHeight: 1.05,
            }}
          >
            {"PERMANENT".split("").map((ch, i) => (
              <WinnerLetter key={i} ch={ch} at={34 + i * 2} />
            ))}
          </div>
          <div
            style={{
              display: "flex",
              fontFamily: FONT_DISPLAY,
              fontWeight: 900,
              fontSize: 92,
              lineHeight: 1.05,
            }}
          >
            {"MARKER".split("").map((ch, i) => (
              <WinnerLetter key={i} ch={ch} at={52 + i * 2} />
            ))}
          </div>
          <div
            style={{
              marginTop: 22,
              fontFamily: FONT_BODY,
              fontWeight: 700,
              fontSize: 54,
              letterSpacing: "0.12em",
              color: "#f5ecd6",
              opacity: interpolate(frame, [110, 124], [0, 1], clamp),
            }}
          >
            THC {PM.thc}%
          </div>
        </div>
      </AbsoluteFill>

      <Vignette strength={0.5} />
      <ImpactFlash at={0} length={16} color="#ffe9a8" peak={0.6} />
    </AbsoluteFill>
  );
};

const WinnerLetter: React.FC<{ ch: string; at: number }> = ({ ch, at }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [at, at + 14], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  return (
    <span
      style={{
        display: "inline-block",
        opacity: t,
        translate: `0 ${interpolate(t, [0, 1], [30, 0])}px`,
        ...textFill(GOLD_GRADIENT, `${(frame * 1.2) % 100}% 0`),
        filter: "drop-shadow(0 4px 18px rgba(0,0,0,0.7)) drop-shadow(0 0 16px rgba(255,200,90,0.3))",
      }}
    >
      {ch}
    </span>
  );
};
