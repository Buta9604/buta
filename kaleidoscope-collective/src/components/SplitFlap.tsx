import { random, useCurrentFrame } from "remotion";
import { FONT_BODY } from "../theme";

const CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

/** Departure-board text that flips through letters before settling. */
export const SplitFlap: React.FC<{
  text: string;
  start: number;
  stagger?: number;
  fontSize: number;
  color?: string;
  tile?: string;
}> = ({ text, start, stagger = 1.6, fontSize, color = "#ffd36b", tile = "#16131c" }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "flex", gap: fontSize * 0.08 }}>
      {text.split("").map((target, i) => {
        const settleAt = start + 8 + i * stagger;
        const visible = frame >= start + i * stagger * 0.5;
        const flipping = frame < settleAt;
        const ch =
          target === " "
            ? " "
            : flipping
              ? CHARSET[Math.floor(random(`${text}${i}${Math.floor(frame / 2)}`) * CHARSET.length)]
              : target;
        const w = fontSize * 0.74;
        return (
          <div
            key={i}
            style={{
              position: "relative",
              width: w,
              height: fontSize * 1.3,
              borderRadius: fontSize * 0.08,
              background: target === " " ? "transparent" : tile,
              boxShadow: target === " " ? undefined : "inset 0 -2px 0 rgba(255,255,255,0.06), 0 4px 10px rgba(0,0,0,0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontFamily: FONT_BODY,
              fontWeight: 700,
              fontSize,
              color,
              opacity: visible ? 1 : 0,
              textShadow: flipping ? undefined : `0 0 ${fontSize * 0.3}px ${color}88`,
            }}
          >
            {ch}
            {target !== " " ? (
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: "50%",
                  height: 2,
                  background: "rgba(0,0,0,0.7)",
                }}
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
};
