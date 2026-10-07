import "@fontsource-variable/unbounded";
import "@fontsource-variable/cinzel";
import "@fontsource-variable/space-grotesk";
import { continueRender, delayRender } from "remotion";

export const FONT_DISPLAY = "'Unbounded Variable', sans-serif";
export const FONT_LUXE = "'Cinzel Variable', serif";
export const FONT_BODY = "'Space Grotesk Variable', sans-serif";

const fontHandle = delayRender("Loading fonts");
Promise.all([
  document.fonts.load(`900 100px 'Unbounded Variable'`),
  document.fonts.load(`700 100px 'Cinzel Variable'`),
  document.fonts.load(`500 100px 'Space Grotesk Variable'`),
])
  .then(() => continueRender(fontHandle))
  .catch(() => continueRender(fontHandle));

export const INK = "#07060a";

// Jewel tones sampled from the stained-glass jar labels
export const JEWELS = [
  "#e8243c", // ruby
  "#1f6fe0", // sapphire
  "#22b35e", // emerald
  "#f6c915", // citrine
  "#7b3fe4", // amethyst
  "#19b6c9", // teal
  "#e0338f", // magenta
  "#f47c20", // amber
];

export const GOLD_GRADIENT =
  "linear-gradient(100deg, #8a6a1c 0%, #d4a83a 18%, #fff4c2 32%, #e9c45c 44%, #a57d24 60%, #f7e7a1 76%, #c99a2e 90%, #7a5a14 100%)";

export const PRISM_GRADIENT = `linear-gradient(90deg, ${[
  ...JEWELS,
  JEWELS[0],
].join(", ")})`;

export const textFill = (
  gradient: string,
  position: string,
  size = "300% 100%",
): React.CSSProperties => ({
  backgroundImage: gradient,
  backgroundSize: size,
  backgroundPosition: position,
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  WebkitTextFillColor: "transparent",
  color: "transparent",
});
