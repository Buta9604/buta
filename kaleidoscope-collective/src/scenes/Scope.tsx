import { Video } from "@remotion/media";
import { AbsoluteFill, Easing, interpolate, Sequence, staticFile } from "remotion";
import { Reveal, useFadeUp } from "../components/Reveal";
import { useCurrentFrame } from "../time";
import { FONT_BODY, SOFT_SHADOW } from "../theme";
import { FOOTAGE, OVERLAP, SLOW } from "../timeline";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const CUT = 34; // design frame where the monitor shot takes over
const real = (design: number) => Math.round(design * SLOW);

// Centre of the monitor's picture in the source frame; the zoom crops the
// monitor bezel out so only the magnified flower is on screen.
const SCREEN_CENTER_Y = 825;

/**
 * The real microscope view, kept clean: the AmScope camera, then the
 * magnified trichomes full frame with one quiet caption.
 */
export const Scope: React.FC = () => {
  const frame = useCurrentFrame();

  const cam = interpolate(frame, [0, CUT + 12], [1.05, 1.14], clamp);
  const camIn = interpolate(frame, [-4, 8], [0, 1], clamp);

  const s = interpolate(frame, [CUT, 120], [1.45, 1.58], {
    ...clamp,
    easing: Easing.inOut(Easing.sin),
  });
  const monitorIn = interpolate(frame, [CUT - 2, CUT + 12], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.quad),
  });
  const sub = useFadeUp(66, 24, 18);

  return (
    <AbsoluteFill style={{ backgroundColor: "#3a2a7a", overflow: "hidden" }}>
      <Sequence from={0} durationInFrames={OVERLAP + real(CUT + 14)} layout="absolute-fill">
        <AbsoluteFill style={{ opacity: camIn, scale: String(cam), filter: "saturate(1.15) brightness(1.05)" }}>
          <Video
            src={staticFile("footage.mp4")}
            trimBefore={FOOTAGE.microscope + 8}
            playbackRate={1 / SLOW}
            muted
            objectFit="cover"
            style={{ width: "100%", height: "100%" }}
          />
        </AbsoluteFill>
      </Sequence>

      <Sequence from={OVERLAP + real(CUT - 4)} layout="absolute-fill">
        <AbsoluteFill
          style={{
            opacity: monitorIn,
            scale: String(s),
            translate: `0 ${(960 - SCREEN_CENTER_Y) * s}px`,
          }}
        >
          <Video
            src={staticFile("footage.mp4")}
            trimBefore={FOOTAGE.monitorFull}
            playbackRate={1 / SLOW}
            muted
            objectFit="cover"
            style={{ width: "100%", height: "100%" }}
          />
        </AbsoluteFill>
      </Sequence>

      <AbsoluteFill
        style={{
          justifyContent: "flex-end",
          alignItems: "flex-start",
          paddingLeft: 90,
          paddingBottom: 210,
          gap: 12,
        }}
      >
        <Reveal
          at={52}
          dur={30}
          innerStyle={{
            fontFamily: FONT_BODY,
            fontWeight: 700,
            fontSize: 56,
            letterSpacing: "0.26em",
            color: "#fff",
            textShadow: SOFT_SHADOW,
            whiteSpace: "nowrap",
          }}
        >
          UNDER THE SCOPE
        </Reveal>
        <div
          style={{
            fontFamily: FONT_BODY,
            fontWeight: 500,
            fontSize: 44,
            color: "#fff",
            textShadow: SOFT_SHADOW,
            ...sub,
          }}
        >
          Real trichomes, magnified.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
