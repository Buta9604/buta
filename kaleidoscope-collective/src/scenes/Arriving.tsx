import { Video } from "@remotion/media";
import { AbsoluteFill, Easing, interpolate, staticFile } from "remotion";
import { Vignette } from "../components/Effects";
import { SplitFlap } from "../components/SplitFlap";
import { useCurrentFrame } from "../time";
import { FONT_BODY, glassPanel, JEWELS, SOFT_SHADOW } from "../theme";
import { FOOTAGE, SLOW } from "../timeline";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** The display's model train glides in under a split-flap departure board. */
export const Arriving: React.FC = () => {
  const frame = useCurrentFrame();
  const boardIn = interpolate(frame, [6, 34], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const boardOut = interpolate(frame, [100, 116], [0, 1], {
    ...clamp,
    easing: Easing.in(Easing.quad),
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#3a2a7a", overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          scale: String(interpolate(frame, [0, 120], [1.1, 1.22], { ...clamp, easing: Easing.inOut(Easing.sin) })),
          filter: "saturate(1.2) contrast(1.05) brightness(1.06)",
        }}
      >
        <Video
          src={staticFile("footage.mp4")}
          trimBefore={FOOTAGE.train}
          playbackRate={0.5 / SLOW}
          muted
          objectFit="cover"
          style={{ width: "100%", height: "100%" }}
        />
      </AbsoluteFill>

      {/* a whisper of violet at the very top so the board sits well */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(60,34,140,0.32) 0%, rgba(60,34,140,0) 30%)",
        }}
      />

      <AbsoluteFill
        style={{
          alignItems: "center",
          paddingTop: 190,
          opacity: boardIn * (1 - boardOut),
          translate: `0 ${interpolate(boardIn, [0, 1], [-70, 0]) - boardOut * 40}px`,
        }}
      >
        <div
          style={{
            ...glassPanel("rgba(54, 30, 128, 0.58)"),
            padding: "36px 44px 44px",
            borderRadius: 34,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 24,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              fontFamily: FONT_BODY,
              fontWeight: 700,
              fontSize: 40,
              letterSpacing: "0.3em",
              color: "#fff",
            }}
          >
            <div
              style={{
                width: 20,
                height: 20,
                borderRadius: 10,
                background: JEWELS[2],
                boxShadow: `0 0 18px ${JEWELS[2]}`,
                opacity: 0.55 + 0.45 * Math.sin(frame / 7) ** 2,
              }}
            />
            NOW ARRIVING
          </div>
          <SplitFlap text="KALEIDOSCOPE" start={14} fontSize={70} tile="#2a1a70" />
          <SplitFlap text="COLLECTIVE" start={30} fontSize={70} color="#f6c915" tile="#2a1a70" />
        </div>
      </AbsoluteFill>

      <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 220 }}>
        <div
          style={{
            ...glassPanel("rgba(54, 30, 128, 0.6)"),
            padding: "24px 54px",
            borderRadius: 999,
            opacity: interpolate(frame, [52, 76], [0, 1], clamp) * (1 - boardOut),
            translate: `0 ${interpolate(frame, [52, 76], [30, 0], { ...clamp, easing: Easing.out(Easing.cubic) })}px`,
            fontFamily: FONT_BODY,
            fontWeight: 700,
            fontSize: 52,
            letterSpacing: "0.2em",
            color: "#fff",
            textShadow: SOFT_SHADOW,
            whiteSpace: "nowrap",
          }}
        >
          NEXT STOP: TOP GRASS
        </div>
      </AbsoluteFill>

      <Vignette strength={0.14} />
    </AbsoluteFill>
  );
};
