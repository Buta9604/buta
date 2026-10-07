#!/usr/bin/env bash
# Rebuild derived media from public/footage.mp4.
# Usage: scripts/prepare-assets.sh [path/to/original.mov]
set -euo pipefail
cd "$(dirname "$0")/.."
if [ $# -ge 1 ]; then
  # Re-encode the phone clip upright at 1080x1920, 30 fps, no audio.
  ffmpeg -v error -y -i "$1" -map 0:v:0 -an -vf "scale=1080:1920,fps=30,format=yuv420p" \
    -c:v libx264 -crf 17 -preset slow -g 15 -movflags +faststart public/footage.mp4
fi
mkdir -p public/frames
# Frame sequence the canvas kaleidoscope samples from.
ffmpeg -v error -y -i public/footage.mp4 -vf "scale=720:1280" -q:v 3 -start_number 0 public/frames/%04d.jpg
# Sharp still of the four jars used by the strain and Cup scenes.
ffmpeg -v error -y -ss 3.3 -i public/footage.mp4 -frames:v 1 -q:v 1 public/jars-still.jpg
python3 scripts/make-music.py public/music.wav
