import { Video } from "@remotion/media";
import { AbsoluteFill, Easing, interpolate, staticFile, useCurrentFrame } from "remotion";
import { PrismFlash, Vignette } from "../components/Effects";
import { SplitFlap } from "../components/SplitFlap";
import { FONT_BODY, JEWELS } from "../theme";
import { FOOTAGE } from "../timeline";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** 8-12 s. The display's model train pulls in, departure-board style. */
export const Arriving: React.FC = () => {
  const frame = useCurrentFrame();
  const boardIn = interpolate(frame, [4, 18], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const boardOut = interpolate(frame, [106, 118], [1, 0], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          scale: String(interpolate(frame, [0, 120], [1.12, 1.28])),
          filter: "saturate(1.25) contrast(1.08)",
        }}
      >
        <Video
          src={staticFile("footage.mp4")}
          trimBefore={FOOTAGE.train}
          playbackRate={0.5}
          muted
          objectFit="cover"
          style={{ width: "100%", height: "100%" }}
        />
      </AbsoluteFill>

      {/* Warm top/bottom grade for legibility */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(7,6,10,0.85) 0%, rgba(7,6,10,0.15) 34%, rgba(7,6,10,0) 60%, rgba(7,6,10,0.75) 100%)",
        }}
      />

      <AbsoluteFill
        style={{
          alignItems: "center",
          paddingTop: 210,
          opacity: boardIn * boardOut,
          translate: `0 ${interpolate(boardIn, [0, 1], [-60, 0])}px`,
        }}
      >
        <div
          style={{
            padding: "34px 40px 40px",
            borderRadius: 28,
            background: "rgba(10, 8, 14, 0.82)",
            border: "2px solid rgba(255, 211, 107, 0.35)",
            boxShadow: "0 30px 80px rgba(0,0,0,0.6), inset 0 0 40px rgba(255,211,107,0.06)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 22,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              fontFamily: FONT_BODY,
              fontWeight: 600,
              fontSize: 34,
              letterSpacing: "0.32em",
              color: "#f5ecd6",
            }}
          >
            <div
              style={{
                width: 18,
                height: 18,
                borderRadius: 9,
                background: JEWELS[2],
                boxShadow: `0 0 18px ${JEWELS[2]}`,
                opacity: Math.floor(frame / 8) % 2 ? 1 : 0.35,
              }}
            />
            NOW ARRIVING
          </div>
          <SplitFlap text="KALEIDOSCOPE" start={10} fontSize={70} />
          <SplitFlap text="COLLECTIVE" start={22} fontSize={70} color="#f6c915" />
        </div>
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          justifyContent: "flex-end",
          alignItems: "center",
          paddingBottom: 230,
          opacity: interpolate(frame, [40, 56], [0, 1], clamp) * boardOut,
        }}
      >
        <div
          style={{
            fontFamily: FONT_BODY,
            fontWeight: 700,
            fontSize: 46,
            letterSpacing: "0.22em",
            color: "#fff",
            textShadow: "0 4px 24px rgba(0,0,0,0.8)",
          }}
        >
          NEXT STOP: TOP GRASS
        </div>
      </AbsoluteFill>

      <Vignette strength={0.55} />
      <PrismFlash at={0} />
      <PrismFlash at={120} length={16} />
    </AbsoluteFill>
  );
};
