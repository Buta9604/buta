import { Composition, Folder } from "remotion";
import { Promo } from "./Promo";
import { Arriving } from "./scenes/Arriving";
import { Cup } from "./scenes/Cup";
import { EndCard } from "./scenes/EndCard";
import { Intro } from "./scenes/Intro";
import { KaleidoJars } from "./scenes/KaleidoJars";
import { Scope } from "./scenes/Scope";
import { Strains } from "./scenes/Strains";
import { Title } from "./scenes/Title";
import { FPS, HEIGHT, SCENES, TOTAL_FRAMES, WIDTH } from "./timeline";

const video = { fps: FPS, width: WIDTH, height: HEIGHT };

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="KaleidoscopeCollective" component={Promo} durationInFrames={TOTAL_FRAMES} {...video} />
    <Folder name="Scenes">
      <Composition id="Intro" component={Intro} durationInFrames={SCENES.intro.duration} {...video} />
      <Composition id="Title" component={Title} durationInFrames={SCENES.title.duration} {...video} />
      <Composition id="Arriving" component={Arriving} durationInFrames={SCENES.arriving.duration} {...video} />
      <Composition id="KaleidoJars" component={KaleidoJars} durationInFrames={SCENES.kaleido.duration} {...video} />
      <Composition id="Strains" component={Strains} durationInFrames={SCENES.strains.duration} {...video} />
      <Composition id="Scope" component={Scope} durationInFrames={SCENES.scope.duration} {...video} />
      <Composition id="Cup" component={Cup} durationInFrames={SCENES.cup.duration} {...video} />
      <Composition id="EndCard" component={EndCard} durationInFrames={SCENES.end.duration} {...video} />
    </Folder>
  </>
);
