import { Audio } from "@remotion/media";
import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { Arriving } from "./scenes/Arriving";
import { EndCard } from "./scenes/EndCard";
import { Envelope } from "./scenes/Envelope";
import { Intro } from "./scenes/Intro";
import { KaleidoJars } from "./scenes/KaleidoJars";
import { Scope } from "./scenes/Scope";
import { Strains } from "./scenes/Strains";
import { Title } from "./scenes/Title";
import { Winner } from "./scenes/Winner";
import { SCENES } from "./timeline";
import "./theme";

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

export const Promo: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    {ORDER.map(({ id, Scene, from, duration }) => (
      <Sequence key={id} name={id} from={from} durationInFrames={duration} premountFor={30}>
        <Scene />
      </Sequence>
    ))}
    <Audio src={staticFile("music.wav")} />
  </AbsoluteFill>
);
