// Render preview stills of the main composition: node scripts/stills.mjs out-dir 60 120 ...
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";

const [outDir, ...frames] = process.argv.slice(2);
const browserExecutable = process.env.REMOTION_BROWSER ?? null;
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const composition = await selectComposition({ serveUrl, id: "KaleidoscopeCollective", browserExecutable });
for (const f of frames) {
  const output = path.join(outDir, `f${String(f).padStart(4, "0")}.jpg`);
  await renderStill({ serveUrl, composition, frame: Number(f), output, imageFormat: "jpeg", jpegQuality: 85, browserExecutable });
  console.log("rendered", output);
}
