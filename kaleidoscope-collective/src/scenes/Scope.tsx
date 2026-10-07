import { Video } from "@remotion/media";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { FONT_BODY } from "../theme";
import { FOOTAGE } from "../timeline";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const CUT = 30;

// Centre of the monitor's picture in the source frame; the zoom crops the
// monitor bezel out so only the magnified flower is on screen.
const SCREEN_CENTER_Y = 825;

const Trichomes: React.FC = () => {
  const frame = useCurrentFrame();
  const s = interpolate(frame, [0, 100], [1.45, 1.55], {
    ...clamp,
    easing: Easing.inOut(Easing.sin),
  });
  return (
    <AbsoluteFill
      style={{
        opacity: interpolate(frame, [0, 10], [0, 1], clamp),
        scale: String(s),
        translate: `0 ${(960 - SCREEN_CENTER_Y) * s}px`,
      }}
    >
      <Video
        src={staticFile("footage.mp4")}
        trimBefore={FOOTAGE.monitorFull}
        muted
        objectFit="cover"
        style={{ width: "100%", height: "100%" }}
      />
    </AbsoluteFill>
  );
};

/**
 * 30-34 s. The real microscope view, kept clean: the AmScope camera, then the
 * magnified trichomes full frame with one quiet caption.
 */
export const Scope: React.FC = () => {
  const frame = useCurrentFrame();
  const caption = interpolate(frame, [44, 58, 106, 118], [0, 1, 1, 0], {
    ...clamp,
    easing: Easing.inOut(Easing.quad),
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      <Sequence durationInFrames={CUT + 10} layout="absolute-fill">
        <AbsoluteFill
          style={{
            opacity: interpolate(frame, [0, 8], [0, 1], clamp),
            scale: String(interpolate(frame, [0, CUT + 10], [1.05, 1.15])),
          }}
        >
          <Video
            src={staticFile("footage.mp4")}
            trimBefore={FOOTAGE.microscope + 8}
            muted
            objectFit="cover"
            style={{ width: "100%", height: "100%" }}
          />
        </AbsoluteFill>
      </Sequence>
      <Sequence from={CUT} layout="absolute-fill">
        <Trichomes />
      </Sequence>

      <AbsoluteFill
        style={{
          justifyContent: "flex-end",
          paddingLeft: 90,
          paddingBottom: 200,
          opacity: caption,
          background: `linear-gradient(180deg, rgba(0,0,0,0) 70%, rgba(0,0,0,${0.55 * caption}) 100%)`,
        }}
      >
        <div
          style={{
            fontFamily: FONT_BODY,
            fontWeight: 700,
            fontSize: 46,
            letterSpacing: "0.3em",
            color: "#fff",
            textShadow: "0 2px 16px rgba(0,0,0,0.8)",
          }}
        >
          UNDER THE SCOPE
        </div>
        <div
          style={{
            marginTop: 10,
            fontFamily: FONT_BODY,
            fontWeight: 500,
            fontSize: 38,
            color: "#e8e1d2",
            textShadow: "0 2px 16px rgba(0,0,0,0.8)",
          }}
        >
          Real trichomes, magnified.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
