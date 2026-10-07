# The Kaleidoscope Collective · Top Grass promo

A 40-second vertical (1080×1920, 30 fps) motion piece for the new
Kaleidoscope Collective line at Top Grass, 28 Sawgrass Drive, Bellport, NY 11713.
Built with [Remotion](https://remotion.dev), with an original soundtrack
synthesized in `scripts/make-music.py` (120 BPM, every cut on a downbeat).

Finished renders are in `renders/`.

## Scenes

| Time | Scene | What happens |
| --- | --- | --- |
| 0–4 s | Intro | Nine gold leaves orbit in and settle into the 9-leaf logo, "TOP GRASS presents" |
| 4–8 s | Title | Stained glass assembles around the title, then shatters |
| 8–12 s | Now Arriving | The display's model train with a split-flap departure board |
| 12–16 s | Kaleidoscope | The jar footage as a slowly turning kaleidoscope, iris onto the jars |
| 16–22 s | Strains | Camera glides jar to jar: Blue Zushi, MOB, Berry Float |
| 22–24 s | Envelope | "And 1st place goes to…" over the drum roll |
| 24–30 s | Winner | Permanent Marker, 1st place at the High Times NY Cannabis Cup: wreath, medal, jar reveal |
| 30–34 s | Under the Scope | The real microscope view of the trichomes, no effects |
| 34–40 s | End card | Logo, product, address, 21+ notice |

## Working on it

```bash
npm install
scripts/prepare-assets.sh          # rebuild frames, still, and music from public/footage.mp4
npm run dev                        # Remotion Studio
npx remotion render KaleidoscopeCollective out/video.mp4
```

Strain names and THC figures come from the jar labels in the source clip;
timing lives in `src/timeline.ts`.
