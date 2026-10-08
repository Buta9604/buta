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

// Deep jewel violet instead of black: gold and every strain colour read well on it.
export const INK = "#241565";
export const BG_VIOLET =
  "radial-gradient(ellipse 110% 75% at 50% 32%, #6a43c4 0%, #46289a 34%, #2b1a74 68%, #1d1257 100%)";

/** Tinted frosted glass for text over footage: coloured, never black. */
export const glassPanel = (tint = "rgba(54, 30, 128, 0.46)"): React.CSSProperties => ({
  background: tint,
  backdropFilter: "blur(22px) saturate(1.35)",
  WebkitBackdropFilter: "blur(22px) saturate(1.35)",
  border: "1.5px solid rgba(255,255,255,0.3)",
  boxShadow: "0 24px 70px rgba(28,10,90,0.35), inset 0 1px 0 rgba(255,255,255,0.28)",
});

export const SOFT_SHADOW = "0 3px 18px rgba(24,8,80,0.55), 0 1px 3px rgba(24,8,80,0.6)";

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

// Bright jewels only (no sapphire/amethyst): readable on the violet backgrounds.
export const PRISM_BRIGHT = `linear-gradient(90deg, ${[
  "#ff5a6e",
  "#ffb02e",
  "#ffe24a",
  "#3be08a",
  "#35d6e8",
  "#ff5fb8",
  "#ff5a6e",
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
