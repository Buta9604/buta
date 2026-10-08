import { Delaunay } from "d3-delaunay";
import { useMemo } from "react";
import { random } from "remotion";
import { JEWELS } from "../theme";

type Cell = {
  points: string;
  cx: number;
  cy: number;
  color: number;
  dist: number;
  seed: number;
};

type Props = {
  width: number;
  height: number;
  count: number;
  seed: string;
  /** 0 = no glass, 1 = every pane in place (panes grow out from the centre). */
  reveal: number;
  /** 0 = intact, 1 = panes blown out of frame. */
  shatter?: number;
  /** Phase of the light sweeping across the glass. */
  shimmer: number;
  leadWidth?: number;
  lead?: string;
};

/** Leaded stained glass, matching the jar label art. */
export const StainedGlass: React.FC<Props> = ({
  width,
  height,
  count,
  seed,
  reveal,
  shatter = 0,
  shimmer,
  leadWidth = 7,
  lead = "#1d1257",
}) => {
  const cells = useMemo<Cell[]>(() => {
    const pts: [number, number][] = [];
    for (let i = 0; i < count; i++) {
      pts.push([
        random(`${seed}-x-${i}`) * width,
        random(`${seed}-y-${i}`) * height,
      ]);
    }
    const voronoi = Delaunay.from(pts).voronoi([0, 0, width, height]);
    return pts.map(([x, y], i) => {
      const poly = voronoi.cellPolygon(i) ?? [];
      return {
        points: poly.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" "),
        cx: x,
        cy: y,
        color: Math.floor(random(`${seed}-c-${i}`) * JEWELS.length),
        dist: Math.hypot(x - width / 2, y - height / 2),
        seed: random(`${seed}-s-${i}`),
      };
    });
  }, [count, seed, width, height]);

  const maxDist = Math.hypot(width / 2, height / 2);

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ position: "absolute", inset: 0 }}
    >
      <defs>
        {JEWELS.map((c, i) => (
          <linearGradient key={c} id={`${seed}-g${i}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity={0.55} />
            <stop offset="22%" stopColor={c} />
            <stop offset="100%" stopColor={c} stopOpacity={0.75} />
          </linearGradient>
        ))}
      </defs>
      <rect width={width} height={height} fill={lead} />
      {cells.map((cell, i) => {
        const local = Math.min(
          1,
          Math.max(0, (reveal * (maxDist + 300) - cell.dist) / 300),
        );
        if (local <= 0) return null;
        const grow = 1 - Math.pow(1 - local, 3);
        const dx = (cell.cx - width / 2) / maxDist;
        const dy = (cell.cy - height / 2) / maxDist;
        const blast = shatter * shatter * (900 + cell.seed * 900);
        const spin = shatter * (cell.seed - 0.5) * 540;
        const glow =
          0.84 +
          0.16 *
            Math.max(
              0,
              Math.cos((cell.dist / maxDist) * 6 - shimmer * Math.PI * 2),
            );
        return (
          <polygon
            key={i}
            points={cell.points}
            fill={`url(#${seed}-g${cell.color})`}
            stroke={lead}
            strokeWidth={leadWidth}
            strokeLinejoin="round"
            opacity={glow * (1 - shatter * 0.6)}
            transform={`translate(${dx * blast} ${dy * blast}) rotate(${spin} ${cell.cx} ${cell.cy}) translate(${cell.cx} ${cell.cy}) scale(${grow}) translate(${-cell.cx} ${-cell.cy})`}
          />
        );
      })}
    </svg>
  );
};
