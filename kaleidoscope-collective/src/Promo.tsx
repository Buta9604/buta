import { Audio } from "@remotion/media";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame as useRealFrame,
} from "remotion";
import { Arriving } from "./scenes/Arriving";
import { EndCard } from "./scenes/EndCard";
import { Envelope } from "./scenes/Envelope";
import { Intro } from "./scenes/Intro";
import { KaleidoJars } from "./scenes/KaleidoJars";
import { Scope } from "./scenes/Scope";
import { Strains } from "./scenes/Strains";
import { Title } from "./scenes/Title";
import { Winner } from "./scenes/Winner";
import { SceneOffset } from "./time";
import { INK } from "./theme";
import { OVERLAP, SCENES } from "./timeline";

export const ORDER = [
  { id: "Intro", Scene: Intro, ...SCENES.intro },
  { id: "Title", Scene: Title, ...SCENES.title },
  { id: "Arriving", Scene: Arriving, ...SCENES.arriving },
  { id: "KaleidoJars", Scene: KaleidoJars, ...SCENES.kaleido },
  { id: "Strains", Scene: Strains, ...SCENES.strains },
  { id: "Envelope", Scene: Envelope, ...SCENES.envelope },
  { id: "Winner", Scene: Winner, ...SCENES.winner },
  { id: "Scope", Scene: Scope, ...SCENES.scope },
  { id: "EndCard", Scene: EndCard, ...SCENES.end },
];

/**
 * Each scene starts OVERLAP frames early and fades in over the end of the
 * scene before it, so the crossfade finishes exactly on the downbeat.
 */
const SceneShell: React.FC<{ overlap: number; children: React.ReactNode }> = ({
  overlap,
  children,
}) => {
  const frame = useRealFrame();
  const opacity = overlap
    ? interpolate(frame, [0, overlap], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.inOut(Easing.sin),
      })
    : 1;
  return (
    <AbsoluteFill style={{ opacity }}>
      <SceneOffset value={overlap}>{children}</SceneOffset>
    </AbsoluteFill>
  );
};

export const Promo: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: INK }}>
    {ORDER.map(({ id, Scene, from, duration }, i) => {
      const overlap = i === 0 ? 0 : OVERLAP;
      return (
        <Sequence
          key={id}
          name={id}
          from={from - overlap}
          durationInFrames={duration + overlap}
          premountFor={30}
        >
          <SceneShell overlap={overlap}>
            <Scene />
          </SceneShell>
        </Sequence>
      );
    })}
    <Audio src={staticFile("music.wav")} />
  </AbsoluteFill>
);
