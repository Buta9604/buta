import { Audio } from "@remotion/media";
import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { Arriving } from "./scenes/Arriving";
import { Cup } from "./scenes/Cup";
import { EndCard } from "./scenes/EndCard";
import { Intro } from "./scenes/Intro";
import { KaleidoJars } from "./scenes/KaleidoJars";
import { Scope } from "./scenes/Scope";
import { Strains } from "./scenes/Strains";
import { Title } from "./scenes/Title";
import { SCENES } from "./timeline";
import "./theme";

const ORDER = [
  { name: "Intro", Scene: Intro, ...SCENES.intro },
  { name: "Title", Scene: Title, ...SCENES.title },
  { name: "Now Arriving", Scene: Arriving, ...SCENES.arriving },
  { name: "Kaleidoscope Jars", Scene: KaleidoJars, ...SCENES.kaleido },
  { name: "Strains", Scene: Strains, ...SCENES.strains },
  { name: "Under the Scope", Scene: Scope, ...SCENES.scope },
  { name: "Cannabis Cup", Scene: Cup, ...SCENES.cup },
  { name: "End Card", Scene: EndCard, ...SCENES.end },
];

export const Promo: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    {ORDER.map(({ name, Scene, from, duration }) => (
      <Sequence key={name} name={name} from={from} durationInFrames={duration} premountFor={30}>
        <Scene />
      </Sequence>
    ))}
    <Audio src={staticFile("music.wav")} />
  </AbsoluteFill>
);
