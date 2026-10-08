# The Kaleidoscope Collective · Top Grass promo

A 53-second vertical (1080×1920, 30 fps) motion piece for the new
Kaleidoscope Collective line at Top Grass, 28 Sawgrass Drive, Bellport, NY 11713.
Built with [Remotion](https://remotion.dev), with an original soundtrack
synthesized in `scripts/make-music.py` (90 BPM, every scene change on a downbeat).

Finished renders are in `renders/`.

## Scenes

| Time | Scene | What happens |
| --- | --- | --- |
| 0:00 | Intro | Nine gold leaves glide in one after another and land exactly on the 9-leaf logo, "TOP GRASS presents" |
| 0:05 | Title | Stained glass blooms out of the centre behind a frosted plaque, then shatters |
| 0:11 | Now Arriving | The display's model train with a split-flap departure board |
| 0:16 | Kaleidoscope | The jar footage as a slowly turning kaleidoscope, iris onto the jars |
| 0:21 | Strains | Camera glides jar to jar: Blue Zushi, MOB, Berry Float |
| 0:29 | Envelope | "And 1st place goes to…" over the drum roll |
| 0:32 | Winner | Permanent Marker, 1st place at the High Times NY Cannabis Cup: coin-flip medal, wreath, light rays, jar reveal |
| 0:40 | Under the Scope | The real microscope view of the trichomes, no effects |
| 0:45 | End card | Logo, product, address, 21+ notice |

Scenes are written in "design frames" and played `SLOW` (4/3) times slower
(`src/time.ts`); each scene crossfades in over the one before it, finishing on
the downbeat.

## Working on it

```bash
npm install
scripts/prepare-assets.sh          # rebuild frames, still, and music from public/footage.mp4
npm run dev                        # Remotion Studio
npx remotion render KaleidoscopeCollective out/video.mp4
```

Strain names and THC figures come from the jar labels in the source clip;
timing lives in `src/timeline.ts`.
