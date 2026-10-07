import { Composition, Folder } from "remotion";
import { ORDER, Promo } from "./Promo";
import { FPS, HEIGHT, TOTAL_FRAMES, WIDTH } from "./timeline";

const video = { fps: FPS, width: WIDTH, height: HEIGHT };

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="KaleidoscopeCollective" component={Promo} durationInFrames={TOTAL_FRAMES} {...video} />
    <Folder name="Scenes">
      {ORDER.map(({ id, Scene, duration }) => (
        <Composition key={id} id={id} component={Scene} durationInFrames={duration} {...video} />
      ))}
    </Folder>
  </>
);
